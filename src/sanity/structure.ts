import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';
import {
  BookA,
  Files,
  Hammer,
  Image,
  ListCollapse,
  MapPin,
  Quote,
  Settings,
  User,
  UsersRound,
} from 'lucide-react';

export const structure = (S: any, context: any) =>
  S.list()
    .title('Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'page',
        title: 'Pages',
        icon: Files,
        S,
        context,
      }),
      S.listItem()
        .title('Posts')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('Post')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]) // Default ordering
        ),
      orderableDocumentListDeskItem({
        type: 'services',
        title: 'Services',
        icon: Hammer,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'team',
        title: 'Team',
        icon: UsersRound,
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('Scenes')
        .icon(MapPin)
        .child(
          S.documentTypeList('scenes')
            .title('Scenes')
            .defaultOrdering([{ field: '_createdAt', direction: 'desc' }]) // Default ordering
        ),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'media',
        title: 'Media',
        icon: Image,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'category',
        title: 'Categories',
        icon: BookA,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'author',
        title: 'Authors',
        icon: User,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'faq',
        title: 'FAQs',
        icon: ListCollapse,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'testimonial',
        title: 'Testimonials',
        icon: Quote,
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .id('settings')
        .title('Site Settings')
        .icon(Settings)
        .child(
          S.editor()
            .id('settings')
            .schemaType('settings')
            .documentId('settings')
            .views([
              S.view.form().title('Content').id('content'),
              S.view.form().title('SEO').id('seo'),
            ])
        ),
    ]);
