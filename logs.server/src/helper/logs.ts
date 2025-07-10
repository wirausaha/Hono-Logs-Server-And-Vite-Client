import prisma from '../lib/prisma-client'

export async function logSystemEvent(
  category: string,
  message: string,
  sourceApp?: string,
  ip?: string,
  details?: Record<string, any>,
  key?: string
) 
{
  await prisma.systemLog.create({
    data: { category, sourceApp, message, ip, details, key },
  });
}