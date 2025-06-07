import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

export default class DB {
    private static instance: Pool;

    constructor() {}

    static getInstance(): Pool {
        if (!DB.instance) {
            console.log("Connecting to database...");
            const pool: Pool = new Pool({
                user: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                host: process.env.POSTGRES_HOST,
                database: process.env.POSTGRES_DB,
                port: Number(process.env.POSTGRES_PORT),
                ssl: false,
            });

            DB.instance = pool;
            console.log("Connected successfully!");

            return pool;
        }

        return DB.instance;
    }
}
