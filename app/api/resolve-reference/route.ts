import { NextRequest, NextResponse } from 'next/server';
import { resolveReference } from '@/lib/sanity-utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing reference ID' }, { status: 400 });
  }

  try {
    const url = await resolveReference({ _ref: id });
    
    if (!url) {
      return NextResponse.json({ error: 'Reference not found' }, { status: 404 });
    }
    
    // Redirect to the resolved URL
    return NextResponse.redirect(new URL(url, request.url));
  } catch (error) {
    console.error('Error resolving reference:', error);
    return NextResponse.json({ error: 'Failed to resolve reference' }, { status: 500 });
  }
} 