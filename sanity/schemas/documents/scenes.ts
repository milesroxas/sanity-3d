import { defineField, defineType } from "sanity";
import { Files } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

export default defineType({
  name: "scenes",
  type: "document",
  title: "Scenes",
  icon: Files,
  groups: [
    {
      name: "content",
      title: "Content",
    },
    {
      name: "seo",
      title: "SEO",
    },
    {
      name: "settings",
      title: "Settings",
    },
    {
      name: "marker",
      title: "Marker",
    },
    {
      name: "camera",
      title: "Camera",
    },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "block-content",
      group: "content",
    }),
    defineField({
      name: "pointsOfInterest",
      type: "array",
      description: "Points of interest in this scene",
      group: "content",
      of: [
        {
          type: "reference",
          to: [{ type: "scenes" }],
          description: "The subscene that this point of interest belongs to",
        },
        {
          name: "pointOfInterest",
          title: "Point of Interest",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              description: "The name of this point of interest",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "block-content",
              description: "Custom description for this service",
            }),
            defineField({
              name: "markerPosition",
              title: "Marker Position",
              description:
                "The 3D position [x, y, z] where this point of interest should appear in a scene",
              type: "object",
              fields: [
                {
                  name: "x",
                  title: "X Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "y",
                  title: "Y Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "z",
                  title: "Z Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
              ],
            }),
            defineField({
              name: "cameraPosition",
              title: "Camera Position",
              description:
                "The 3D position [x, y, z] where the camera should be when this point of interest is selected",
              type: "object",
              fields: [
                {
                  name: "x",
                  title: "X Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "y",
                  title: "Y Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "z",
                  title: "Z Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
              ],
            }),
            defineField({
              name: "cameraTarget",
              title: "Camera Target",
              description:
                "The 3D position [x, y, z] where the camera should look at when this point of interest is selected",
              type: "object",
              fields: [
                {
                  name: "x",
                  title: "X Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "y",
                  title: "Y Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "z",
                  title: "Z Position",
                  type: "number",
                  validation: (Rule) => Rule.required(),
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "blocks",
      type: "array",
      group: "content",
      of: [
        { type: "hero-1" },
        { type: "hero-2" },
        { type: "section-header" },
        { type: "split-row" },
        { type: "grid-row" },
        { type: "carousel-1" },
        { type: "carousel-2" },
        { type: "timeline-row" },
        { type: "cta-1" },
        { type: "logo-cloud-1" },
        { type: "faqs" },
        { type: "form-newsletter" },
      ],
    }),
    defineField({
      name: "modelFiles",
      title: "Model Files",
      type: "array",
      of: [{ type: "modelFiles" }],
    }),
    defineField({
      name: "mainSceneMarkerPosition",
      title: "Main Scene Marker Position",
      group: "marker",
      description:
        "The 3D position [x, y, z] where this point of interest should appear in the main scene",
      type: "object",
      fields: [
        {
          name: "x",
          title: "X Position",
          type: "number",
        },
        {
          name: "y",
          title: "Y Position",
          type: "number",
          description: "Default: 40",
        },
        {
          name: "z",
          title: "Z Position",
          type: "number",
        },
      ],
    }),
    defineField({
      name: "mainSceneCameraPosition",
      title: "Main Scene Camera Position",
      group: "camera",
      description:
        "The 3D position [x, y, z] where the camera should be when this point of interest is selected",
      type: "object",
      fields: [
        {
          name: "x",
          title: "X Position",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "y",
          title: "Y Position",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "z",
          title: "Z Position",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "mainSceneCameraTarget",
      title: "Main Scene Camera Target",
      group: "camera",
      description:
        "The 3D position [x, y, z] where the camera should look at when this point of interest is selected",
      type: "object",
      fields: [
        {
          name: "x",
          title: "X Position",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "y",
          title: "Y Position",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "z",
          title: "Z Position",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    defineField({
      name: "meta_title",
      title: "Meta Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "meta_description",
      title: "Meta Description",
      type: "text",
      group: "seo",
    }),
    defineField({
      name: "noindex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image - [1200x630]",
      type: "image",
      group: "seo",
    }),
    defineField({
      name: "sceneType",
      title: "Scene Type",
      description: "Select the type of scene this represents",
      type: "string",
      options: {
        list: [
          { title: "Main Scene", value: "main" },
          { title: "Shops", value: "shops" },
          { title: "Company", value: "company" },
          { title: "Resort", value: "resort" },
          { title: "Events", value: "events" },
          { title: "Farm", value: "farm" },
          { title: "Construction", value: "construction" },
          { title: "Gated Community", value: "gatedCommunity" },
          { title: "Homes", value: "homes" },
        ],
      },
    }),
    orderRankField({ type: "scenes" }),
  ],
});
