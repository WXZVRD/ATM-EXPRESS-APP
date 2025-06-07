import { Player } from "../models/player.model";
import { Transaction } from "../models/transaction.model";
import { PlayerRepository } from "../repository/player.repository";
import { TransactionRepository } from "../repository/transaction.repository";
import { UUID } from "../types/external.types";

interface IATMService {
    checkBalance(playerId: string): Promise<{ balance: number }>;
    withdraw(playerId: string, amount: number): Promise<void>;
    deposit(playerId: string, amount: number): Promise<void>;
    checkTransactionHistory(playerId: string): Promise<Transaction[]>;
    transfer(from_player: string, to_player: string, amount: number): Promise<void>;
}

/**
 * Service for handling player ATM operations such as balance checks,
 * deposits, withdrawals, transfers, and transaction history retrieval.
 */
export class ATMService implements IATMService {
    constructor(
        private readonly playerRepo: PlayerRepository,
        private readonly transactionRepo: TransactionRepository
    ) {}

    /**
     * Gets the balance of a player.
     * @param playerId - The player's UUID.
     * @returns Object containing the player's balance.
     * @throws Error if the player does not exist.
     */
    async checkBalance(playerId: UUID): Promise<{ balance: number }> {
        const isPlayerExist: Player | null = await this.playerRepo.getById(playerId);
        if (!isPlayerExist) {
            throw new Error(`Player with id ${playerId} not found`);
        }

        return await this.playerRepo.checkBalance(playerId);
    }

    /**
     * Withdraws an amount from the player's account if balance is sufficient.
     * @param playerId - The player's UUID.
     * @param amount - The amount to withdraw.
     * @throws Error if the player does not exist or has insufficient balance.
     */
    async withdraw(playerId: UUID, amount: number): Promise<void> {
        const isPlayerExist = await this.playerRepo.getById(playerId);
        if (!isPlayerExist) {
            throw new Error(`Player with id ${playerId} not found`);
        }

        const { balance } = await this.playerRepo.checkBalance(playerId);
        if (balance < amount) {
            throw new Error(`Player ${playerId} doesn't have enough balance`);
        }

        await this.playerRepo.withdraw(playerId, amount);
    }

    /**
     * Deposits an amount into the player's account.
     * @param playerId - The player's UUID.
     * @param amount - The amount to deposit.
     * @throws Error if the player does not exist or amount is invalid.
     */
    async deposit(playerId: UUID, amount: number): Promise<void> {
        const isPlayerExist: Player | null = await this.playerRepo.getById(playerId);
        if (!isPlayerExist) {
            throw new Error(`Player with id ${playerId} not found`);
        }

        if (amount <= 0) {
            throw new Error("Deposit amount must be greater than 0");
        }

        await this.playerRepo.deposit(playerId, amount);
    }

    /**
     * Retrieves transaction history for the specified player.
     * @param playerId - The player's UUID.
     * @returns An array of transactions.
     * @throws Error if the player does not exist.
     */
    async checkTransactionHistory(playerId: UUID): Promise<Transaction[]> {
        const isPlayerExist: Player | null = await this.playerRepo.getById(playerId);
        if (!isPlayerExist) {
            throw new Error(`Player with id ${playerId} not found`);
        }

        return await this.transactionRepo.getHistory(playerId);
    }

    /**
     * Transfers funds from one player to another.
     * @param from_player - The UUID of the sender.
     * @param to_player - The UUID of the recipient.
     * @param amount - The amount to transfer.
     * @throws Error if players don't exist, amount is invalid, or balance is insufficient.
     */
    async transfer(from_player: UUID, to_player: UUID, amount: number): Promise<void> {
        if (amount <= 0) {
            throw new Error("Transfer amount must be greater than 0");
        }

        const from: Player | null = await this.playerRepo.getById(from_player);
        if (!from) {
            throw new Error(`Player with id [${from_player}] not found`);
        }

        const to: Player | null = await this.playerRepo.getById(to_player);
        if (!to) {
            throw new Error(`Player with id [${to_player}] not found`);
        }

        if (from_player === to_player) {
            throw new Error("Cannot transfer to the same player");
        }

        const { balance } = await this.playerRepo.checkBalance(from_player);
        if (balance < amount) {
            throw new Error(`Player [${from_player}] doesn't have enough balance`);
        }

        await this.playerRepo.transfer(from_player, to_player, amount);
    }
}
