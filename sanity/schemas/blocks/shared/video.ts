import { defineField, defineType } from "sanity";
import { Video as VideoIcon } from "lucide-react";

export default defineType({
  name: "video",
  title: "Video",
  type: "object",
  icon: VideoIcon,
  description: "Add a video using Mux for optimized streaming playback",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "A descriptive title for the video",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "mux.video",
      description:
        "Upload or provide a URL for your video. Will be processed by Mux for optimal playback",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
