import axios from 'axios';

export interface ContestResult {
    newRating: number,
}

export interface RatingHistory {
    result: ContestResult[],
}

const ratingHistroyURL = (name: string) => `https://codeforces.com/api/user.rating?handle=${name}`;

export async function fetchCodeforcesRate(name: string): Promise<number | null> {
    try {
        const url = ratingHistroyURL(name);
        console.log(`Fetching Codeforces rate for '${name}' from ${url}`);
        const response = await axios.get<RatingHistory>(url);
        const data = response.data;

        if (data.result.length === 0) {
            console.log(`Codeforces data for '${name}' is empty.`);
            return null;
        }
        
        const latestRating = data.result[data.result.length - 1].newRating;
        console.log(`Successfully fetched Codeforces rate for '${name}': ${latestRating}`);
        return latestRating;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error fetching Codeforces rate for '${name}':`, error.message);
        } else {
            console.error(`An unknown error occurred while fetching Codeforces rate for '${name}'.`);
        }
        return null;
    }
}
