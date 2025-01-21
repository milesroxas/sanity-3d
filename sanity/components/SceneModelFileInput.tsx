import React, { useState } from "react";
import { Stack, Select, Card, Text } from "@sanity/ui";
import { set, unset, StringInputProps } from "sanity";
import { useListBucketFiles } from "@/hooks/useListBucketFiles";

const SceneModelFileInput: React.FC<StringInputProps> = ({
  value,
  onChange,
}) => {
  const bucketName = "sanity-models"; // Bucket name for files
  const { files, error, loading } = useListBucketFiles(bucketName); // Fetch existing files

  const [selectedFile, setSelectedFile] = useState<string>(value || "");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection from the dropdown
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedFile(selected);
    onChange(selected ? set(selected) : unset());
  };

  // Handle file upload via server-side API
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucketName", bucketName); // Pass the bucket name

      // Send the file to the server-side API for secure upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      const data = await response.json();
      setSelectedFile(data.publicUrl); // Update the selected file with the new public URL
      onChange(set(data.publicUrl)); // Update the value in Sanity Studio
      setUploadError(null);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred while uploading the file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Stack space={3}>
      {/* Display errors when listing files */}
      {error && (
        <Card padding={2} tone="critical">
          <Text>{error}</Text>
        </Card>
      )}

      {/* Dropdown for selecting an existing file */}
      <Select
        value={selectedFile}
        onChange={handleSelectChange}
        disabled={loading}
      >
        <option value="">Select an existing file</option>
        {files.map((file) => (
          <option key={file.name} value={file.url}>
            {file.name}
          </option>
        ))}
      </Select>

      {/* File input for uploading a new file */}
      <input
        type="file"
        onChange={handleUpload}
        disabled={isUploading || loading}
      />

      {/* Display upload errors */}
      {uploadError && (
        <Card padding={2} tone="critical">
          <Text>{uploadError}</Text>
        </Card>
      )}

      {/* Display the success message with the selected file URL */}
      {selectedFile && (
        <Card padding={2} tone="positive">
          <Text>Selected File URL: {selectedFile}</Text>
        </Card>
      )}
    </Stack>
  );
};

export default SceneModelFileInput;
