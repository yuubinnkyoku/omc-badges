import { kv } from '@vercel/kv';

export interface UserCache {
    _id: string, // Vercel KVではこのIDは不要ですが、既存の型定義を維持します
    name: string,
    atcoderRate: number | null,
    codeforcesRate: number | null,
    timestamp: string,
}

// Vercel KVではキーで直接値を取得するため、DBRecordは単純化します
export interface DBRecord {
    user: UserCache | null,
}

// ユーザー名をキーとしてキャッシュを取得
export async function getUserCache(name: string): Promise<DBRecord> {
    const user = await kv.get<UserCache>(name);
    return { user };
}

// ユーザー名をキーとしてキャッシュを保存（登録）
export async function registerUserCache(name: string, atcoderRate: number | null, codeforcesRate: number | null) {
    const userCache: UserCache = {
        _id: name, // キーをIDとして利用
        name,
        atcoderRate,
        codeforcesRate,
        timestamp: new Date().toISOString(),
    };
    await kv.set(name, userCache);
}

// ユーザー名をキーとしてキャッシュを保存（更新）
export async function updateUserCache(cache: UserCache) {
    const updatedCache: UserCache = {
        ...cache,
        timestamp: new Date().toISOString(),
    };
    await kv.set(cache.name, updatedCache);
}
