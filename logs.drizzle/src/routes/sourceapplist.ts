/*======================================
| Controller : /api/readlogs
| Membaca data log sesuai kriteria sederhana 
| Author : Fajrie R Aradea
========================================*/

import { Hono } from 'hono';
import { getOrCache } from '@utils/redisutil';
import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from 'dotenv';
import { db } from '@db/client';
import { systemLog } from '@db/schema/systemlog';
import { asc } from 'drizzle-orm';


export const sourceapps = new Hono();

sourceapps.get('/sourceapps', async (c) => {

    const redisKey = "getsourceapplist";

    const mysourcelist = await getOrCache(redisKey, 300, async () => {
        try { 
            const result = await db
            .selectDistinct({ sourceApp: systemLog.sourceApp })
            .from(systemLog)
            .orderBy(asc(systemLog.sourceApp));
            return {
                data: result,
            };            
        } catch (err) {
            console.log("terjadi kesalahan system")
            return {logs: null}    
        }
    });
    if (mysourcelist.data) {
        return c.json({ success: true, data : mysourcelist.data}, 200)                
    } else {
        return c.json({ success: false, message: "Terjadi kesalahan"}, 400)                
    }

})

export default { sourceapps }