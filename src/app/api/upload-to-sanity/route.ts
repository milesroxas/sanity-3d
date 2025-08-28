import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'node:buffer';
import { client } from '@/sanity/lib/client';
import { token } from '@/sanity/lib/token';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const writeClient = client.withConfig({ token });

    const asset = await writeClient.assets.upload('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    // Sanity returns the asset document with _id, url, mimeType, size, etc.
    return NextResponse.json({ asset }, { status: 200 });
  } catch (error) {
    console.error('Sanity file upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file to Sanity' },
      { status: 500 }
    );
  }
}
