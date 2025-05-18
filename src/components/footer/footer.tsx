import { fetchSanityNav, fetchSanitySettings } from '@/app/(main)/actions';
import FooterClient from './footer.client';

export default async function Footer() {
  // Fetch the nav data from Sanity
  const nav = await fetchSanityNav();
  // Fetch the settings data from Sanity
  const settings = await fetchSanitySettings();

  // Pass the raw Sanity nav data to the client component
  return <FooterClient nav={nav} settings={settings} />;
}
