import { NextResponse } from "next/server";
import { supabaseServiceClient } from "@/sanity/lib/supabaseServiceClient";

// Disable Next.js body parser for this route (App Router handles this automatically)
export const config = {
  api: {
    bodyParser: false,
  },
};

// POST method handler
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bucketName = formData.get("bucketName") as string;

    if (!file || !bucketName) {
      return NextResponse.json(
        { error: "Missing file or bucket name" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServiceClient.storage
      .from(bucketName)
      .upload(file.name, file, {
        contentType: file.type,
      });

    if (error) {
      return NextResponse.json(
        { error: `Failed to upload file: ${error.message}` },
        { status: 500 }
      );
    }

    const publicUrl = supabaseServiceClient.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return NextResponse.json({ publicUrl: publicUrl.data.publicUrl });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("File upload error:", error);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
