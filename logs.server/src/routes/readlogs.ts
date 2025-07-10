/*======================================
| Controller : /api/readlogs
| Membaca data log sesuai kriteria sederhana 
| Author : Fajrie R Aradea
========================================*/

import { Hono } from 'hono';
import prisma from '@lib/prisma-client'
import { Prisma } from '@prisma/client';
import { getOrCache } from '@utils/redisutil';

export const readlogs = new Hono();

// fungsi ini sengaja tidak dipisah menjadi helper
function stringLike(field: string | undefined) {
  return field?.trim() ? { contains: field, mode: Prisma.QueryMode.insensitive } : undefined;
}

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

    console.log(stringLike(key), "||" , stringLike(category));
    const whereClause = nonlylast20 == 1 ? 
        {   ...(sourceApp && { sourceApp }), 
            ...(category && { category: stringLike(category) }),
        } : 
        {   ...(key && { key: stringLike(key) }),
            ...(sourceApp && { sourceApp }),
            ...(ip && { ip }),
            ...(category && { category: stringLike(category) }),
            ...(datestart && dateend && {
                createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
                },
            }),
            ...(datestart && !dateend && {
                createdAt: {
                gte: new Date(startDate),
                },
            }),
            ...(dateend && !datestart && {
                createdAt: {
                lte: new Date(endDate),
                },
            }),
        };

    const orderByClause: Prisma.SystemLogOrderByWithRelationInput[] = [
    onlylast20 === 1
        ? { createdAt: 'desc' }
        : { [nordeyby === 0 ? 'createdAt' : 'key']: 'desc' },
    ];

    
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
            const result = await prisma.systemLog.findMany({
                where: whereClause,
                orderBy: orderByClause, 
                skip: nstart,
                take: nlength,
            }); 
            return {
                logs: result,
            };            
       } catch (err) {
            console.log("terjadi kesalahan system")
            return {logs: null}    
        }

    }); 
    const totalRecord = await prisma.systemLog.count();
    const totalFiltered = await prisma.systemLog.count({ where: whereClause  }); 
    //console.log(myid2.logs)
    if (myid2.logs) {
        console.log("totalRecord :", totalRecord, "total filtered: ", totalFiltered, "count :", myid2.logs.length)
        return c.json({ success: true, data : {draw, totalRecord, totalFiltered, logs: myid2.logs}}, 200)                
    } else {
        console.log("query no match")
        return c.json({ success: false, message: "Terjadi kesalahan"}, 400)                
    }

})

export default { readlogs }