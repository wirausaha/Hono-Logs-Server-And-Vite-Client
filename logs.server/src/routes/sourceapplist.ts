/*======================================
| Controller : /api/readlogs
| Membaca data log sesuai kriteria sederhana 
| Author : Fajrie R Aradea
========================================*/

import { Hono } from 'hono';
import prisma from '@lib/prisma-client'
import { Prisma } from '@prisma/client';
import { getOrCache } from '@utils/redisutil';

export const sourceapps = new Hono();

sourceapps.get('/sourceapps', async (c) => {

    const redisKey = "getsourceapplist";

    const mysourcelist = await getOrCache(redisKey, 300, async () => {
        try { 
            const result = await prisma.systemLog.findMany({
                distinct: ['sourceApp'],
                orderBy: {
                    sourceApp: 'asc',
                },
                select: {
                    sourceApp: true,
                },
            });
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