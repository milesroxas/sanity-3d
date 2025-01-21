import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

interface SupabaseFile {
  name: string;
  url: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Hook to fetch files from a Supabase storage bucket.
 * @param bucketName - Name of the Supabase bucket
 */
export const useListBucketFiles = (bucketName: string) => {
  const [files, setFiles] = useState<SupabaseFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!bucketName) {
      setError("Bucket name is required");
      setLoading(false);
      return;
    }

    const fetchFiles = async () => {
      try {
        const { data, error } = await supabase.storage.from(bucketName).list();
        if (error) {
          setError(`Error fetching files: ${error.message}`);
          console.error(error.message);
          return;
        }

        const filesWithUrls =
          data?.map((file) => ({
            name: file.name,
            url: supabase.storage.from(bucketName).getPublicUrl(file.name).data
              .publicUrl,
          })) || [];
        setFiles(filesWithUrls);
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred while fetching files.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [bucketName]);

  return { files, error, loading };
};
