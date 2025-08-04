import { getUserCache, registerUserCache, updateUserCache } from './db';
import { fetchAtCoderRate } from './atcoder';
import { fetchCodeforcesRate } from './codeforces';
import { fetchOmcRate } from './omc';

export interface Rate {
    atcoder: number | null,
    codeforces: number | null,
    omc: number | null,
}

function needUpdate(timestamp: string) {
    let now = new Date();
    let date = new Date(timestamp);
    if(now.getFullYear() != date.getFullYear()
        || now.getMonth() != date.getMonth()
        || now.getDate() != date.getDate()
        || now.getHours() != date.getHours()) {
        return true;
    }
    return false;
}

async function fetchUserRate(name: string): Promise<Rate | null> {
    let atcoder = await fetchAtCoderRate(name);
    let codeforces = await fetchCodeforcesRate(name);
    let omc = await fetchOmcRate(name);
    if(atcoder === null && codeforces === null && omc === null) return null;
    return { atcoder, codeforces, omc };
}

export async function getUserRateWithCache(name: string): Promise<Rate | null> {
    let cache = await getUserCache(name);
    if(cache.user === null) {
        let rate = await fetchUserRate(name);
        if(rate === null) return null;
        await registerUserCache(name, rate.atcoder, rate.codeforces, rate.omc);
        return rate;
    } else {
        if(needUpdate(cache.user.timestamp)) {
            let rate = await fetchUserRate(name);
            if(rate !== null) {
                cache.user.atcoderRate = rate.atcoder;
                cache.user.codeforcesRate = rate.codeforces;
                cache.user.omcRate = rate.omc;
                await updateUserCache(cache.user);
            }
        }
        return { atcoder: cache.user.atcoderRate, codeforces: cache.user.codeforcesRate, omc: cache.user.omcRate };
    }
}
