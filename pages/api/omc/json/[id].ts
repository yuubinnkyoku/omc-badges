import { NextApiRequest, NextApiResponse } from 'next';
import { fetchOmcRate } from '../../../../lib/omc';

const getRatingColor = (rate: number | null): string => {
    if (rate === null) return 'lightgrey';
    if (rate >= 2000) return 'red';
    if (rate >= 1600) return 'orange';
    if (rate >= 1200) return 'yellow';
    if (rate >= 800) return 'green';
    if (rate >= 400) return 'cyan';
    return 'grey';
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
        const rate = await fetchOmcRate(id);
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
            color: 'lightgrey',
        });
    }
};