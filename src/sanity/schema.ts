import { type SchemaTypeDefinition } from 'sanity';
// documents
import author from './schemas/documents/author';
import category from './schemas/documents/category';
import faq from './schemas/documents/faq';
import page from './schemas/documents/page';
import post from './schemas/documents/post';
import scenes from './schemas/documents/scenes';
import services from './schemas/documents/services';
import team from './schemas/documents/team';
import testimonial from './schemas/documents/testimonial';

// Schema UI shared objects
import blockContent from './schemas/blocks/shared/block-content';
import { buttonVariant } from './schemas/blocks/shared/button-variant';
import { colorVariant } from './schemas/blocks/shared/color-variant';
import link from './schemas/blocks/shared/link';
import { media } from './schemas/blocks/shared/media';
import { paddingDirection, sectionPadding } from './schemas/blocks/shared/section-padding';
import { styleVariant } from './schemas/blocks/shared/style-variant';
import { themeVariant } from './schemas/blocks/shared/theme';
import video from './schemas/blocks/shared/video';
// Schema UI objects
import carousel1 from './schemas/blocks/carousel/carousel-1';
import carousel2 from './schemas/blocks/carousel/carousel-2';
import cta1 from './schemas/blocks/cta/cta-1';
import faqs from './schemas/blocks/faqs';
import featuredContentOffset from './schemas/blocks/featured/content-offset';
import newsletter from './schemas/blocks/forms/newsletter';
import gridCard from './schemas/blocks/grid/grid-card';
import gridPost from './schemas/blocks/grid/grid-post';
import gridRow from './schemas/blocks/grid/grid-row';
import pricingCard from './schemas/blocks/grid/pricing-card';
import hero1 from './schemas/blocks/hero/hero-1';
import hero2 from './schemas/blocks/hero/hero-2';
import logoCloud1 from './schemas/blocks/logo-cloud/logo-cloud-1';
import sectionHeader from './schemas/blocks/section-header';
import splitCard from './schemas/blocks/split/split-card';
import splitCardsList from './schemas/blocks/split/split-cards-list';
import splitContent from './schemas/blocks/split/split-content';
import splitImage from './schemas/blocks/split/split-image';
import splitInfo from './schemas/blocks/split/split-info';
import splitInfoList from './schemas/blocks/split/split-info-list';
import splitRow from './schemas/blocks/split/split-row';
import largeCallout from './schemas/blocks/text/large-callout';
import timelineRow from './schemas/blocks/timeline/timeline-row';
import timelinesOne from './schemas/blocks/timeline/timelines-1';
import legal from './schemas/documents/legal';
import nav from './schemas/singleton/nav';

// singleton
import ctaTeam from './schemas/blocks/cta/cta-team';
import splitVideo from './schemas/blocks/split/split-video';
import modelFiles from './schemas/objects/modelFiles';
import settings from './schemas/singleton/settings';
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    page,
    post,
    team,
    author,
    category,
    faq,
    testimonial,
    scenes,
    services,
    legal,
    // shared objects
    blockContent,
    link,
    colorVariant,
    styleVariant,
    themeVariant,
    buttonVariant,
    sectionPadding,
    paddingDirection,
    media,
    video,
    // blocks
    hero1,
    hero2,
    sectionHeader,
    splitRow,
    splitContent,
    splitCardsList,
    splitCard,
    splitImage,
    splitVideo,
    splitInfoList,
    splitInfo,
    gridCard,
    pricingCard,
    gridPost,
    gridRow,
    carousel1,
    carousel2,
    timelineRow,
    timelinesOne,
    cta1,
    logoCloud1,
    faqs,
    newsletter,
    largeCallout,
    featuredContentOffset,
    ctaTeam,
    // singleton
    settings,
    nav,
    // objects
    modelFiles,
  ],
};
