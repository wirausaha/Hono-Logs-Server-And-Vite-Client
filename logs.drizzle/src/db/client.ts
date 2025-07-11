// src/db/client.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

console.log("Connecting to database at:", process.env.DATABASE_URL);
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);