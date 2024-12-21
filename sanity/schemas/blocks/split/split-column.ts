import { defineField, defineType } from "sanity";

export default defineType({
  name: "split-column",
  type: "object",
  title: "Split Column",
  fields: [
    defineField({
      name: "position",
      title: "Position",
      type: "boolean",
      description: "Check this box if text content should be on the left side.",
      initialValue: false,
    }),
    defineField({
      name: "tagLine",
      title: "Tag Line",
      type: "string",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    defineField({
      name: "link",
      type: "link",
      description:
        "Link to a page or external URL. Leave empty to hide the link.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
