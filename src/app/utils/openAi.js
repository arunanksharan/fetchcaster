import { CHAT_SUMMARY_PROMPT } from './chat-summary';
import OpenAI from 'openai';

const openai = new OpenAI();
export default async function getOpenAISummary(
  conversation,
  hasReplies = false
) {
  let allMessages = '';
  let originalMessage = '';
  console.log('oooooooooooooooooooooooooooooooo');
  console.log('COnversation sent inside AI:', conversation);
  if (hasReplies) {
    originalMessage = conversation.cast.text;
    allMessages = `${originalMessage}, ${conversation.cast.direct_replies
      .map((reply) => reply.text)
      .join('\n')}`;
  } else {
    originalMessage = conversation.text;
    allMessages = originalMessage;
  }

  console.log('oooooooooooooooooooooooooooooooo');
  console.log('oooooooooooooooooooooooooooooooo');
  console.log('10 allMessages', allMessages);
  console.log('oooooooooooooooooooooooooooooooo');

  const aiMessages = [
    { role: 'system', content: CHAT_SUMMARY_PROMPT },
    // { role: "user", content: `Previous Summary:\n${lastGeneratedReport[0].generated_report}\n\nRecent Conversation:\n${allMessages}` },
    { role: 'user', content: `Recent Conversation:\n${allMessages}` },
  ];

  const completion = await openai.chat.completions.create({
    messages: aiMessages,
    temperature: 1,
    model: 'gpt-4-0125-preview',
  });

  const tldrMessage = completion.choices[0].message.content;
  console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
  console.log('tldrMessage 26', tldrMessage);
  console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
  return tldrMessage;
}

// conversation.cast.text
// conversation.cast.direct_replies[i].text

// Sample Response
// {...cast,
//     "conversation": {
//       "cast": {
//         "object": "cast",
//         "hash": "0xcdafad721397298a177be5d4aab944fac2afd292",
//         "thread_hash": "0xcdafad721397298a177be5d4aab944fac2afd292",
//         "parent_hash": null,
//         "parent_url": "https://warpcast.com/~/channel/law-policy",
//         "root_parent_url": "https://warpcast.com/~/channel/law-policy",
//         "parent_author": {
//           "fid": null
//         },
//         "author": {
//           "object": "user",
//           "fid": 343358,
//           "custody_address": "0xe9b202eb3d93ded5b333242c5f55726d343f7359",
//           "username": "birdnals",
//           "display_name": "Birdnals.eth 🎩💩",
//           "pfp_url": "https://assets.bueno.art/images/90f39490-9b88-47b2-abe8-02cc24485762/default/260?s=7039eb990fd416c0c9514fa5b506f45d",
//           "profile": {
//             "bio": {
//               "text": "Tech Transactions and IP attorney with an NFT obsession. I like suing people. Get all my legal updates here: https://linktr.ee/birdnals ",
//               "mentioned_profiles": []
//             }
//           },
//           "follower_count": 175,
//           "following_count": 287,
//           "verifications": [
//             "0xb2ac2f80bf988a6670af324c503322f34bc5c7fd"
//           ],
//           "verified_addresses": {
//             "eth_addresses": [
//               "0xb2ac2f80bf988a6670af324c503322f34bc5c7fd"
//             ],
//             "sol_addresses": []
//           },
//           "active_status": "inactive",
//           "power_badge": false
//         },
//         "text": "This week I cover the industry coming out in force to support Coinbase's petition for rulemaking challenge, Blackrock getting deeper into crypto waters, and a congressional hearing on SEC overreach. \n\nHere's everything that happened in Web3 law: https://nfttorney.com/2024/03/26/off-the-blockchain-march-18-25-2024/",
//         "timestamp": "2024-03-26T13:26:45.000Z",
//         "embeds": [
//           {
//             "url": "https://nfttorney.com/2024/03/26/off-the-blockchain-march-18-25-2024/"
//           }
//         ],
//         "reactions": {
//           "likes": [
//             {
//               "fid": 343358,
//               "fname": "birdnals"
//             },
//           ],
//           "recasts": [
//             {
//               "fid": 9227,
//               "fname": "codeofcrypto"
//             },
//           ]
//         },
//         "replies": {
//           "count": 1
//         },
//         "mentioned_profiles": [],
//         "direct_replies": [
//           {
//             "object": "cast",
//             "hash": "0x264ff5b5f08753cdbb2d8239d559aa0e8f89f5b9",
//             "thread_hash": "0xcdafad721397298a177be5d4aab944fac2afd292",
//             "parent_hash": "0xcdafad721397298a177be5d4aab944fac2afd292",
//             "parent_url": null,
//             "root_parent_url": "https://warpcast.com/~/channel/law-policy",
//             "parent_author": {
//               "fid": 343358
//             },
//             "author": {
//               "object": "user",
//               "fid": 9227,
//               "custody_address": "0x27d42cea3b52b15e3c67403fe25d5e44cf129a96",
//               "username": "codeofcrypto",
//               "display_name": "codeofcrypto",
//               "pfp_url": "https://arweave.net/Sy54hEt6gmPG5jOSqcRahs1Gjfv8q8sFhkgzzp_GkcQ/",
//               "profile": {
//                 "bio": {
//                   "text": "At the intersection of blockchain + law. Let’s buidl together! /law-policy",
//                   "mentioned_profiles": []
//                 }
//               },
//               "follower_count": 781,
//               "following_count": 281,
//               "verifications": [
//                 "0x7554c1f24dbab8b10d4229e4a7663b9d84628783"
//               ],
//               "verified_addresses": {
//                 "eth_addresses": [
//                   "0x7554c1f24dbab8b10d4229e4a7663b9d84628783"
//                 ],
//                 "sol_addresses": []
//               },
//               "active_status": "active",
//               "power_badge": true
//             },
//             "text": "This is awesome! Great to see the Farcaster shoutout 🎩",
//             "timestamp": "2024-03-26T13:34:01.000Z",
//             "embeds": [],
//             "reactions": {
//               "likes": [
//                 {
//                   "fid": 343358,
//                   "fname": "birdnals"
//                 }
//               ],
//               "recasts": []
//             },
//             "replies": {
//               "count": 0
//             },
//             "mentioned_profiles": [],
//             "direct_replies": []
//           }
//         ]
//       },
//       "chronological_parent_casts": []
//     }
//   }}
