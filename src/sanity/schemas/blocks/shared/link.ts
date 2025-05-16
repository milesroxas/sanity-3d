import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'link',
  type: 'array',
  title: 'Link',
  of: [
    {
      name: 'pageLink',
      title: 'Page Link',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
        }),
        defineField({
          name: 'page',
          type: 'reference',
          to: [{ type: 'page' }],
        }),
      ],
    },
    {
      name: 'customLink',
      type: 'object',
      title: 'Custom Link',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'href',
          type: 'string',
        }),
        defineField({
          name: 'target',
          type: 'boolean',
          title: 'Open in new tab',
        }),
        defineField({
          name: 'buttonVariant',
          type: 'button-variant',
          title: 'Button Variant',
        }),
      ],
    },
  ],
});
