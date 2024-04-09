import { NeynarAPIClient, FeedType, FilterType } from '@neynar/nodejs-sdk';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
console.log(NEYNAR_API_KEY);

export const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);
