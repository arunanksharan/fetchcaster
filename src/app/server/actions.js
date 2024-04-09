'use server';
import { FeedType, FilterType } from '@neynar/nodejs-sdk';
import { neynarClient as client } from '../utils/neynarClient';

export async function getCastsForChannel(formData) {
  const channelParentUrl = formData.channelParentUrl; //'https://warpcast.com/~/channel/law-policy';
  const startDate = formData.startDate;
  const endDate = formData.endDate;

  console.log(channelParentUrl);
  console.log(startDate);
  console.log(endDate);

  const feed = await client.fetchFeed(FeedType.Filter, {
    filterType: FilterType.ParentUrl,
    parentUrl: channelParentUrl,
  });

  console.log(typeof feed);

  console.log(feed);
}
