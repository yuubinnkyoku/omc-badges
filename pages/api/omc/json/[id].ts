import { NextApiRequest, NextApiResponse } from 'next';
import { fetchOmcRate } from '../../../../lib/omc';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    if (typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    try {
        const rate = await fetchOmcRate(id);
        if (rate === null) {
            res.status(404).json({ error: 'User not found or no submissions' });
            return;
        }
        res.status(200).json({ rate });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};