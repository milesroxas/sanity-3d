import { notFound } from "next/navigation";

import {
  fetchSanityScenesStaticParams,
  fetchSanitySceneBySlug,
} from "../../actions";
import { generatePageMetadata } from "@/lib/metadata";
import SubSceneClient from "@/experience/scenes/subScene/SubSceneClient";

export const dynamic = "force-static";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const scene = await fetchSanitySceneBySlug({ slug: params.slug });

  if (!scene) {
    notFound();
  }

  return generatePageMetadata({
    page: scene,
    slug: `/experience/${params.slug}`,
  });
}

export async function generateStaticParams() {
  const scenes = await fetchSanityScenesStaticParams();

  return scenes.map((scene) => ({
    slug: scene.slug.current,
  }));
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const scene = await fetchSanitySceneBySlug({ slug: params.slug });

  if (!scene) {
    notFound();
  }

  return <SubSceneClient scene={scene} />;
}
