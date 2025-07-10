/*======================================
| Controller : /api/auth/login
| Login, kirim dan simpan Jwt token dan refresh token 
| Author : Fajrie R Aradea
========================================*/

import { Hono } from 'hono';
import prisma from '@lib/prisma-client'
import { Prisma } from '@prisma/client';
import { logSystemEvent } from '@helper/logs';
import { generateRandomString } from '@utils/randomstring'

export const writelogs = new Hono();

writelogs.post('/writelogs', async (c) => {
    const body: {
        category: string
        sourceApp?: string
        message: string
        details?: Record<string, any>
        ip?: string
        key?: string
    } = await c.req.json()
    
    const { category, sourceApp, message, details, ip, key } = body
    const sIp = ip ?? "undefined";
    const logKey = key ?? generateRandomString(24)
    console.log("category : ", category, " source : ", sourceApp, " message : ", message, " ip :", sIp, " details : ", details )
    await logSystemEvent(category, message, sourceApp, sIp ?? "unf", details, logKey); 
    return c.json({ success: true, message: 'data ditulis ke logs'}, 200)
})





export default { writelogs }
