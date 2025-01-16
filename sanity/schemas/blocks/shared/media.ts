import { defineField, defineType } from "sanity";
import { Image } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

export const media = defineType({
  name: "media",
  title: "Media",
  icon: Image,
  description:
    "Central library for managing all media assets including images, videos, and documents",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Name or title of the media asset for easy identification",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "file",
      title: "File",
      description: "Upload your media file (image, video, or document)",
      type: "file",
      options: {
        storeOriginalFilename: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      description:
        "Remember to use alt text for people to be able to read what is happening in the image if they are using a screen reader, it's also important for SEO",
      type: "string",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Add keywords to help organize and find media assets easily",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    orderRankField({ type: "media" }),
  ],
});
