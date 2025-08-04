import { getUserCache, registerUserCache, updateUserCache } from './db';
import { fetchOmcRate } from './omc';

export interface Rate {
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
    let omc = await fetchOmcRate(name);
    if(omc === null) return null;
    return { omc };
}

export async function getUserRateWithCache(name: string): Promise<Rate | null> {
    let cache = await getUserCache(name);
    if(cache.user === null) {
        let rate = await fetchUserRate(name);
        if(rate === null) return null;
        await registerUserCache(name, rate.omc);
        return rate;
    } else {
        if(needUpdate(cache.user.timestamp)) {
            let rate = await fetchUserRate(name);
            if(rate !== null) {
                cache.user.omcRate = rate.omc;
                await updateUserCache(cache.user);
            }
        }
        return { omc: cache.user.omcRate };
    }
}
