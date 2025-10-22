import ExperienceWrapper from '@/app/(components)/wrapper/ExperienceWrapper';
import MainSceneClient from '@/experience/scenes/mainScene/MainSceneClient';
import { generatePageMetadata } from '@/lib/metadata';
import { fetchSanitySceneBySlug } from './actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  const scene = await fetchSanitySceneBySlug({ slug: 'experience' });
  return generatePageMetadata({ page: scene, slug: 'experience' });
}

export default async function HomePage() {
  const scene = await fetchSanitySceneBySlug({ slug: 'experience' });
  return (
    <ExperienceWrapper>
      <MainSceneClient scene={scene} />
    </ExperienceWrapper>
  );
}
