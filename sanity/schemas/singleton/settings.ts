import { defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Displayed in the header.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Description of the image for accessibility.",
        }),
      ],
    }),
    defineField({
      name: "largeLogo",
      title: "Large Logo",
      type: "image",
      description: "Displayed on the site landing page.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Description of the image for accessibility.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "Settings",
    },
    prepare: ({ title }) => ({
      title: title || "Settings",
    }),
  },
});
