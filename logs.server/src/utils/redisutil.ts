import Redis from 'ioredis'
import { logSystemEvent } from '@helper/logs'

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'redispass123', // ganti dengan password Redis kamu
});

//redispass123
export async function getOrCache<T>(
  key: string,
  ttl: number,
  resolver: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) {
    await logSystemEvent('redis', 'Redis hit',"","", {}, key);
    console.log('Redis hit:', key)
    return JSON.parse(cached)
  }

  await logSystemEvent('redis', 'Redis miss', '', '', {}, key);
  const result = await resolver()
  await redis.set(key, JSON.stringify(result), 'EX', ttl)
  await logSystemEvent('cache', 'Cache set', '', '', {}, key);
  console.log('Redis miss:', key)
  return result
}

/**
 * Menghapus cache berdasarkan key
 */
export async function invalidateCache(key: string): Promise<void> {
  const deleted = await redis.del(key)
  await logSystemEvent('cache', 'Cache deleted', '','', {}, key);
  console.log(deleted ? `Cache deleted: ${key}` : `Cache not found: ${key}`)
}
