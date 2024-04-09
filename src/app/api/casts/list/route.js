import { FeedType, FilterType } from '@neynar/nodejs-sdk';
import { neynarClient as client } from '@/app/utils/neynarClient';

import { Document, Packer, Paragraph, TextRun, ExternalHyperlink } from 'docx';
import axios from 'axios';
import { saveAs } from 'file-saver';
import getAuthor from '@/app/utils/castParser';

export async function GET(request) {
  return new Response(
    JSON.stringify({ success: false, data: {}, message: 'Method not allowed' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
export async function POST(request) {
  try {
    const { channelParentUrl } = await request.json();

    console.log(channelParentUrl);
    const endDate = new Date().toISOString();

    // Start Date as 90 days before the end date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    console.log('startDate', startDate);
    console.log('endDate', endDate);

    const feed = await client.fetchFeed(FeedType.Filter, {
      filterType: FilterType.ParentUrl,
      parentUrl: channelParentUrl,
      limit: 100,
    });

    // console.log(feed);

    // Check for dates
    // if (!startDate || !endDate) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       data: {},
    //       message: 'Please provide both start and end dates',
    //     }),
    //     { status: 200, headers: { 'Content-Type': 'application/json' } }
    //   );
    // }

    // const startDateObj = new Date(startDate);
    // const endDateObj = new Date(endDate);

    // if (endDateObj < startDateObj) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       data: {},
    //       message: 'End date cannot be earlier than start date',
    //     }),
    //     { status: 200, headers: { 'Content-Type': 'application/json' } }
    //   );
    // }

    // Check for feed
    if (!feed) {
      return new Response(
        JSON.stringify({
          success: false,
          data: {},
          message: 'No feed found for the provided channel',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!feed.casts || feed.casts.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          data: {},
          message: 'No casts found for the provided channel',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { casts } = feed;

    // Get the date of the last cast
    const lastCast = casts[casts.length - 1];

    // Timestamp of last cast
    const lastCastTimestamp = new Date(lastCast.timestamp);

    // // Keep calling Neynar API until last cast timestamp is less than the start date
    // while (lastCastTimestamp > startDateObj) {
    //   const newFeed = await client.fetchFeed(FeedType.Filter, {
    //     filterType: FilterType.ParentUrl,
    //     parentUrl: channelParentUrl,
    //     cursor: lastCast.hash,
    //   });

    //   if (!newFeed || !newFeed.casts || newFeed.casts.length === 0) {
    //     break;
    //   }

    //   casts.push(...newFeed.casts);
    //   lastCast = casts[casts.length - 1];
    //   lastCastTimestamp = new Date(lastCast.timestamp);
    // }

    // console.log('line 38', casts[0]);

    const castParagraphs = casts.flatMap((cast) => {
      const authorDetails = getAuthor(cast);
      const castId = cast.hash.slice(0, 10);
      const castUrl = `https://warpcast.com/${authorDetails.username}/${castId}`;
      //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      //   console.log(castUrl);
      //   console.log(authorDetails);
      //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: `Hash: ${cast.hash}`,
              bold: true,
            }),
          ],
        }),

        new Paragraph(`Timestamp: ${cast.timestamp}`),
        new Paragraph(`Text: ${cast.text}`),
        new Paragraph({
          children: [
            new TextRun({
              text: `Author FID: ${authorDetails.fid}\n`,
            }),
            new TextRun(`Custody Address: ${authorDetails.custody_address}\n`),
            new TextRun(`Username: ${authorDetails.username}\n`),
            new TextRun(`Display Name: ${authorDetails.display_name}\n`),
            new TextRun(`Profile Picture URL: ${authorDetails.pfp_url}\n`),
            new TextRun(
              `Verified Addresses: [${authorDetails.verified_addresses.join(
                ', '
              )}]\n`
            ),
            new TextRun(`Active Status: ${authorDetails.active_status}\n`),
            new TextRun(`Power Badge: ${authorDetails.power_badge}`),
          ],
        }),
        new Paragraph({
          children: [
            new ExternalHyperlink({
              children: [
                new TextRun({
                  text: `Cast Url\n`,
                  style: 'Hyperlink',
                }),
              ],
              link: castUrl,
            }),
          ],
        }),

        // Add more Paragraph objects as needed
      ];
    });

    const doc = new Document({
      creator: 'Fetchcaster',
      description:
        'All casts and their details for the provided channel and date range',
      title: `Casts for ${channelParentUrl} from ${startDate} to ${endDate}`,
      sections: [
        {
          properties: {},
          children: castParagraphs, // We'll add Paragraphs here
        },
      ],
    });

    // Generate a Word document buffer
    const buffer = await Packer.toBuffer(doc);

    // Convert the buffer to a Blob and send as a download
    return new Response(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=casts.docx',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        data: {},
        message: 'An error occurred!',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
