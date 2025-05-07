// components/large‑callout.tsx

import type { PortableTextBlock } from 'next-sanity';
import LargeCalloutClient from './large-callout.client';

export default function LargeCallout({ body }: { body: PortableTextBlock[] }) {
  if (!body || !Array.isArray(body) || body.length === 0) {
    return (
      <div className="container">
        <p className="mb-8 max-w-4xl text-2xl text-muted-foreground lg:text-5xl/snug">
          No content available
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <LargeCalloutClient body={body} />
    </div>
  );
}
