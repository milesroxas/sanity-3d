import type { SanityImageDimensions, SanityImageObject } from '@sanity/image-url/lib/types/types';
import type { MuxVideoAsset, SanityDocument } from 'next-sanity';

declare global {
  namespace Sanity {
    // Link types - reusable across all blocks
    type ButtonVariant =
      | 'default'
      | 'secondary'
      | 'link'
      | 'destructive'
      | 'outline'
      | 'ghost'
      | null
      | undefined;

    type PageLink = {
      _type: 'pageLink';
      _key: string;
      title: string;
      buttonVariant?: ButtonVariant;
      page: {
        _id: string;
        _type: string;
        title: string;
        slug: {
          current: string;
        };
      };
    };

    type CustomLink = {
      _type: 'customLink';
      _key: string;
      title: string;
      href: string;
      target?: boolean;
      buttonVariant: ButtonVariant;
    };

    type ServicesLink = {
      _type: 'servicesLink';
      _key: string;
      title: string;
      buttonVariant?: ButtonVariant;
      services: {
        _id: string;
        _type: string;
        title: string;
        slug: {
          current: string;
        };
      };
    };

    type Link = PageLink | CustomLink | ServicesLink;

    // pages
    type PageBase = SanityDocument<{
      title?: string;
      slug: { current: string };
      meta_title: string;
      meta_description: string;
      ogImage?: Image;
      noindex: boolean;
    }>;

    type Page = PageBase & {
      readonly _type: 'page';
      blocks?: Block[];
    };

    type Services = PageBase & {
      readonly _type: 'services';
      blocks?: Block[];
    };

    // Updated Team to match your query
    type Team = SanityDocument<{
      readonly _type: 'team';
      _id: string;
      title: string;
      slug: { current: string };
      image?: Image;
      role?: string;
      email?: string;
      bio?: any; // Consider using a more specific type
      blocks?: Block[];
      meta_title?: string;
      meta_description?: string;
      noindex: boolean;
      ogImage?: Image;
      orderRank?: number;
    }>;

    type Scene = PageBase & {
      readonly _type: 'scenes';
      body?: any[];
      links?: Link[];
      mainExpandedBody?: {
        _type: 'expanded-body';
        _key?: string;
        title?: string;
        body?: any[];
        links?: Link[];
      } | null;
      replaceMainLinkWithExpanded?: boolean;
      mainSceneMarkerPosition?: {
        x: number;
        y: number;
        z: number;
      };
      mainSceneCameraPosition?: {
        x: number;
        y: number;
        z: number;
      };
      mainSceneCameraTarget?: {
        x: number;
        y: number;
        z: number;
      };
      pointsOfInterest?: Array<
        | {
            _key: string;
            _type: 'scenes';
            _id: string;
            title: string;
            slug: { current: string };
            mainSceneMarkerPosition?: {
              x: number;
              y: number;
              z: number;
            };
            body?: any[];
            link?: Link;
          }
        | {
            _key: string;
            _type: 'pointOfInterest';
            title: string;
            body?: any[];
            markerPosition?: {
              x: number;
              y: number;
              z: number;
            };
            cameraPosition?: {
              x: number;
              y: number;
              z: number;
            };
            cameraTarget?: {
              x: number;
              y: number;
              z: number;
            };
          }
      >;
      blocks?: Block[];
      sceneType?:
        | 'main'
        | 'shops'
        | 'company'
        | 'resort'
        | 'events'
        | 'farm'
        | 'construction'
        | 'gatedCommunity'
        | 'homes';
      modelFiles?: Array<{
        _key: string;
        _type: 'modelFiles';
        modelName?: string;
        fileUrl?: string;
      }>;
    };

    type Post = PageBase &
      SanityDocument<{
        readonly _type: 'post';
        excerpt?: string;
        author?: Author;
        categories?: Category[];
        body: any;
        image?: Image;
      }>;

    type Media = SanityDocument<{
      title: string;
      file: File;
    }>;
    type Settings = SanityDocument<{
      logo: Image;
      largeLogo: Image;
      contact: {
        phone: string;
        email: string;
      };
      address: {
        street: string;
        city: string;
        state: string;
        zip: string;
      };
      businessHours: {
        hours: string;
      };
      social: {
        facebook: string;
        instagram: string;
        twitter: string;
        linkedin: string;
        youtube: string;
        yelp: string;
        tiktok: string;
        googleReviews: string;
      };
    }>;

    type Nav = SanityDocument<{
      logo: Image;
      companyLinks: Link[];
      services: Link[];
      legal: Link[];
    }>;

    type Author = SanityDocument<{
      name: string;
      slug: { current: string };
      image?: Image;
    }>;

    type Category = SanityDocument<{
      title: string;
    }>;

    type Image = SanityImageObject &
      Partial<{
        alt: string;
        asset: {
          _id: string;
          mimeType?: string;
          metadata: {
            dimensions: SanityImageDimensions;
            lqip: string;
          };
        };
      }>;

    type Video = MuxVideoAsset &
      Partial<{
        alt: string;
        asset: {
          _id: string;
          playbackId: string;
          assetId: string;
          filename: string;
        };
      }>;

    // objects
    type Block<T = string> = {
      _type: T;
      _key: string;
      uid?: string;
    };
  }
}

export {};
