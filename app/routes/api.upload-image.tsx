import { json, type ActionFunctionArgs } from "@remix-run/node";
import { uploadMedia } from "~/lib/cloudinary.server";
import { requireAdmin } from "~/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Only allow admin users to upload media
    await requireAdmin(request);

    // Only allow POST requests
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, { status: 405 });
    }

    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return json({ error: "Only images and videos are allowed" }, { status: 400 });
    }

    // Validate file size
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const maxVideoSize = 50 * 1024 * 1024; // 50MB
    
    if (isImage && file.size > maxImageSize) {
      return json({ error: "Image file too large. Maximum 5MB allowed." }, { status: 400 });
    }
    
    if (isVideo && file.size > maxVideoSize) {
      return json({ error: "Video file too large. Maximum 50MB allowed." }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the file to Cloudinary
    const result = await uploadMedia(buffer);

    // Return the URL and other info
    return json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resource_type,
      type: isVideo ? 'video' : 'image',
    });
  } catch (error) {
    console.error("Error uploading media:", error);
    return json(
      { error: "Failed to upload media", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// This is a resource route, so no default export is needed