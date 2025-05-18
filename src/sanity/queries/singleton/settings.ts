import { groq } from 'next-sanity';

export const SETTINGS_QUERY = groq`
  *[_type == "settings"][0] {
  logo {
    asset->{
      _ref,
      url
    },
    alt
  },
  largeLogo {
    asset->{
      _ref,
      url
    },
    alt
  },
  contact {
    phone,
    email
  },
  address {
    street,
    city,
    state,
    zip
  },
  businessHours {
    hours
  },
  social {
    facebook,
    instagram,
    twitter,
    linkedin,
    youtube,
    yelp,
    tiktok,
    googleReviews
  }
  }
`;
