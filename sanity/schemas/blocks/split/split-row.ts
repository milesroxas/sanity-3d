import { defineType } from "sanity";
import { LayoutList } from "lucide-react";

export default defineType({
  name: "split-row",
  type: "object",
  title: "Split Row",
  description:
    "Split Row: Alternates text and images in a visually engaging layout",
  icon: LayoutList,
  fields: [
    {
      name: "padding",
      type: "section-padding",
    },
    {
      name: "colorVariant",
      type: "color-variant",
      title: "Color Variant",
      description: "Select a background color variant",
    },
    {
      name: "splitColumns",
      type: "array",
      of: [{ type: "split-column" }],
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Split Row",
      };
    },
  },
});
