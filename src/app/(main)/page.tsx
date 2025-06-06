import MissingSanityPage from '@/components/ui/missing-sanity-page';
import LandingPage from '@/experience/scenes/landing/LandingPage';
import { generatePageMetadata } from '@/lib/metadata';
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

  if (isRootPath) {
    return <LandingPage />;
  }

  const page = await fetchSanityPageBySlug({ slug: 'index' });

  if (!page) {
    return MissingSanityPage({ document: 'page', slug: 'index' });
  }
}
