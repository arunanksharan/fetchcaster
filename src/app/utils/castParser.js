// {
//     object: 'cast',
//     hash: '0x08d23db284f2ac8ee451b3dc15075816277e9ce4',
//     thread_hash: '0x08d23db284f2ac8ee451b3dc15075816277e9ce4',
//     parent_hash: null,
//     parent_url: 'https://warpcast.com/~/channel/law-policy',
//     root_parent_url: 'https://warpcast.com/~/channel/law-policy',
//     parent_author: { fid: null },
//     author: {
//       object: 'user',
//       fid: 325277,
//       custody_address: '0x131c45deed9bd2006e60e8a992457af494d2b0bb',
//       username: 'petkevitch',
//       display_name: 'Philipp Petkevitch',
//       pfp_url: 'https://i.imgur.com/fvTR0Nf.jpg',
//       profile: { bio: [Object] },
//       follower_count: 28,
//       following_count: 75,
//       verifications: [ '0x8a3bebab69b2217861e82f669669994bcafbf516' ],
//       verified_addresses: { eth_addresses: [Array], sol_addresses: [] },
//       active_status: 'inactive',
//       power_badge: false
//     },
//     text: 'What happened in the crypto industry last week (April 1-7)?\n' +
//       '\n' +
//       '1/ Several amicus briefs were submitted in the case against Roman Storm by Coin Center, DeFi Education Fund, and Blockchain Association, emphasizing the erroneous nature of holding developers liable and the immutable characteristics of smart contract pools.',
//     timestamp: '2024-04-09T07:34:55.000Z',
//     embeds: [ { url: 'https://i.imgur.com/MMoCsg4.jpg' } ],
//     reactions: { likes: [ [Object], [Object] ], recasts: [ [Object] ] },
//     replies: { count: 1 },
//     mentioned_profiles: []
//   }

export default function getAuthor(cast) {
  const verified_addresses = [...cast.author.verified_addresses.eth_addresses];

  const { author } = cast;
  const {
    fid,
    custody_address,
    username,
    display_name,
    pfp_url,
    active_status,
    power_badge,
  } = author;
  return {
    fid,
    custody_address,
    username,
    display_name,
    pfp_url,
    verified_addresses,
    active_status,
    power_badge,
  };
}

// author: {
//       object: 'user',
//       fid: 325277,
//       custody_address: '0x131c45deed9bd2006e60e8a992457af494d2b0bb',
//       username: 'petkevitch',
//       display_name: 'Philipp Petkevitch',
//       pfp_url: 'https://i.imgur.com/fvTR0Nf.jpg',
//       profile: { bio: [Object] },
//       follower_count: 28,
//       following_count: 75,
//       verifications: [ '0x8a3bebab69b2217861e82f669669994bcafbf516' ],
//       verified_addresses: { eth_addresses: [Array], sol_addresses: [] },
//       active_status: 'inactive',
//       power_badge: false
//     },
