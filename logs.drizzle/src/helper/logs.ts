import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from 'dotenv';
import { db } from '@db/client';
import { systemLog } from '@db/schema/systemlog';
import { eq, ilike, and, gte, lte, SQL, between, desc, count } from 'drizzle-orm';

export async function logSystemEvent(
  category: string,
  message: string,
  sourceApp?: string,
  ip?: string,
  details?: Record<string, any>,
  key?: string
) 
{
  await db.insert(systemLog).values({
    category,
    sourceApp,
    message,
    ip,
    details,
    key,
  });
}