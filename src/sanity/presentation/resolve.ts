import {
  defineLocations,
  defineDocuments,
  PresentationPluginOptions,
} from "sanity/presentation";

const mapSceneSlugToPath = (slug?: string | null) => {
  const sanitized = (slug || '').replace(/^\/+/g, '');
  return sanitized === 'experience' || sanitized === '' ? '/' : `/${sanitized}`;
};

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    // Add more locations for other post types
    post: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => {
        if (!doc) {
          return { locations: [] };
        }
        
        return {
          locations: [
            {
              title: doc?.title || "Untitled",
              href: `/blog/${doc?.slug}`,
            },
            { title: "Blog", href: `/blog` },
          ],
        };
      },
    }),
    scenes: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => {
        if (!doc || !doc.slug) {
          return { locations: [] };
        }
        
        return {
          locations: [
            {
              title: doc?.title || "Untitled",
              href: mapSceneSlugToPath(doc?.slug),
            },
            { title: "Experience", href: "/" },
          ],
        };
      },
    }),
  },
  mainDocuments: defineDocuments([
    {
      route: "/",
      filter: `_type == 'page' && slug.current == 'index'`,
    },
    {
      route: "/:slug",
      filter: `_type == 'page' && slug.current == $slug`,
    },
    {
      route: "/blog/:slug",
      filter: `_type == 'post' && slug.current == $slug`,
    },
    {
      route: "/",
      filter: `_type == 'scenes' && slug.current == 'experience'`,
    },
  ]),
};
