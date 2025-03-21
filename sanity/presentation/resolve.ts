import {
  defineLocations,
  defineDocuments,
  PresentationPluginOptions,
} from "sanity/presentation";

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
              href: `/experience/${doc?.slug}`,
            },
            { title: "Experience", href: `/experience` },
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
      route: "/experience/:slug",
      filter: `_type == 'scenes' && slug.current == $slug`,
    },
  ]),
};
