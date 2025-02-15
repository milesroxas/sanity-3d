import { groq } from "next-sanity";

export const splitVideoQuery = groq`
  _type == "split-video" => {
    _type,
    video {
      title,
      video {
        asset-> {
          _id,
          playbackId,
          assetId,
          filename,
        }
      }
    }
  }
`;
