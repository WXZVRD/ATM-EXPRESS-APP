import {UUID} from "../types/external.types";

export interface Transaction {
    id: UUID;
    from_player: string | null;
    to_player: string | null;
    amount: number;
    type: TransactionTypes;
    created_at: Date;
}

export type TransactionTypes = 'deposit' | 'transfer' | 'withdraw';
