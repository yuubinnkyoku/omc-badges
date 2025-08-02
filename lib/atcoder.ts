import axios from 'axios';

export interface ContestResult {
    NewRating: number,
}

const userHistroyURL = (name: string) => `https://atcoder.jp/users/${name}/history/json`;

export async function fetchAtCoderRate(name: string): Promise<number | null> {
    try {
        const url = userHistroyURL(name);
        console.log(`Fetching AtCoder rate for '${name}' from ${url}`);
        const response = await axios.get<ContestResult[]>(url);
        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
            console.log(`AtCoder data for '${name}' is empty or invalid.`);
            return null;
        }
        
        const latestRating = data[data.length - 1].NewRating;
        console.log(`Successfully fetched AtCoder rate for '${name}': ${latestRating}`);
        return latestRating;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error fetching AtCoder rate for '${name}':`, error.message);
        } else {
            console.error(`An unknown error occurred while fetching AtCoder rate for '${name}'.`);
        }
        return null;
    }
}
