import {UUID} from "../types/external.types";

export interface Player {
    id: UUID;
    username: string;
    balance: number;
    created_at: Date;
}
