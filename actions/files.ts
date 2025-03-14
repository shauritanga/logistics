"use server";

import { v2 as cloudinary } from "cloudinary"; // Assuming this is your existing db connection
import { revalidatePath } from "next/cache";
import { File } from "@/models/index";
import dbConnect from "@/lib/mongodb";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getFiles() {
  try {
    await dbConnect();
    const filesResponse = await File.find({});
    const files = JSON.parse(JSON.stringify(filesResponse));
    return { files };
  } catch (error) {
    console.error("Error fetching files:", error);
    return { error: "Failed to fetch files" };
  }
}

export async function createFolder(name: string, parentPath: string) {
  try {
    await dbConnect();
    const folder = new File({
      id: crypto.randomUUID(),
      name,
      type: "folder",
      size: 0,
      lastModified: new Date(),
      path: `${parentPath}/${name}`,
      parentPath,
    });

    await folder.save();
    revalidatePath("/dashboard/documents");
    return { folder: folder.toJSON() };
  } catch (error) {
    console.error("Error creating folder:", error);
    return { error: "Failed to create folder" };
  }
}

export async function uploadFile(file: File, parentPath: string) {
  try {
    await dbConnect();
    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "files",
            resource_type: "auto", // Let Cloudinary detect the resource type
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const fileDoc = new File({
      id: crypto.randomUUID(),
      name: file.name,
      type: "file",
      size: file.size,
      lastModified: new Date(),
      path: `${parentPath}/${file.name}`,
      parentPath,
      cloudinaryId: (result as any).public_id,
      url: (result as any).secure_url,
    });

    await fileDoc.save();
    revalidatePath("/dashboard/documents");
    return { file: fileDoc.toJSON() };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { error: "Failed to upload file" };
  }
}

export async function deleteFile(id: string) {
  try {
    await dbConnect();
    const file = await File.findOne({ id });
    if (!file) {
      return { error: "File not found" };
    }

    if (file.type === "file" && file.cloudinaryId) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(file.cloudinaryId);
    }

    // The pre middleware will handle deleting children if it's a folder
    await file.deleteOne();

    revalidatePath("/dashboard/documents");
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { error: "Failed to delete file" };
  }
}

export async function renameFile(id: string, newName: string) {
  try {
    await dbConnect();
    const file = await File.findOne({ id });
    if (!file) {
      return { error: "File not found" };
    }

    const newPath = `${file.parentPath}/${newName}`;

    if (file.type === "folder") {
      // Update all children paths
      const children = await File.find({
        path: { $regex: `^${file.path}/` },
      });

      for (const child of children) {
        child.path = child.path.replace(file.path, newPath);
        child.parentPath = child.parentPath.replace(file.path, newPath);
        await child.save();
      }
    }

    // Update the file/folder itself
    file.name = newName;
    file.path = newPath;
    file.lastModified = new Date();
    await file.save();

    revalidatePath("/dashboard/documents");
    return { success: true };
  } catch (error) {
    console.error("Error renaming file:", error);
    return { error: "Failed to rename file" };
  }
}

export async function getSignedDownloadUrl(
  cloudinaryId: string
): Promise<{ url?: string; error?: string }> {
  try {
    if (!cloudinaryId) {
      return { error: "File ID not found" };
    }

    const config = cloudinary.config();
    console.log("Active Cloudinary config:", {
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
    });

    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      return { error: "Cloudinary configuration incomplete" };
    }

    const publicId = cloudinaryId;
    console.log("Using publicId:", publicId);

    const resourceTypes = ["raw", "image", "video"];
    let resourceInfo = null;
    let resourceType = "raw";

    for (const type of resourceTypes) {
      try {
        resourceInfo = await cloudinary.api.resource(publicId, {
          resource_type: type,
        });
        resourceType = type;
        console.log(`Found resource with type ${type}:`, resourceInfo);
        break;
      } catch (error: any) {
        console.log(
          `Resource not found with type ${type}:`,
          error.response?.data
        );
        // If you want to collect errors and provide more information, you can push to an array here
        continue;
      }
    }

    if (!resourceInfo) {
      return { error: `Resource not found for publicId: ${publicId}` };
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      public_id: publicId,
      resource_type: resourceType,
      type: "upload",
      flags: "attachment",
      timestamp: timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      params,
      config.api_secret
    );
    console.log("Generated signature:", signature);

    const downloadUrl = `https://res.cloudinary.com/${config.cloud_name}/${resourceType}/upload/fl_attachment/${publicId}?timestamp=${timestamp}&signature=${signature}&api_key=${config.api_key}`;

    console.log("Final URL:", downloadUrl);
    return { url: downloadUrl };
  } catch (error: any) {
    console.error("Detailed error generating signed URL:", {
      message: error.message,
      name: error.name,
      status: error.http_code,
      details: error.response?.data,
      cloudinaryId,
    });
    return {
      error: `Failed to generate download URL: ${
        error.message || "Unknown error"
      }`,
    };
  }
}
