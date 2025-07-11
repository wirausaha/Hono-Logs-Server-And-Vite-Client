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
import { eq, ilike, and, gte, lte, SQL, between, desc, count } from 'drizzle-orm';
export const readlogs = new Hono();


readlogs.post('/readlogs', async (c) => {
    const body: {
        draw: number
        start: number
        length: number
        sourceApp?: string
        ip?: string
        category?: string
        datestart?: string
        dateend?: string
        onlylast20?: number
        key?: string
        orderby?: number
    } = await c.req.json()

    const { draw, start, length, category, sourceApp, ip, datestart, dateend, key, onlylast20, orderby } = body
    const nordeyby = orderby ?? 0;
    const nonlylast20 = onlylast20 ?? 0;
    let nlength = (length < 0) ? 0 : length
    let nstart = (start < 0) ? 0 : start

    console.log("Only 20 :", onlylast20, " Length :", nlength)
    if (nonlylast20 == 1) {
        nlength = 5
        nstart = 0
    }
    const reqIp = c.req.header('x-forwarded-for') || // dipakai saat di belakang proxy
                    c.req.header('x-real-ip') ||       // beberapa proxy pakai ini
                    'unknown';

    const startDate = new Date(`${datestart}T00:00:00.000Z`)
    const endDate = new Date(`${dateend}T23:59:59.999Z`)

    const filters: SQL[] = [];
    if (onlylast20 === 1) {
        sourceApp && filters.push(eq(systemLog.sourceApp, sourceApp));
        category && filters.push(ilike(systemLog.category, `%${category}%`));
    } else {
        key && filters.push(ilike(systemLog.key, `%${key}%`));
        sourceApp && filters.push(eq(systemLog.sourceApp, sourceApp));
        ip && filters.push(eq(systemLog.ip, ip));
        category && filters.push(ilike(systemLog.category, `%${category}%`));

        if (datestart && dateend) {    
            filters.push(between(systemLog.createdAt, new Date(startDate), new Date(endDate)));
        } else if (datestart) {
            filters.push(gte(systemLog.createdAt, new Date(startDate)));
        } else if (dateend) {
            filters.push(lte(systemLog.createdAt, new Date(endDate)));
        }
    }

    const orderByField = onlylast20 === 1
    ? systemLog.createdAt
    : nordeyby === 0 ? systemLog.createdAt : systemLog.key;

    const orderByClause = desc(orderByField);
   
    
    const redisKey = [
        "systemLog",                          // prefix
        key || "",                            // e.g. "error123"
        sourceApp || "",                      // e.g. "MobileApp (A, B, C, dll)"
        ip || "",                             // e.g. "192.168.1.1"
        category || "",                       // e.g. "login"
        datestart || "",                      // e.g. "2024-07-01"
        dateend || "",
        nordeyby || "",
        onlylast20,                              // e.g. 0, 1
    ].filter(Boolean).join(":");

    console.log("start : ", nstart, " length: ", nlength)
    const myid2 = await getOrCache(redisKey, 300, async () => {
        try { 
            const logs = await db
                .select()
                .from(systemLog)
                .where(and(...filters))
                .orderBy(orderByClause)
                .limit(nlength)
                .offset(nstart);
            return { logs };          
       } catch (err) {
            console.log("terjadi kesalahan system")
            return {logs: null}    
        }

    }); 
    const totalRecord = await db.select({ count: count() }).from(systemLog);
    const totalFiltered = await db.select({ count: count() })
            .from(systemLog)
            .where(and(...filters));

    //console.log(myid2.logs)
    if (myid2.logs) {
        console.log("totalRecord :", totalRecord, "total filtered: ", totalFiltered[0]?.count, "count :", myid2.logs.length)
        return c.json({ success: true, data : {draw, totalRecord:totalRecord[0]?.count, totalFiltered: totalFiltered[0]?.count, logs: myid2.logs}}, 200)                
    } else {
        console.log("query no match")
        return c.json({ success: false, message: "Terjadi kesalahan"}, 400)                
    }

})

export default { readlogs }