import { defineType } from 'sanity';

export const sectionPadding = defineType({
  name: 'section-padding',
  type: 'string',
  title: 'Padding',
  description: 'Add padding to the section. Based on design system spacing',
  options: {
    list: [
      { title: 'None', value: 'none' },
      { title: 'Small', value: 'small' },
      { title: 'Medium', value: 'medium' },
      { title: 'Large', value: 'large' },
      { title: 'XLarge', value: 'xlarge' },
    ],
    layout: 'dropdown',
  },
  initialValue: 'small',
});

export const paddingDirection = defineType({
  name: 'direction',
  type: 'string',
  title: 'Direction',
  description: 'Add padding to the section. Based on design system spacing',
  options: {
    list: [
      { title: 'Top', value: 'top' },
      { title: 'Bottom', value: 'bottom' },
      { title: 'Both', value: 'both' },
    ],
    layout: 'dropdown',
  },
  initialValue: 'both',
});
