import { Shield } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'securityRequest',
  type: 'document',
  title: 'Security Request',
  icon: Shield,
  fields: [
    defineField({ name: 'requestId', type: 'string', readOnly: true }),

    // Contact Information
    defineField({ name: 'fullName', type: 'string', title: 'Full Name' }),
    defineField({ name: 'companyName', type: 'string', title: 'Company Name' }),
    defineField({ name: 'phoneNumber', type: 'string', title: 'Phone Number' }),
    defineField({ name: 'emailAddress', type: 'string', title: 'Email Address' }),
    defineField({
      name: 'preferredContactMethod',
      title: 'Preferred Contact Method',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // Service Location
    defineField({ name: 'siteAddress', type: 'string', title: 'Site Address' }),
    defineField({ name: 'locationType', type: 'string', title: 'Location Type' }),

    // Service Details
    defineField({
      name: 'securityTypes',
      title: 'Security Types',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'estimatedStartDate', type: 'string', title: 'Estimated Start Date' }),
    defineField({ name: 'estimatedEndDate', type: 'string', title: 'Estimated End Date' }),
    defineField({ name: 'daysHoursCoverage', type: 'text', title: 'Days/Hours Coverage' }),
    defineField({ name: 'totalGuardsNeeded', type: 'string', title: 'Total Guards Needed' }),
    defineField({ name: 'serviceType', type: 'string', title: 'Service Type' }),

    // Site Details
    defineField({ name: 'siteDescription', type: 'text', title: 'Site Description' }),
    defineField({ name: 'securityConcerns', type: 'text', title: 'Security Concerns' }),
    defineField({ name: 'currentProvider', type: 'string', title: 'Current Provider' }),
    defineField({ name: 'currentProviderName', type: 'string', title: 'Current Provider Name' }),

    // Additional Information
    defineField({ name: 'specialCertifications', type: 'text', title: 'Special Certifications' }),
    defineField({
      name: 'patrolRequirements',
      title: 'Patrol Requirements',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'onsiteContact', type: 'string', title: 'On-site Contact' }),

    // Budget & Preferences
    defineField({ name: 'budgetRange', type: 'string', title: 'Budget Range' }),
    defineField({ name: 'hearAboutUs', type: 'string', title: 'Hear About Us' }),

    // Attachments as file asset references
    defineField({ name: 'attachments', type: 'array', of: [{ type: 'file' }] }),

    // Workflow
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Quoted', value: 'quoted' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'emailAddress',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Security Request',
        subtitle: subtitle || '',
      };
    },
  },
});
