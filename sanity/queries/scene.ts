import { groq } from "next-sanity";

export const SCENE_QUERY = groq`
  *[_type == "scenes" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    slug,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        }
      }
    },
    pointsOfInterest[]{
      _key,
      _type == "reference" => @->{
        _id,
        _type,
        title,
        slug,
        mainSceneMarkerPosition {
          x,
          y,
          z
        },
        mainSceneCameraPosition {
          x,
          y,
          z
        },
        mainSceneCameraTarget {
          x,
          y,
          z
        },
        body[]{
          ...,
          _type == "image" => {
            ...,
            asset->{
              _id,
              url,
              mimeType,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            }
          }
        }
      },
      _type != "reference" => {
        title,
        body[]{
          ...,
          _type == "image" => {
            ...,
            asset->{
              _id,
              url,
              mimeType,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            }
          }
        },
        markerPosition {
          x,
          y,
          z
        },
        cameraPosition {
          x,
          y,
          z
        },
        cameraTarget {
          x,
          y,
          z
        }
      }
    },
    mainSceneMarkerPosition {
      x,
      y,
      z
    },
    mainSceneCameraPosition {
      x,
      y,
      z
    },
    mainSceneCameraTarget {
      x,
      y,
      z
    },
    blocks[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          _id,
          url,
          mimeType,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        }
      }
    },
    meta_title,
    meta_description,
    noindex,
    ogImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    }
  }
`;

export const SCENES_QUERY = groq`*[_type == "scenes" && defined(slug.current)] {
  _id,
  _type,
  title,
  slug,
  mainSceneMarkerPosition {
    x,
    y,
    z
  },
  mainSceneCameraPosition {
    x,
    y,
    z
  },
  mainSceneCameraTarget {
    x,
    y,
    z
  },
  pointsOfInterest[]{
    _key,
    _type == "reference" => @->{
      _id,
      _type,
      title,
      slug,
      mainSceneMarkerPosition {
        x,
        y,
        z
      },
      mainSceneCameraPosition {
        x,
        y,
        z
      },
      mainSceneCameraTarget {
        x,
        y,
        z
      }
    }
  }
}`;
