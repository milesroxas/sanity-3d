import { groq } from 'next-sanity';

export const SCENE_QUERY = groq`
  *[_type == "scenes" && slug.current == $slug][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    title,
    slug,
    sceneType,
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
      },
      _type == "muxVideo" => {
        ...,
        video {
          asset-> {
            _id,
            playbackId,
            assetId,
            filename,
            status
          }
        }
      }
    },
    blocks[] {
      ...,
      _type == "experience-carousel" => {
        ...,
        images[] {
          ...,
          asset->{
            _id,
            url,
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
      _type == "section-content" => {
        ...,
        sectionBody[]{
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
        blocks[] {
          ...,
          _type == "expanded-body" => {
            ...,
            links[] {
              ...,
              _type == 'pageLink' => {
                ...,
                buttonVariant,
                page->{_id, _type, title, slug}
              },
              _type == 'customLink' => {
                ...,
                buttonVariant
              },
              _type == 'servicesLink' => {
                ...,
                buttonVariant,
                services->{_id, _type, title, slug}
              },
            },
          },
          _type == "media" => {
            ...,
            title,
            mediaType,
            alt,
            image {
              asset->{
                _id,
                url,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height
                  }
                }
              }
            },
            video {
              asset-> {
                _id,
                playbackId,
                assetId,
                filename,
                status
              }
            },
            videoOptions{
              showControls
            }
          }
        }
      }
    },
    mainExpandedBody{
      ...,
      blocks[] {
        ...,
        _type == "experience-carousel" => {
          ...,
          images[] {
            ...,
            asset->{
              _id,
              url,
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
        _type == "text-block" => {
          ...,
          content[]{
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
            },
            _type == "muxVideo" => {
              ...,
              video {
                asset-> {
                  _id,
                  playbackId,
                  assetId,
                  filename,
                  status
                }
              }
            }
          }
        },
        _type == "media" => {
          ...,
          title,
          mediaType,
          alt,
          image {
            asset->{
              _id,
              url,
              metadata {
                lqip,
                dimensions {
                  width,
                  height
                }
              }
            }
          },
          video {
            asset-> {
              _id,
              playbackId,
              assetId,
              filename,
              status
            }
          },
          videoOptions{
            showControls
          }
        }
      },
      links[] {
        ...,
        _type == 'pageLink' => {
          ...,
          buttonVariant,
          page->{_id, _type, title, slug}
        },
        _type == 'customLink' => {
          ...,
          buttonVariant
        },
        _type == 'servicesLink' => {
          ...,
          buttonVariant,
          services->{_id, _type, title, slug}
        }
      }
    },
    replaceMainLinkWithExpanded,
    poiDisplayMode,
    links[] {
      ...,
      _type == 'pageLink' => {
        ...,
        buttonVariant,
        page->{_id, _type, title, slug}
      },
      _type == 'customLink' => {
        ...,
        buttonVariant
      },
      _type == 'servicesLink' => {
        ...,
        buttonVariant,
        services->{_id, _type, title, slug}
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
        }
      },
      _type == "pointOfInterest" => {
        _key,
        _type,
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
          },
          _type == "muxVideo" => {
            ...,
            video {
              asset-> {
                _id,
                playbackId,
                assetId,
                filename,
                status
              }
            }
          }
        },
        blocks[] {
          ...,
          _type == "experience-carousel" => {
            ...,
            images[] {
              ...,
              asset->{
                _id,
                url,
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
          _type == "text-block" => {
            ...,
            content[]{
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
              },
              _type == "muxVideo" => {
                ...,
                video {
                  asset-> {
                    _id,
                    playbackId,
                    assetId,
                    filename,
                    status
                  }
                }
              }
            }
          },
          _type == "media" => {
            ...,
            title,
            mediaType,
            alt,
            image {
              asset->{
                _id,
                url,
                metadata {
                  lqip,
                  dimensions {
                    width,
                    height
                  }
                }
              }
            },
            video {
              asset-> {
                _id,
                playbackId,
                assetId,
                filename,
                status
              }
            },
            videoOptions{
              showControls
            }
          }
        },
        links[] {
          ...,
          _type == 'pageLink' => {
            ...,
            buttonVariant,
            page->{_id, _type, title, slug}
          },
          _type == 'customLink' => {
            ...,
            buttonVariant
          },
          _type == 'servicesLink' => {
            ...,
            buttonVariant,
            services->{_id, _type, title, slug}
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
    modelFiles[]{
      _key,
      _type,
      modelName,
      "fileUrl": sceneModelFile
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

export const NAVIGATION_SCENES_QUERY = groq`
  *[_type == "scenes" && slug.current == "experience"][0] {
    pointsOfInterest[]->{
      _id,
      _type,
      title,
      slug,
      sceneType,
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
`;
