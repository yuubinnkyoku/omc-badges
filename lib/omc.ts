import * as cheerio from 'cheerio';

const fetchHTML = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'omc-badges/1.0.0 (https://github.com/yuubinnkyoku/omc-badges)',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.text();
};

export const fetchOmcRate = async (id: string): Promise<number | null> => {
  try {
    const url = `https://onlinemathcontest.com/user/${id}`;
    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    // ID 'rating' を持つpタグ内のbタグからレートを取得
    const rateText = $('#rating b').text().trim();
    const rate = parseInt(rateText, 10);

    if (isNaN(rate)) {
      console.log(`[OMC] Could not parse rate for user: ${id}`);
      return null;
    }

    console.log(`[OMC] Found rate for user ${id}: ${rate}`);
    return rate;
  } catch (e) {
    console.error(`[OMC] Error in fetchOmcRate for user ${id}:`, e);
    return null;
  }
};