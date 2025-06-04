import type { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with the provided credentials
cloudinary.config({
  cloud_name: "dswklswqw",
  api_key: "916231453571933",
  api_secret: "juONTFLEVV6HxhxN3j2Y-fesZjs",
  secure: true,
});

/**
 * Upload a file to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param folder - The folder to upload to (optional)
 * @returns Promise with Cloudinary upload response
 */
export async function uploadImage(
  fileBuffer: Buffer,
  folder = "car-listings"
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: "auto" as const,
    };

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload failed - no result returned"));
        }
        resolve(result);
      })
      .end(fileBuffer);
  });
}

/**
 * Upload multiple images to Cloudinary
 * @param fileBuffers - Array of file buffers to upload
 * @param folder - The folder to upload to (optional)
 * @returns Promise with array of image URLs
 */
export async function uploadMultipleImages(
  fileBuffers: Buffer[],
  folder = "car-listings"
): Promise<string[]> {
  try {
    const uploadPromises = fileBuffers.map((buffer) => uploadImage(buffer, folder));
    const results = await Promise.all(uploadPromises);
    return results.map((result) => result.secure_url);
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw error;
  }
}

/**
 * Delete an image from Cloudinary by URL or public ID
 * @param publicIdOrUrl - The public ID or URL of the image to delete
 * @returns Promise with deletion result
 */
export async function deleteImage(publicIdOrUrl: string): Promise<any> {
  try {
    // If URL is provided, extract public ID
    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.startsWith("http")) {
      // Extract public ID from URL
      const urlParts = publicIdOrUrl.split("/");
      const filenameWithExtension = urlParts[urlParts.length - 1];
      const filename = filenameWithExtension.split(".")[0];
      const folderPath = urlParts[urlParts.length - 2];
      publicId = `${folderPath}/${filename}`;
    }

    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}