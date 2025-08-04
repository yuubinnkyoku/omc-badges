const fetchOMC = async (url: string) => {
  // console.log(`[OMC] Fetching from URL: ${url}`); // This can be noisy, disabling for now.
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'omc-badges/1.0.0 (https://github.com/yuubinnkyoku/omc-badges)',
    },
  });
  if (!res.ok) {
    if (res.status !== 404) {
      console.error(`[OMC] Fetch failed for ${url} with status: ${res.status}`);
    }
    return null;
  }
  // console.log(`[OMC] Fetch successful from URL: ${url}`);
  return res.json();
};

const getLatestSubmission = async (id: string) => {
    const contestNumbers = Array.from({ length: 257 }, (_, i) => 257 - i);
    const batchSize = 50; // Increase batch size again for maximum speed

    for (let i = 0; i < contestNumbers.length; i += batchSize) {
        const batch = contestNumbers.slice(i, i + batchSize);
        console.log(`[OMC] Checking batch of ${batch.length} contests: ${batch[0]}...${batch[batch.length - 1]}`);

        const promises = batch.map(num => {
            const contestId = `omc${String(num).padStart(3, '0')}`;
            const url = `https://onlinemathcontest.com/api/contests/${contestId}/submissions/list?user_id=${id}&page=1`;
            return fetchOMC(url).then(data => ({ data, contestId }));
        });

        // Use allSettled to prevent one failed request from stopping the whole batch
        const results = await Promise.allSettled(promises);

        // Results are already in descending order of contest number within the batch
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value && result.value.data && result.value.data.data && result.value.data.data.length > 0) {
                console.log(`[OMC] Found submission for user ${id} in contest ${result.value.contestId}.`);
                return result.value.data.data[0]; // First one found is the latest, return immediately
            }
        }
    }
    return null;
};

export const fetchOmcRate = async (id: string): Promise<number | null> => {
  try {
    const submission = await getLatestSubmission(id);
    if (submission && submission.user && typeof submission.user.rate === 'number') {
      console.log(`[OMC] Found rate for user ${id}: ${submission.user.rate}`);
      return submission.user.rate;
    }
    console.log(`[OMC] No rate found for user: ${id}`);
    return null;
  } catch (e) {
    console.error(`[OMC] Error in fetchOmcRate for user ${id}:`, e);
    return null;
  }
};