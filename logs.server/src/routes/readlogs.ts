/*======================================
| Controller : /api/readlogs
| Membaca data log sesuai kriteria sederhana 
| Author : Fajrie R Aradea
========================================*/

import { Hono } from 'hono';
import prisma from '@lib/prisma-client'
import { Prisma } from '@prisma/client';
import { logSystemEvent } from '@helper/cache';
import { generateRandomString } from '@utils/randomstring'

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
        category?: string
        datestart?: string
        dateend?: string
        key?: string
        orderby?: number
    } = await c.req.json()

    const { draw, start, length, category, datestart, dateend, key, orderby } = body
    const nstart = start < 0 ? 0 : start
    const nlenght = length < 0 ? 0 : length
    const nordeyby = orderby ?? 0;

    const startDate = new Date(`${datestart}T00:00:00.000Z`)
    const endDate = new Date(`${dateend}T23:59:59.999Z`)

    //console.log ("Date start :", datestart, " Date end :", dateend)

    const whereClause = {
        ...(key && { key }),
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

    const orderByClause = {
    [nordeyby === 0 ? 'createdAt' : 'key']: 'desc'
    };
    console.log("Length :", nlenght)
    try { 
        const result = await prisma.systemLog.findMany({
            where: whereClause,
            orderBy: orderByClause, 
            skip: nstart,
            take: nlenght,
        });
        const totalRecord = await prisma.systemLog.count();
        const totalFiltered = await prisma.systemLog.count({
            where: whereClause,
        }); 
        //console.log(result);
        return c.json({ success: true, data : {draw: draw, totalRecord: totalRecord, totalFiltered: totalFiltered, logs: result}}, 200)                
    } catch (err) {
        return c.json({ success: false, message: "Terjadi kesalahan"}, 400)                
    }
})

export default { readlogs }