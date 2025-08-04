const fetchOMC = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'omc-badges/1.0.0 (https://github.com/yuubinnkyoku/omc-badges)',
    },
  });
  if (!res.ok) {
    // 404 Not Foundの場合は、コンテストに提出がないだけなのでエラーにしない
    if (res.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

const getLatestSubmission = async (id: string) => {
  // 新しいコンテストから順に探索
  for (let i = 257; i >= 1; i--) {
    const contestId = `omc${String(i).padStart(3, '0')}`;
    const url = `https://onlinemathcontest.com/api/contests/${contestId}/submissions/list?user_id=${id}&page=1`;
    const data = await fetchOMC(url);

    if (data && data.data && data.data.length > 0) {
      // 提出が見つかったらその時点のレートを返す
      return data.data[0];
    }
    // APIサーバーへの負荷を軽減するために、リクエスト間に短い待機時間を設ける
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  return null;
};

export const fetchOmcRate = async (id: string): Promise<number | null> => {
  try {
    const submission = await getLatestSubmission(id);
    if (submission && submission.user && typeof submission.user.rate === 'number') {
      return submission.user.rate;
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
};