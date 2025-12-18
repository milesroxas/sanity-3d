import { orderRankField } from '@sanity/orderable-document-list';
import { Files } from 'lucide-react';
import { defineField, defineType } from 'sanity';
import link from '../blocks/shared/link';

export default defineType({
  name: 'scenes',
  type: 'document',
  title: 'Scenes',
  icon: Files,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
    {
      name: 'marker',
      title: 'Marker',
    },
    {
      name: 'camera',
      title: 'Camera',
    },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'block-content',
      group: 'content',
    }),
    defineField({
      name: 'blocks',
      type: 'array',
      group: 'content',
      of: [{ type: 'section-content' }, { type: 'experience-carousel' }],
    }),
    defineField({
      name: 'links',
      type: link.name,
      validation: (rule: any) => rule.max(2),
      group: 'content',
    }),

    defineField({
      name: 'poiDisplayMode',
      title: 'Points of Interest Display Mode',
      description:
        'Choose how inline POIs should be displayed after camera transition. Legacy mode shows logo markers immediately. Interactive mode shows clickable POI buttons.',
      type: 'string',
      options: {
        list: [
          { title: 'Legacy (Auto-show logo markers)', value: 'legacy' },
          { title: 'Interactive Buttons (Click to view)', value: 'interactive' },
        ],
      },
      initialValue: 'legacy',
      group: 'settings',
    }),

    defineField({
      name: 'mainExpandedBody',
      title: 'Primary Expanded Content',
      description: 'Optional: Content to open in an overlay from the main logo marker button',
      type: 'expanded-body',
      group: 'content',
    }),
    defineField({
      name: 'replaceMainLinkWithExpanded',
      title: 'Replace Main Link with Expanded Content Button',
      description:
        'If enabled, the expanded content button will replace the primary link button. If disabled and both are set, both buttons will show side-by-side.',
      type: 'boolean',
      initialValue: false,
      group: 'content',
    }),

    // Points of Interest allow the main scene to reference other scenes and inline POIs
    defineField({
      name: 'pointsOfInterest',
      title: 'Points of Interest',
      description:
        'Add references to other scenes to show their logo markers in the main experience, or define inline POIs.',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'reference',
          to: [{ type: 'scenes' }],
          options: { disableNew: true },
        },
        {
          name: 'pointOfInterest',
          title: 'Point of Interest',
          type: 'object',
          fields: [
            { name: 'title', type: 'string', validation: (rule: any) => rule.required() },

            {
              name: 'blocks',
              title: 'Blocks',
              description: 'Rich content blocks',
              type: 'array',
              of: [
                { type: 'text-block' },
                { type: 'experience-carousel' },
                { type: 'media' },
                { type: 'split-row' },
              ],
            },
            {
              name: 'links',
              type: link.name,
              validation: (rule: any) => rule.max(2),
            },
            {
              name: 'markerPosition',
              title: 'Marker Position',
              description: 'The 3D position where the POI button should appear',
              type: 'object',
              fields: [
                { name: 'x', type: 'number', validation: (rule: any) => rule.required() },
                { name: 'y', type: 'number', validation: (rule: any) => rule.required() },
                { name: 'z', type: 'number', validation: (rule: any) => rule.required() },
              ],
              validation: (rule: any) => rule.required(),
            },
            {
              name: 'cameraPosition',
              title: 'Camera Position (Optional)',
              description:
                'Optional: Camera position when POI is clicked. If not set, camera stays in place',
              type: 'object',
              fields: [
                { name: 'x', type: 'number' },
                { name: 'y', type: 'number' },
                { name: 'z', type: 'number' },
              ],
            },
            {
              name: 'cameraTarget',
              title: 'Camera Target (Optional)',
              description: 'Optional: Where camera looks when POI is clicked',
              type: 'object',
              fields: [
                { name: 'x', type: 'number' },
                { name: 'y', type: 'number' },
                { name: 'z', type: 'number' },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title',
              hasBlocks: 'blocks',
              hasBody: 'body',
            },
            prepare({ title, hasBlocks, hasBody }) {
              const contentType = hasBlocks?.length
                ? 'Rich Content'
                : hasBody
                  ? 'Simple Body'
                  : 'No Content';
              return {
                title: title || 'Untitled POI',
                subtitle: contentType,
              };
            },
          },
        },
      ],
    }),

    defineField({
      name: 'mainSceneMarkerPosition',
      title: 'Main Scene Marker Position',
      group: 'marker',
      description:
        'The 3D position [x, y, z] where this point of interest should appear in the main scene',
      type: 'object',
      fields: [
        {
          name: 'x',
          title: 'X Position',
          type: 'number',
        },
        {
          name: 'y',
          title: 'Y Position',
          type: 'number',
          description: 'Default: 40',
        },
        {
          name: 'z',
          title: 'Z Position',
          type: 'number',
        },
      ],
    }),
    defineField({
      name: 'mainSceneCameraPosition',
      title: 'Main Scene Camera Position',
      group: 'camera',
      description:
        'The 3D position [x, y, z] where the camera should be when this point of interest is selected',
      type: 'object',
      fields: [
        {
          name: 'x',
          title: 'X Position',
          type: 'number',
          validation: Rule => Rule.required(),
        },
        {
          name: 'y',
          title: 'Y Position',
          type: 'number',
          validation: Rule => Rule.required(),
        },
        {
          name: 'z',
          title: 'Z Position',
          type: 'number',
          validation: Rule => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'mainSceneCameraTarget',
      title: 'Main Scene Camera Target',
      group: 'camera',
      description:
        'The 3D position [x, y, z] where the camera should look at when this point of interest is selected',
      type: 'object',
      fields: [
        {
          name: 'x',
          title: 'X Position',
          type: 'number',
          validation: Rule => Rule.required(),
        },
        {
          name: 'y',
          title: 'Y Position',
          type: 'number',
          validation: Rule => Rule.required(),
        },
        {
          name: 'z',
          title: 'Z Position',
          type: 'number',
          validation: Rule => Rule.required(),
        },
      ],
    }),

    defineField({
      name: 'meta_title',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'meta_description',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
    }),
    defineField({
      name: 'noindex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image - [1200x630]',
      type: 'image',
      group: 'seo',
    }),
    defineField({
      name: 'sceneType',
      title: 'Scene Type',
      description: 'Select the type of scene this represents',
      type: 'string',
      options: {
        list: [
          { title: 'Main Scene', value: 'main' },
          { title: 'Shops', value: 'shops' },
          { title: 'Company', value: 'company' },
          { title: 'Resort', value: 'resort' },
          { title: 'Events', value: 'events' },
          { title: 'Farm', value: 'farm' },
          { title: 'Construction', value: 'construction' },
          { title: 'Gated Community', value: 'gatedCommunity' },
          { title: 'Homes', value: 'homes' },
        ],
      },
    }),
    orderRankField({ type: 'scenes' }),
  ],
});
