import { FileText } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'form-security-request',
  type: 'object',
  title: 'Form: Security Request',
  description: "A comprehensive security request form for O'Linn Security services.",
  icon: FileText,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant',
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Form Title',
      initialValue: 'Security Request Form',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Form Description',
      description: 'Optional description text to display above the form',
    }),
    defineField({
      name: 'submitButtonText',
      type: 'string',
      title: 'Submit Button Text',
      initialValue: 'Submit Request',
    }),
    defineField({
      name: 'successMessage',
      type: 'text',
      title: 'Success Message',
      initialValue: "Thank you for your security request. We'll contact you within 24 hours.",
    }),
    defineField({
      name: 'notificationEmail',
      type: 'string',
      title: 'Notification Email',
      description: 'Email address to send form submissions to',
      validation: Rule => Rule.email().error('Please enter a valid email address'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Security Request Form',
      };
    },
  },
});
