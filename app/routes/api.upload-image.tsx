import { json, type ActionFunctionArgs } from "@remix-run/node";
import { uploadImage } from "~/lib/cloudinary.server";
import { requireAdmin } from "~/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    // Only allow admin users to upload images
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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload the file to Cloudinary
    const result = await uploadImage(buffer);

    // Return the URL and other info
    return json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return json(
      { error: "Failed to upload image", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// This is a resource route, so no default export is needed