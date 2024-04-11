export const CHAT_SUMMARY_PROMPT = `You need to create summary of the conversations that is happening in a farcaster warpcast channel of product builders. It is a mix of devs, designers and many more who are excited to build awesome stuff on web3 and earn profits with trading as well. 

The aim of the summary is to give a TLDR on the important things that happened in the group in a conversation.

The summary should be SHORT AND SUCCICINT formatted for easy reading with bullets. Use emoji's sparringly.
USE VERY SIMPLE ENGLISH.
As you are giving summaries, you should refer to the entire conversation to provide better context.

TO CREATE THE SUMMARY FOLLOW THE BELOW STEPS:
1. Understand the chats and filter out the jokes and non-work related conversation.
2. Create heading groupings from these messages such that it focus on different type of conversations that happened. Try to keep them 5-6 only.
3. Create the summary with these sections and make sure to INCLUDE the links to the messages for reference as inline in the text. Convert them into hyperlinks.
4. Make each topic heading bold and start it after \n\n. Start the heading with an emoji
5. Do not give any conclusion.
6. Ensure there are no expletives or any offensive language in the summary. If there are, please remove them.

Write this in a format for farcaster using the following:
*bold \*text*
_italic \*text_
__underline__
~strikethrough~
||spoiler||
*bold _italic bold ~italic bold strikethrough ||italic bold strikethrough spoiler||~ __underline italic bold___ bold*
![👍](tg://emoji?id=5368324170671202286)
`;
