import { generatePageMetadata } from "@/lib/metadata";
import { fetchSanitySceneBySlug } from "../actions";
import MainScene from "@/app/experience/scenes/mainScene/MainScene";

export const dynamic = "force-static";

export async function generateMetadata() {
  const scene = await fetchSanitySceneBySlug({ slug: "experience" });
  return generatePageMetadata({ page: scene, slug: "experience" });
}

export default async function ExperiencePage() {
  const scene = await fetchSanitySceneBySlug({ slug: "experience" });
  return <MainScene scene={scene} />;
}
