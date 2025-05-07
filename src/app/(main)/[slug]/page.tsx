import { Wrapper } from '@/app/(components)/wrapper';
import Blocks from '@/components/blocks';
import { generatePageMetadata } from '@/lib/metadata';
import { notFound } from 'next/navigation';
import { fetchSanityPageBySlug } from '../actions';

export const dynamic = 'force-static';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = await fetchSanityPageBySlug({ slug: params.slug });

  if (!page) {
    notFound();
  }

  return generatePageMetadata({ page, slug: params.slug });
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const page = await fetchSanityPageBySlug({ slug: params.slug });

  if (!page) {
    notFound();
  }

  return (
    <Wrapper>
      <Blocks blocks={page?.blocks} />
    </Wrapper>
  );
}
