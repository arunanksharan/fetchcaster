import { FeedType, FilterType } from '@neynar/nodejs-sdk';
import { neynarClient as client } from '@/app/utils/neynarClient';

import { Document, Packer, Paragraph, TextRun, ExternalHyperlink } from 'docx';
import axios from 'axios';
import { saveAs } from 'file-saver';
import getAuthor from '@/app/utils/castParser';
import getOpenAISummary from '@/app/utils/openAi';

export async function GET(request) {
  return new Response(
    JSON.stringify({ success: false, data: {}, message: 'Method not allowed' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
export async function POST(request) {
  try {
    const { channelParentUrl } = await request.json();

    // console.log(channelParentUrl);
    const endDate = new Date().toISOString();

    // Start Date as 90 days before the end date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    // console.log('startDate', startDate);
    // console.log('endDate', endDate);

    let feed = await client.fetchFeed(FeedType.Filter, {
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

    let { casts } = feed;

    console.log(casts[0]);

    // Get the date of the last cast
    let lastCast = casts[casts.length - 1];

    // Timestamp of last cast
    let lastCastTimestamp = new Date(lastCast.timestamp);
    // console.log('lastCastTimestamp', lastCastTimestamp);
    // console.log('Comparison', lastCastTimestamp > startDate);

    let count = 0;
    // while (count < 3) {
    while (lastCastTimestamp >= startDate) {
      feed = await client.fetchFeed(FeedType.Filter, {
        filterType: FilterType.ParentUrl,
        parentUrl: channelParentUrl,
        limit: 100,
        cursor: feed.next.cursor,
      });

      if (!feed || !feed.casts || feed.casts.length === 0) {
        break;
      }

      casts.push(...feed.casts);
      lastCast = feed.casts[feed.casts.length - 1];
      lastCastTimestamp = new Date(lastCast.timestamp);
      //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      //   console.log(
      //     'Inside while 110 newfeeds last cast timestamp',
      //     feed.casts[feed.casts.length - 1].timestamp
      //   );
      //   console.log('---------------------------------------------');
      //   console.log('Inside while 110 lastCastTimestamp', lastCastTimestamp);
      //   console.log('Inside while 111 casts length', casts.length);
      //   console.log('Comparison inside while 112', lastCastTimestamp > startDate);
      //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      //   console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      count++;
      console.log(
        `xxxxxxxxxxxxxx Inside WHILE Loop Index is ${count}xxxxxxxxxxxxxxxxxxxx`
      );
    }

    let allText = '';

    for (let i = 0; i < casts.length; i++) {
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      console.log(
        `xxxxxxxxxxxxxx Inside For Loop Index is ${i}xxxxxxxxxxxxxxxxxxxx`
      );
      let allMessagesForOneThread = '';
      casts[i]['conversation'] = {};
      casts[i]['tldr'] = '';
      if (casts[i].replies.count > 0) {
        console.log('---------------------------------------');
        console.log('---------- Inside If Statement Loop -------------');
        // console.log('Cast without Replies 93', casts[i]);
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            api_key: process.env.NEYNAR_API_KEY,
          },
        };
        console.log('API Key', process.env.NEYNAR_API_KEY);

        const response = await fetch(
          `https://api.neynar.com/v2/farcaster/cast/conversation?identifier=${casts[i].hash}&type=hash&reply_depth=2&include_chronological_parent_casts=true`,
          options
        );
        const { conversation } = await response.json();
        // console.log('conversation', conversation);
        casts[i].conversation = conversation;

        allMessagesForOneThread += `${
          casts[i].text
        }, ${conversation.cast.direct_replies
          .map((reply) => reply.text)
          .join('\n')}`;
        // console.log('Cast With Replies 110', casts[i]);

        // // Pass in conversation to call OpenAI Summary
        // const tldr = await getOpenAISummary(conversation, true);
        // casts[i].tldr = tldr;
        // console.log('tltltltltltltltltltltltltltltltltltltlt');
        // console.log('casts[i].tldr', casts[i].tldr);
        // console.log('tltltltltltltltltltltltltltltltltltltlt');
      } else {
        let conversation = casts[i];
        allMessagesForOneThread += casts[i].text;
        console.log('---------------------------------------');
        console.log('---------- Inside Else Statement Loop -------------');
        // const tldr = await getOpenAISummary(conversation, false);
        // casts[i].tldr = casts[i].text;
        // console.log('eleleeleleleleleleleleelelelelelelelelele');
        // console.log('casts[i].tldr', casts[i].tldr);
        // console.log('eleleeleleleleleleleleelelelelelelelelele');
      }
      allText += allMessagesForOneThread;
      console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
      console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');

      // Pass in conversation to call OpenAI Summary
      // const tldr = await getOpenAISummary(allText);
      // casts[i].tldr = tldr;
      // console.log('tltltltltltltltltltltltltltltltltltltlt');
      // console.log('casts[i].tldr', casts[i].tldr);
      // console.log('tltltltltltltltltltltltltltltltltltltlt');
    }
    const tldr = await getOpenAISummary(allText);
    // casts[i].tldr = tldr;
    console.log('tltltltltltltltltltltltltltltltltltltlt');
    console.log('tldr', tldr);
    console.log('tltltltltltltltltltltltltltltltltltltlt');

    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    // console.log('cast[0]', casts[0]);
    // console.log('casts.length', casts.length);
    // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

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
        // new Paragraph(`Text: ${cast.text}`),
        new Paragraph({
          children: [
            new TextRun({
              text: `Author FID: ${authorDetails.fid}\n`,
            }),
            // new TextRun(`Custody Address: ${authorDetails.custody_address}\n`),
            new TextRun(`Username: ${authorDetails.username}\n`),
            new TextRun(`Display Name: ${authorDetails.display_name}\n`),
            // new TextRun(`Profile Picture URL: ${authorDetails.pfp_url}\n`),
            // new TextRun(
            //   `Verified Addresses: [${authorDetails.verified_addresses.join(
            //     ', '
            //   )}]\n`
            // ),
            // new TextRun(`Active Status: ${authorDetails.active_status}\n`),
            // new TextRun(`Power Badge: ${authorDetails.power_badge}`),
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
        new Paragraph({
          children: [new TextRun({ text: `Summary: ${cast.tldr}\n\n` })],
        }),

        // Add more Paragraph objects as needed
      ];
    });

    const report = new Paragraph({
      children: [
        new TextRun({
          text: `Summary: ${tldr}\n\n`,
        }),
      ],
    });

    const doc = new Document({
      creator: 'Fetchcaster',
      description:
        'All casts and their details for the provided channel and date range',
      title: `Casts for ${channelParentUrl} from ${startDate} to ${endDate}`,
      sections: [
        {
          properties: {},
          children: [report], // We'll add Paragraphs here
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
