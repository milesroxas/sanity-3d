import { groq } from 'next-sanity';

export const splitVideoQuery = groq`
  _type == "split-video" => {
    _id,
    _type,
    video {
      asset-> {
          _id,
          playbackId,
          assetId,
          filename,
        }
    },
    videoOptions{
      hideControls
    }
  }
`;
