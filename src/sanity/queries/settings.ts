import { groq } from 'next-sanity';

export const SETTINGS_QUERY = groq`
  *[_type == "settings"][0] {
    _id,
    _type,
    logo {
      asset->,
      alt
    },
    largeLogo {
      asset->,
      alt
    }
  }
`;
