/*======================================
| Controller : /api/auth/login
| Login, kirim dan simpan Jwt token dan refresh token 
| Author : Fajrie R Aradea
========================================*/

import { Hono } from 'hono';
import prisma from '@lib/prisma-client'
import { Prisma } from '@prisma/client';
import { logSystemEvent } from '@helper/cache';
import { generateRandomString } from '@utils/randomstring'

export const writelogs = new Hono();

writelogs.post('/writelogs', async (c) => {
    const body: {
        category: string
        message: string
        details?: Record<string, any>
        key?: string
    } = await c.req.json()

    const { category, message, details, key } = body
    const logKey = key ?? generateRandomString(24)
    console.log("category : ", category, " message : ", message, " details : ", details )
    await logSystemEvent(category, message, details, logKey); 
    return c.json({ success: true, message: 'data ditulis ke logs'}, 200)
})





export default { writelogs }
