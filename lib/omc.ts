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

    // レート情報が含まれるテーブルの行を探す
    const rateRow = $('th:contains("Rating")').parent();
    const rateText = rateRow.find('td').text().trim();
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