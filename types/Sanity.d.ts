import type {
  SanityImageObject,
  SanityImageDimensions,
} from "@sanity/image-url/lib/types/types";
import type { SanityDocument } from "next-sanity";

declare global {
  namespace Sanity {
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
      readonly _type: "page";
      blocks?: Block[];
    };

    type Services = PageBase & {
      readonly _type: "services";
      blocks?: Block[];
    };

    type Scene = PageBase & {
      readonly _type: "scenes";
      body?: any[];
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
            _type: "scenes";
            _id: string;
            title: string;
            slug: { current: string };
            mainSceneMarkerPosition?: {
              x: number;
              y: number;
              z: number;
            };
            body?: any[];
          }
        | {
            _key: string;
            _type: "pointOfInterest";
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
    };

    type Post = PageBase &
      SanityDocument<{
        readonly _type: "post";
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
    }>;

    type Author = SanityDocument<{
      name: string;
      slug: { current: string };
      image?: Image;
    }>;

    type Category = SanityDocument<{
      title: string;
    }>;

    type Settings = SanityDocument<{
      logo: Image;
      largeLogo: Image;
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

    // objects
    type Block<T = string> = {
      _type: T;
      _key: string;
      uid?: string;
    };
  }
}

export {};
