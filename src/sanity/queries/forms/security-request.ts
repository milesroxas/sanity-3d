import { groq } from 'next-sanity';

export const formSecurityRequestQuery = groq`
  _type == "form-security-request" => {
    _type,
    padding,
    colorVariant,
    title,
    description,
    submitButtonText,
    successMessage,
    notificationEmail,
  },
`;
