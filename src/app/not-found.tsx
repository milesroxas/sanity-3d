import Custom404 from '@/components/404';
import Footer from '@/components/footer/footer';
import Header from '@/components/header';
import type { Metadata } from 'next';
import { fetchSanityNav, fetchSanitySettings } from './(main)/actions';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default async function NotFoundPage() {
  const nav = await fetchSanityNav();
  const settings = await fetchSanitySettings();
  return (
    <>
      <Header nav={nav} settings={settings} />
      <Custom404 />
      <Footer />
    </>
  );
}
