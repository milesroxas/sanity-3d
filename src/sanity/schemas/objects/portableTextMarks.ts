import { defineType } from "sanity";
import { BUTTON_VARIANTS } from "../blocks/shared/button-variant";

export const linkAnnotation = defineType({
  name: 'linkAnnotation',
  type: 'object',
  title: 'Link',
  fields: [
    {
      name: 'linkType',
      type: 'string',
      title: 'Link Type',
      options: {
        list: [
          { title: 'URL', value: 'url' },
          { title: 'Document', value: 'document' },
        ],
        layout: 'radio',
      },
      initialValue: 'url',
    },
    {
      name: 'href',
      type: 'url',
      title: 'URL',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https', 'mailto', 'tel']
      }),
      hidden: ({ parent }) => parent?.linkType === 'document',
    },
    {
      name: 'reference',
      type: 'reference',
      title: 'Document Reference',
      to: [
        { type: 'post' },
        { type: 'page' },
        // Add other document types as needed
      ],
      hidden: ({ parent }) => parent?.linkType !== 'document',
    },
    {
      name: 'isButton',
      type: 'boolean',
      title: 'Display as Button',
      initialValue: false,
    },
    {
      name: 'buttonVariant',
      type: 'string',
      title: 'Button Style',
      options: {
        list: BUTTON_VARIANTS.map(({ title, value }) => ({ title, value })),
        layout: 'radio',
      },
      initialValue: 'default',
      hidden: ({ parent }) => !parent?.isButton,
    },
    {
      name: 'buttonSize',
      type: 'string',
      title: 'Button Size',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Small', value: 'sm' },
          { title: 'Large', value: 'lg' },
          { title: 'Extra Large', value: 'xl' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
      hidden: ({ parent }) => !parent?.isButton,
    },
  ],
});

export const portableTextMarks = {
  annotations: {
    link: linkAnnotation,
  },
}; 