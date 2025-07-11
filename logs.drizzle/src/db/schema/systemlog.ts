
import { pgTable, serial, text, varchar, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

export const systemLog = pgTable('SystemLog', {
    id: serial('id').primaryKey(),
    sourceApp: varchar('sourceApp', { length: 128 }).default('unknown'),
    category: varchar('category', { length: 64 }).notNull(),
    message: text('message').notNull(),
    key: varchar('key', { length: 256 }),
    ip: varchar('ip', { length: 64 }).default('undefined'),
    details: jsonb('details'),
    createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow(),
    }, 
    (table) => [
        index('idx_source_category').on(table.sourceApp, table.category),
        index('idx_created_at').on(table.createdAt),
    ]
    );