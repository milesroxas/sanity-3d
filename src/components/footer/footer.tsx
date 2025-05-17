import { fetchSanityNav } from '@/app/(main)/actions';
import FooterClient from './footer.client';

export default async function Footer() {
  // Fetch the nav data from Sanity
  const nav = await fetchSanityNav();

  // Pass the raw Sanity nav data to the client component
  return <FooterClient nav={nav} />;
}
