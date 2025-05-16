import { client } from '@/sanity/lib/client';
import FooterClient from './footer.client';

export default async function Footer() {
  // Fetch the logo data from Sanity
  const settingsData = await client.fetch(`
    *[_type == "settings"][0] {
      logo {
        asset-> {
          url,
          metadata {
            dimensions
          }
        },
        alt
      }
    }
  `);

  const logo = settingsData?.logo || null;

  return <FooterClient logo={logo} />;
}
