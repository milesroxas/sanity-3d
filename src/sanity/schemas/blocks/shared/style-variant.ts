import { defineType } from 'sanity';

export const STYLE_VARIANTS = [
  { title: 'Default', value: 'default' },
  { title: 'Offset', value: 'offset' },
];

export const styleVariant = defineType({
  name: 'style-variant',
  title: 'Style Variant',
  type: 'string',
  options: {
    list: STYLE_VARIANTS.map(({ title, value }) => ({ title, value })),
    layout: 'dropdown',
  },
  initialValue: 'default',
});
