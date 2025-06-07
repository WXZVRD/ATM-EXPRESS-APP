import { Pool, PoolClient } from "pg";
import DB from "../database";
import {Transaction, TransactionTypes} from "../models/transaction.model";
import {UUID} from "../types/external.types";

interface ITransactionRepository {
    addTransaction(
        client: PoolClient,
        id: UUID,
        from_player: UUID | null,
        to_player: UUID | null,
        amount: number,
        type: TransactionTypes
    ): Promise<void>
    getHistory(playerId: UUID): Promise<Transaction[]>
}

/**
 * Repository for managing transactions in the database.
 * Handles recording new transactions and retrieving a player's transaction history.
 */
export class TransactionRepository implements ITransactionRepository {
    private db: Pool;

    /**
     * Initializes the repository with a connection to the database.
     */
    constructor() {
        this.db = DB.getInstance();
    }

    /**
     * Records a new transaction in the database.
     *
     * @param client - A connected PostgreSQL client to execute the transaction query within an existing transaction.
     * @param id - UUID of the transaction.
     * @param from_player - UUID of the player sending money, or null for deposits.
     * @param to_player - UUID of the player receiving money, or null for withdrawals.
     * @param amount - The amount involved in the transaction.
     * @param type - The type of the transaction (e.g., "deposit", "withdraw", "transfer").
     * @returns A promise that resolves when the transaction is successfully recorded.
     */
    async addTransaction(
        client: PoolClient,
        id: UUID,
        from_player: UUID | null,
        to_player: UUID | null,
        amount: number,
        type: TransactionTypes
    ): Promise<void> {
        await client.query(
            `INSERT INTO transactions (id, from_player, to_player, amount, type)
             VALUES ($1, $2, $3, $4, $5)`,
            [id, from_player, to_player, amount, type]
        );
    }

    /**
     * Retrieves the transaction history for a given player.
     * Includes both incoming and outgoing transactions.
     *
     * @param playerId - UUID of the player.
     * @returns A promise that resolves to an array of transactions, sorted by creation date descending.
     */
    async getHistory(playerId: UUID): Promise<Transaction[]> {
        const data = await this.db.query(
            `SELECT * FROM transactions 
             WHERE from_player = $1 OR to_player = $1 
             ORDER BY created_at DESC`,
            [playerId]
        );
        console.log("Transaction history:", data.rows);
        return data.rows;
    }
}
