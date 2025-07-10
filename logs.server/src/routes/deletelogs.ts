/*======================================
| Controller : /api/readlogs
| Membaca data log sesuai kriteria sederhana 
| Author : Fajrie R Aradea
========================================*/

import { Hono } from 'hono';
import prisma from '@lib/prisma-client'
import { Prisma } from '@prisma/client';
import { logSystemEvent } from '@helper/logs';
import { generateRandomString } from '@utils/randomstring'

export const deletelogs = new Hono();

// fungsi ini sengaja tidak dipisah menjadi helper
function stringLike(field: string | undefined) {
  return field?.trim() ? { contains: field, mode: Prisma.QueryMode.insensitive } : undefined;
}

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

    try { 
        const result = await prisma.systemLog.deleteMany({
            where: whereClause
        });
        return c.json({ success: true, message : "Data dihapus"}, 200)                
    } catch (err) {
        return c.json({ success: false, message: "Terjadi kesalahan"}, 400)                
    }
})

export default { deletelogs }