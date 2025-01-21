import { defineField, defineType } from "sanity";
import SceneModelFileInput from "@/sanity/components/SceneModelFileInput";

export default defineType({
  name: "modelFiles",
  title: "Model Files",
  type: "document",
  fields: [
    defineField({
      name: "modelName",
      title: "Model Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sceneModelFile",
      title: "Scene Model File",
      type: "string",
      components: {
        input: SceneModelFileInput,
      },
    }),
  ],
});
