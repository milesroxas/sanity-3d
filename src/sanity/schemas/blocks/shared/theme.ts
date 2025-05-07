import { defineType } from 'sanity';

export const THEME_VARIANTS = [
  { title: 'Light', value: 'light' },
  { title: 'Dark', value: 'dark' },
  { title: 'Accent', value: 'accent' },
];

export const themeVariant = defineType({
  name: 'theme-variant',
  title: 'Theme Variant',
  type: 'string',
  options: {
    list: THEME_VARIANTS.map(({ title, value }) => ({ title, value })),
    layout: 'dropdown',
  },
  initialValue: 'background',
});
