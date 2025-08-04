import { Redis } from '@upstash/redis';

export interface UserCache {
    _id: string,
    name: string,
    omcRate: number | null,
    timestamp: string,
}

export interface DBRecord {
    user: UserCache | null,
}

// Vercelの環境変数からRedisクライアントを初期化
const redis = Redis.fromEnv();

// ユーザー名をキーとしてキャッシュを取得
export async function getUserCache(name: string): Promise<DBRecord> {
    const user = await redis.get<UserCache>(name);
    return { user };
}

// ユーザー名をキーとしてキャッシュを保存（登録）
export async function registerUserCache(name: string, omcRate: number | null) {
    const userCache: UserCache = {
        _id: name,
        name,
        omcRate,
        timestamp: new Date().toISOString(),
    };
    console.log(`Registering cache for: ${name}`);
    await redis.set(name, userCache);
    console.log(`Successfully registered cache for: ${name}`);
}

// ユーザー名をキーとしてキャッシュを保存（更新）
export async function updateUserCache(cache: UserCache) {
    const updatedCache: UserCache = {
        ...cache,
        timestamp: new Date().toISOString(),
    };
    console.log(`Updating cache for: ${cache.name}`);
    await redis.set(cache.name, updatedCache);
    console.log(`Successfully updated cache for: ${cache.name}`);
}
