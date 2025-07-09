import prisma from '../lib/prisma-client'

export async function logSystemEvent(
  category: string,
  message: string,
  details?: Record<string, any>,
  key?: string
) 
{
  await prisma.systemLog.create({
    data: { category, message, details, key },
  });
}