import { Wrapper } from '@/app/(components)/wrapper';
import Blocks from '@/components/blocks';
import { generatePageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import { fetchSanityServicesBySlug } from '../../actions';
import ServicePageClient from './page.client';
export const dynamic = 'force-static';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const service = await fetchSanityServicesBySlug({ slug: params.slug });

  if (!service) {
    notFound();
  }

  return generatePageMetadata({ page: service, slug: params.slug });
}

export default async function ServicePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const service = await fetchSanityServicesBySlug({ slug: params.slug });

  if (!service) {
    notFound();
  }

  return (
    <Wrapper lenis={{}}>
      <ServicePageClient />
      <Blocks blocks={service?.blocks} />
    </Wrapper>
  );
}
