import { fetchSanityNav } from '@/app/(main)/actions';
import { DisableDraftMode } from '@/components/disable-draft-mode';
import Footer from '@/components/footer/footer';
import Header from '@/components/header';
import { SanityLive } from '@/sanity/lib/live';
import { VisualEditing } from 'next-sanity';
import { draftMode } from 'next/headers';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const nav = await fetchSanityNav();
  return (
    <>
      <Header nav={nav} />
      {children}
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
      <Footer />
    </>
  );
}
