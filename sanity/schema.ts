import { type SchemaTypeDefinition } from "sanity";
// documents
import page from "./schemas/documents/page";
import author from "./schemas/documents/author";
import category from "./schemas/documents/category";
import post from "./schemas/documents/post";

// Schema UI objects
import blockContent from "./schemas/blocks/shared/block-content";
import link from "./schemas/blocks/shared/link";
import { layoutVariant } from "./schemas/blocks/shared/layout-variants";
import { colorVariant } from "./schemas/blocks/shared/color-variant";
import { buttonVariant } from "./schemas/blocks/shared/button-variant";
import sectionPadding from "./schemas/blocks/shared/section-padding";
import hero1 from "./schemas/blocks/hero/hero-1";
import sectionHeader from "./schemas/blocks/section-header";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    page,
    author,
    category,
    post,
    // blocks
    blockContent,
    link,
    colorVariant,
    buttonVariant,
    sectionPadding,
    layoutVariant,
    hero1,
    sectionHeader,
  ],
};
