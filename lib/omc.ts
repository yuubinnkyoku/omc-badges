import * as cheerio from 'cheerio';

const fetchHTML = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      // Make the request look like it's from a real browser to avoid being blocked
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) {
    if (res.status === 404) {
      return null; // User not found, return null gracefully
    }
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.text();
};

export const fetchOmcRate = async (id: string): Promise<number | null> => {
  try {
    const url = `https://onlinemathcontest.com/users/${id}`;
    const html = await fetchHTML(url);

    if (!html) {
      console.log(`[OMC] User profile not found for: ${id}`);
      return null;
    }

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