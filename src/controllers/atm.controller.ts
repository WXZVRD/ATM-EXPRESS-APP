import { ATMService } from "../services/atm.service";
import { Request, Response } from "express";
import { UUID } from "../types/external.types";
import { Transaction } from "../models/transaction.model";

/**
 * Controller for handling ATM-related operations such as checking balance,
 * depositing, withdrawing, transferring money, and viewing transaction history.
 */
export default class ATMController {
    constructor(private readonly atmService: ATMService) {}

    /**
     * Get the current balance of a player.
     *
     * @route GET /balance/:playerId
     * @param req - Express request object with `playerId` in params
     * @param res - Express response object
     */
    async checkBalance(req: Request, res: Response) {
        try {
            const { playerId } = req.params;

            if (!playerId) {
                res.status(400).json({ error: "Missing playerId" });
                return;
            }

            const result: { balance: number } = await this.atmService.checkBalance(playerId as UUID);

            res.status(200).json({
                success: true,
                balance: result.balance,
            });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }

    /**
     * Withdraw a specified amount from a player's account.
     *
     * @route POST /withdraw
     * @param req - Express request with `playerId` and `amount` in body
     * @param res - Express response object
     */
    async withdraw(req: Request, res: Response) {
        try {
            const { playerId, amount } = req.body;

            if (!playerId || typeof amount !== "number") {
                return res.status(400).json({
                    success: false,
                    error: "Missing or invalid 'playerId' or 'amount'",
                });
            }

            if (amount <= 0) {
                return res.status(400).json({
                    success: false,
                    error: "Amount must be greater than zero",
                });
            }

            await this.atmService.withdraw(playerId, amount);

            res.status(200).json({
                success: true,
                message: `Withdrawn ${amount} from player ${playerId}`,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || "Internal Server Error",
            });
        }
    }

    /**
     * Deposit a specified amount into a player's account.
     *
     * @route POST /deposit
     * @param req - Express request with `playerId` and `amount` in body
     * @param res - Express response object
     */
    async deposit(req: Request, res: Response) {
        try {
            const { playerId, amount } = req.body;

            if (!playerId || typeof amount !== "number") {
                return res.status(400).json({
                    success: false,
                    error: "Missing or invalid 'playerId' or 'amount'",
                });
            }

            if (amount <= 0) {
                return res.status(400).json({
                    success: false,
                    error: "Amount must be greater than 0",
                });
            }

            await this.atmService.deposit(playerId, amount);

            res.status(200).json({
                success: true,
                message: `Deposited ${amount} to player ${playerId}`,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || "Internal Server Error",
            });
        }
    }

    /**
     * Retrieve transaction history for a specific player.
     *
     * @route GET /transactions/:playerId
     * @param req - Express request with `playerId` in params
     * @param res - Express response object
     */
    async checkTransactionHistory(req: Request, res: Response) {
        try {
            const { playerId } = req.params;

            if (!playerId) {
                return res.status(400).json({
                    success: false,
                    error: "Missing playerId in params",
                });
            }

            const history: Transaction[] = await this.atmService.checkTransactionHistory(playerId as UUID);

            res.status(200).json({
                success: true,
                transactions: history,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || "Internal Server Error",
            });
        }
    }

    /**
     * Transfer a specified amount from one player to another.
     *
     * @route POST /transfer
     * @param req - Express request with `from_player`, `to_player`, and `amount` in body
     * @param res - Express response object
     */
    async transfer(req: Request, res: Response) {
        try {
            const { from_player, to_player, amount } = req.body;

            if (!from_player || !to_player || typeof amount !== "number") {
                return res.status(400).json({
                    success: false,
                    error: "Missing or invalid 'from_player', 'to_player', or 'amount'",
                });
            }

            if (amount <= 0) {
                return res.status(400).json({
                    success: false,
                    error: "Amount must be greater than 0",
                });
            }

            await this.atmService.transfer(from_player, to_player, amount);

            res.status(200).json({
                success: true,
                message: `Transferred ${amount} from ${from_player} to ${to_player}`,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message || "Internal Server Error",
            });
        }
    }
}