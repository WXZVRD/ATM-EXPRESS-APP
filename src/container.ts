import ATMController from "./controllers/atm.controller";
import { PlayerRepository } from "./repository/player.repository";
import { TransactionRepository } from "./repository/transaction.repository";
import { ATMService } from "./services/atm.service";

export const buildContainer = () => {
    const transactionRepo = new TransactionRepository();
    const playerRepo = new PlayerRepository(transactionRepo);

    const atmService = new ATMService(playerRepo, transactionRepo);
    const atmController = new ATMController(atmService);

    return {
        atmController,
    };
};
