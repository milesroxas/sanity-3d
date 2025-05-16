import { defineType } from 'sanity';

export const BUTTON_VARIANTS = [
  { title: 'Default', value: 'default' },
  { title: 'Ghost', value: 'ghost' },
  { title: 'Secondary', value: 'secondary' },
  { title: 'Link', value: 'link' },
  { title: 'Outline', value: 'outline' },
  { title: 'Destructive', value: 'destructive' },
];

export const buttonVariant = defineType({
  name: 'button-variant',
  title: 'Button Variant',
  type: 'string',
  options: {
    list: BUTTON_VARIANTS.map(({ title, value }) => ({ title, value })),
    layout: 'radio',
  },
  initialValue: 'default',
});
