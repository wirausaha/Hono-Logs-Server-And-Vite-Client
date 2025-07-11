/*======================================
| Controller : /api/readlogs
| Membaca data log sesuai kriteria sederhana 
| Author : Fajrie R Aradea
========================================*/

import { Hono } from 'hono';
import { logSystemEvent } from '@helper/logs';
import { generateRandomString } from '@utils/randomstring'
import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from 'dotenv';
import { db } from '@db/client';
import { systemLog } from '@db/schema/systemlog';
import { eq, ilike, and, gte, lte, SQL, between, desc, count } from 'drizzle-orm';
export const readlogs = new Hono();
export const deletelogs = new Hono();

deletelogs.post('/readlogs', async (c) => {
    const body: {
        category?: string
        datestart?: string
        dateend?: string
        key?: string
    } = await c.req.json()

    const { category, datestart, dateend, key } = body

    const startDate = new Date(`${datestart}T00:00:00.000Z`)
    const endDate = new Date(`${dateend}T23:59:59.999Z`)

    //console.log ("Date start :", datestart, " Date end :", dateend)

    const filters: SQL[] = [];

    key && filters.push(ilike(systemLog.key, `%${key}%`));
    category && filters.push(ilike(systemLog.category, `%${category}%`));
    if (datestart && dateend) {    
        filters.push(between(systemLog.createdAt, new Date(startDate), new Date(endDate)));
    } else if (datestart) {
        filters.push(gte(systemLog.createdAt, new Date(startDate)));
    } else if (dateend) {
        filters.push(lte(systemLog.createdAt, new Date(endDate)));
    }
        
    try { 
        const result = await db
            .delete(systemLog)
            .where(and(...filters))
            .returning();
        const deletedCount = result.length;
        return c.json({ success: true, message : deletedCount + " data dihapus"}, 200)                
    } catch (err) {
        return c.json({ success: false, message: "Terjadi kesalahan"}, 400)                
    }
})

export default { deletelogs }