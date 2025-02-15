import { defineField, defineType } from "sanity";
import { Video } from "lucide-react";

export default defineType({
  name: "split-video",
  type: "object",
  icon: Video,
  description: "Column with full video.",
  fields: [
    defineField({
      name: "video",
      type: "video",
      title: "Video",
      description: "Add a video that will be displayed in this column",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "video.title",
    },
    prepare({ title }) {
      return {
        title: title || "No Title",
      };
    },
  },
});
