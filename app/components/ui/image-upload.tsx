import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/toast";

type ImageUploadProps = {
  label?: string;
  maxFiles?: number;
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
  className?: string;
};

export function ImageUpload({
  label = "Upload Images",
  maxFiles = 5,
  onImagesChange,
  initialImages = [],
  className = "",
}: ImageUploadProps) {
  const [files, setFiles] = useState<Array<File & { preview?: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialImages);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Handle dropped files
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check if we're exceeding the max number of files
      if (acceptedFiles.length + files.length + uploadedUrls.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} images`);
        return;
      }

      // Create preview URLs for the files
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    [files, maxFiles, uploadedUrls.length]
  );

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: maxFiles - uploadedUrls.length,
  });

  // Upload a single file
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  // Upload all files
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Initialize progress for this file
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 0,
        }));

        // Simulate progress updates (in a real app, you'd get this from the upload API)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[file.name] || 0;
            if (currentProgress < 90) {
              return {
                ...prev,
                [file.name]: currentProgress + 10,
              };
            }
            return prev;
          });
        }, 300);

        // Upload the file
        const url = await uploadFile(file);

        // Clear the interval and set progress to 100
        clearInterval(progressInterval);
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 100,
        }));

        return url;
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);

      setUploadedUrls((prev) => [...prev, ...validUrls]);
      onImagesChange([...uploadedUrls, ...validUrls]);

      // Clear the files after successful upload
      setFiles([]);
      toast.success(`Successfully uploaded ${validUrls.length} images`);
    } catch (error) {
      toast.error("Error uploading images");
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  // Remove a file from the pending uploads
  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      // Release the object URL to avoid memory leaks
      if (newFiles[index]?.preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Remove an already uploaded image
  const removeUploadedImage = (index: number) => {
    setUploadedUrls((prev) => {
      const newUrls = [...prev];
      newUrls.splice(index, 1);
      onImagesChange(newUrls);
      return newUrls;
    });
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <Label>{label}</Label>}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isDragActive
              ? "Drop the images here..."
              : "Drag and drop images here, or click to select files"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Supports JPG, PNG and WebP up to 5MB
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {uploadedUrls.length}/{maxFiles} images uploaded
          </p>
        </div>
      </div>

      {/* Already uploaded images */}
      {uploadedUrls.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedUrls.map((url, index) => (
              <div
                key={url}
                className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 group"
              >
                <img
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeUploadedImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending uploads */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Pending Uploads</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 group"
              >
                <img
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                {uploadProgress[file.name] && uploadProgress[file.name] < 100 ? (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="h-1 w-24 bg-gray-300 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${uploadProgress[file.name]}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-xs">{uploadProgress[file.name]}%</div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="mt-2"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>
        </div>
      )}
    </div>
  );
}