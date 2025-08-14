import MissingSanityPage from '@/components/ui/missing-sanity-page';
import LandingPage from '@/experience/scenes/landing/LandingPage';
import { generatePageMetadata } from '@/lib/metadata';
import { client } from '@/sanity/lib/client';
import { fetchSanityPageBySlug } from './actions';

export const dynamic = 'force-static';
export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: 'index' });

  return generatePageMetadata({ page, slug: 'index' });
}

// Update your PageProps interface to match Next.js 13+ types
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const isRootPath = Object.keys(resolvedSearchParams).length === 0;

  // Fetch texture video for landing page
  const textureVideo = await client.fetch(`
    *[_id == "f57be663-ee9a-4412-a976-b15f0f6b6654"][0]{
      _id,
      title,
      mediaType,
      video{
        asset->{
          _id,
          playbackId,
          assetId,
          filename
        }
      }
    }
  `);

  if (isRootPath) {
    return <LandingPage textureVideo={textureVideo} />;
  }

  const page = await fetchSanityPageBySlug({ slug: 'index' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'index' });
  }
}
