import { Router, Request, Response } from "express";
import ATMController from "../controllers/atm.controller";

/**
 * Creates and returns an Express router with ATM-related routes.
 *
 * This router handles the following endpoints:
 * - `GET /check-balance/:playerId` - Check player's balance.
 * - `POST /withdraw` - Withdraw money from a player's account.
 * - `POST /deposit` - Deposit money to a player's account.
 * - `GET /transactions/:playerId` - Get a player's transaction history.
 * - `POST /transfer` - Transfer money between players.
 *
 * @param controller - An instance of ATMController that provides handler methods for each route.
 * @returns An Express router with all ATM-related routes registered.
 */
export const createATMRouter = (controller: ATMController): Router => {
    const router = Router();

    // Check balance
    router.get("/check-balance/:playerId", (req: Request, res: Response) => controller.checkBalance(req, res));

    // Withdraw funds
    router.post("/withdraw", (req: Request, res: Response) => controller.withdraw(req, res));

    // Deposit funds
    router.post("/deposit", (req: Request, res: Response) => controller.deposit(req, res));

    // Transaction history
    router.get("/transactions/:playerId", (req: Request, res: Response) => controller.checkTransactionHistory(req, res));

    // Transfer funds between players
    router.post("/transfer", (req: Request, res: Response) => controller.transfer(req, res));

    return router;
};
