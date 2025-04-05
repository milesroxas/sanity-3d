import { defineType, defineArrayMember } from 'sanity';
import { VideoIcon } from '@radix-ui/react-icons';
import { YouTubePreview } from '@/sanity/schemas/previews/youtube-preview';
import { BUTTON_VARIANTS } from './button-variant';

export default defineType({
  title: 'Block Content',
  name: 'block-content',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Large Text', value: 'largeText' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
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
                validation: Rule =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
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
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineArrayMember({
      name: 'youtube',
      title: 'YouTube Video',
      type: 'object',
      icon: VideoIcon,
      fields: [
        {
          name: 'videoId',
          title: 'Video ID',
          type: 'string',
          description: 'YouTube Video ID',
        },
      ],
      preview: {
        select: {
          title: 'videoId',
        },
      },
      components: {
        preview: YouTubePreview,
      },
    }),
  ],
});
