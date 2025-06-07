import {UUID} from "../types/external.types";

export interface Transaction {
    id: UUID;
    from_player: UUID | null;
    to_player: UUID | null;
    amount: number;
    type: TransactionTypes;
    created_at: Date;
}

export type TransactionTypes = 'deposit' | 'transfer' | 'withdraw';
