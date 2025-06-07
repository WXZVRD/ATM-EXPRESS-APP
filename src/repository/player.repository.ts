import {Pool, PoolClient} from "pg";
import DB from "../database";
import { TransactionRepository } from "./transaction.repository";
import { UUIDv4 } from "../types/external.types";
import { Player } from "../models/player.model";
import {UUID} from "../types/external.types";

interface IPlayerRepository {
    getById(playerId: UUID): Promise<Player | null>
    checkBalance(playerId: UUID): Promise<{ balance: number }>
    deposit(playerId: UUID, amount: number): Promise<void>
    withdraw(playerId: UUID, amount: number): Promise<void>
    transfer(from_player: UUID, to_player: UUID, amount: number): Promise<void>
}

/**
 * Repository class for handling player-related operations in the database.
 * Supports checking balances, deposits, withdrawals, and player-to-player transfers.
 */
export class PlayerRepository implements IPlayerRepository {
    private db: Pool;

    /**
     * Initializes a new instance of PlayerRepository.
     * @param transactionRepo - An instance of the TransactionRepository for recording transactions.
     */
    constructor(private readonly transactionRepo: TransactionRepository) {
        this.db = DB.getInstance();
    }

    /**
     * Retrieves a player by their UUID.
     * @param playerId - The UUID of the player.
     * @returns The player record, or null if not found.
     */
    async getById(playerId: UUID): Promise<Player | null> {
        const result = await this.db.query("SELECT * FROM players WHERE id = $1", [
            playerId,
        ]);
        const player = result.rows[0] || null;
        return player;
    }

    /**
     * Gets the current balance for a player.
     * @param playerId - The UUID of the player.
     * @returns An object containing the current balance.
     */
    async checkBalance(playerId: UUID): Promise<{ balance: number }> {
        const data = await this.db.query(
            "SELECT balance FROM players WHERE id = $1",
            [playerId]
        );
        return data.rows[0];
    }

    /**
     * Deposits money into a player's account.
     * Also logs the transaction.
     * @param playerId - The UUID of the player receiving the deposit.
     * @param amount - The amount to deposit.
     */
    async deposit(playerId: UUID, amount: number): Promise<void> {
        const client: PoolClient = await this.db.connect();

        try {
            await client.query("BEGIN");

            await client.query(
                "UPDATE players SET balance = balance + $1 WHERE id = $2",
                [amount, playerId]
            );

            await this.transactionRepo.addTransaction(
                client,
                UUIDv4(),
                null,
                playerId,
                amount,
                "deposit"
            );

            await client.query("COMMIT");
        } catch (e) {
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
    }

    /**
     * Withdraws money from a player's account.
     * Also logs the transaction.
     * @param playerId - The UUID of the player.
     * @param amount - The amount to withdraw.
     */
    async withdraw(playerId: UUID, amount: number): Promise<void> {
        const client = await this.db.connect();

        try {
            await client.query("BEGIN");

            await client.query(
                "UPDATE players SET balance = balance - $1 WHERE id = $2",
                [amount, playerId]
            );

            await this.transactionRepo.addTransaction(
                client,
                UUIDv4(),
                null,
                playerId,
                amount,
                "withdraw"
            );

            await client.query("COMMIT");
        } catch (e) {
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
    }

    /**
     * Transfers money from one player to another.
     * Also logs the transaction.
     * @param from_player - The UUID of the sender.
     * @param to_player - The UUID of the recipient.
     * @param amount - The amount to transfer.
     */
    async transfer(from_player: UUID, to_player: UUID, amount: number): Promise<void> {
        const client: PoolClient = await this.db.connect();

        try {
            await client.query("BEGIN");

            await client.query(
                "UPDATE players SET balance = balance - $2 WHERE id = $1",
                [from_player, amount]
            );

            await client.query(
                "UPDATE players SET balance = balance + $2 WHERE id = $1",
                [to_player, amount]
            );

            await this.transactionRepo.addTransaction(
                client,
                UUIDv4(),
                from_player,
                to_player,
                amount,
                "transfer"
            );

            await client.query("COMMIT");
        } catch (e) {
            await client.query("ROLLBACK");
        } finally {
            client.release();
        }
    }
}

