import { defineField, defineType } from "sanity";
import { Users } from "lucide-react";

export default defineType({
  name: "grid-team",
  type: "object",
  icon: Users,
  fields: [
    defineField({
      name: "member",
      type: "reference",
      title: "Team Member",
      description: "Select a team member to link to.",
      to: [{ type: "team" }],
    }),
  ],
  preview: {
    select: {
      title: "member.title",
      media: "member.image",
    },
    prepare({ title, media }) {
      return {
        title: "Team Member Card",
        subtitle: title || "No member selected",
        media,
      };
    },
  },
});
