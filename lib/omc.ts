const fetchOMC = async (url: string) => {
  console.log(`[OMC] Fetching from URL: ${url}`);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'omc-badges/1.0.0 (https://github.com/yuubinnkyoku/omc-badges)',
    },
  });
  if (!res.ok) {
    console.log(`[OMC] Fetch failed with status: ${res.status}`);
    // 404 Not Foundの場合は、コンテストに提出がないだけなのでエラーにしない
    if (res.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  console.log(`[OMC] Fetch successful from URL: ${url}`);
  return res.json();
};

const getLatestSubmission = async (id: string) => {
    const contestNumbers = Array.from({ length: 257 }, (_, i) => 257 - i);
    const batchSize = 10; // 一度にチェックするコンテスト数

    for (let i = 0; i < contestNumbers.length; i += batchSize) {
        const batch = contestNumbers.slice(i, i + batchSize);
        console.log(`[OMC] Checking batch of contests: ${batch[0]}...${batch[batch.length - 1]}`);

        const promises = batch.map(num => {
            const contestId = `omc${String(num).padStart(3, '0')}`;
            const url = `https://onlinemathcontest.com/api/contests/${contestId}/submissions/list?user_id=${id}&page=1`;
            return fetchOMC(url).then(data => ({ data, contestId }));
        });

        const results = await Promise.all(promises);

        // バッチの結果をループして、提出を見つける
        for (const result of results) {
            if (result.data && result.data.data && result.data.data.length > 0) {
                console.log(`[OMC] Found submission for user ${id} in contest ${result.contestId}.`);
                return result.data.data[0]; // 見つかったら即座に返す
            }
        }
    }
    return null; // 全てのコンテストをチェックしても見つからなかった場合
};

export const fetchOmcRate = async (id: string): Promise<number | null> => {
  try {
    console.log(`[OMC] Getting latest submission for user: ${id}`);
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