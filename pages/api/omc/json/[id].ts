import { NextApiRequest, NextApiResponse } from 'next';
import { getUserRateWithCache } from '../../../../lib/cache';

const getRatingColor = (rate: number | null): string => {
    if (rate === null) return '#808080';
    if (rate >= 2800) return '#FF0000';
    if (rate >= 2400) return '#FF8000';
    if (rate >= 2000) return '#C0C000';
    if (rate >= 1600) return '#0000FF';
    if (rate >= 1200) return '#00C0C0';
    if (rate >= 800)  return '#008000';
    if (rate >= 400)  return '#804000';
    return '#808080';
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    console.log(`[API] Received request for id: ${id}`);

    if (typeof id !== 'string') {
        console.error('[API] Invalid user ID type.');
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    try {
        console.log(`[API] Fetching OMC rate for ${id}...`);
        const rateResult = await getUserRateWithCache(id);
        const rate = rateResult ? rateResult.omc : null;
        console.log(`[API] Fetched OMC rate for ${id}: ${rate}`);
        const color = getRatingColor(rate);
        const message = rate !== null ? String(rate) : 'N/A';

        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
        console.log(`[API] Responding with: { message: ${message}, color: ${color} }`);
        res.status(200).json({
            schemaVersion: 1,
            label: 'OMC Rating',
            message: message,
            color: color,
        });
    } catch (error) {
        console.error(`[API] Error fetching rate for ${id}:`, error);
        res.status(500).json({
            schemaVersion: 1,
            label: 'OMC Rating',
            message: 'Error',
            color: '#808080',
        });
    }
};