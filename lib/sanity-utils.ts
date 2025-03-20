import { createClient } from 'next-sanity';

// Function to resolve a Sanity reference to its URL path
export async function resolveReference(reference: any) {
  if (!reference || !reference._ref) {
    return null;
  }

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2023-05-03',
    useCdn: true,
  });

  // Fetch the document by ID
  const doc = await client.fetch(
    `*[_id == $id][0]{
      _type,
      "slug": slug.current
    }`,
    { id: reference._ref }
  );

  if (!doc) return null;

  // Map document types to URL paths
  if (doc._type === 'post' && doc.slug) {
    return `/blog/${doc.slug}`;
  } else if (doc._type === 'page' && doc.slug) {
    return `/${doc.slug}`;
  } else if (doc.slug) {
    return `/${doc._type}/${doc.slug}`;
  }

  return null;
}

// Function to extract href from a Sanity portable text link mark
export function extractHrefFromLinkMark(value: any) {
  // Direct URL
  if (value?.href) {
    return value.href;
  }
  
  // Reference with resolved data (happens after data is loaded)
  if (value?.reference && value.reference._type && value.reference.slug?.current) {
    const docType = value.reference._type;
    const docSlug = value.reference.slug.current;
    
    if (docType === 'post' && docSlug) {
      return `/blog/${docSlug}`;
    } else if (docType === 'page' && docSlug) {
      return `/${docSlug}`;
    } else if (docSlug) {
      return `/${docType}/${docSlug}`;
    }
  }
  
  // Reference ID only (unresolved reference)
  if (value?.reference && value.reference._ref) {
    // This would need server-side resolution
    // For client-side, we can use a special route that resolves the ID
    return `/api/resolve-reference?id=${value.reference._ref}`;
  }
  
  return '#';
} 