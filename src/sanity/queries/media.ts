import { groq } from 'next-sanity';

export const mediaQuery = groq`
  *[_type == "media"] | order(orderRank) {
    _id,
    _type,
    title,
    mediaType,
    alt,
    image {
      asset->
    },
    video {
      asset-> {
        _id,
        playbackId,
        assetId,
        filename,
        status
      }
    },
    orderRank
  }
`;
