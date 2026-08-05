"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { createClient } from "@/utils/supabase/server";

// 1. Upload Equipment
export async function uploadEquipment(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile || !name) {
      return { success: false, message: "Name and image are required." };
    }

    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
    const { error: storageError } = await supabase.storage
      .from("equipment")
      .upload(fileName, imageFile);

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage
      .from("equipment")
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("equipment").insert([
      {
        name,
        description,
        status: status || "available",
        image_url: publicUrlData.publicUrl,
      },
    ]);

    if (dbError) throw dbError;

    revalidatePath("/admin/dashboard");
    return { success: true, message: "Equipment uploaded successfully!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Upload failed." };
  }
}

// 2. Update Equipment Status
export async function updateEquipmentStatus(id: string, status: string) {
  try {
    const { error } = await supabase
      .from("equipment")
      .update({ status })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// NOTE: deleteEquipment is implemented below (uses server-side client and removes storage files).

// 4. Upload Reel
export async function uploadReel(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const videoFile = formData.get("video") as File;

    if (!videoFile || !title) {
      return { success: false, message: "Title and Video required." };
    }

    const fileName = `${Date.now()}-${videoFile.name.replace(/\s+/g, "_")}`;
    const { error: storageError } = await supabase.storage
      .from("gallery")
      .upload(fileName, videoFile);

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from("reels")
      .insert([{ title, video_url: publicUrlData.publicUrl }]);

    if (dbError) throw dbError;

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// 5. Upload Gallery Photo
export async function uploadGalleryPhoto(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const imageFile = formData.get("image") as File;

    if (!imageFile || !title) {
      return { success: false, message: "Title and Photo required." };
    }

    const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
    const { error: storageError } = await supabase.storage
      .from("gallery")
      .upload(fileName, imageFile);

    if (storageError) throw storageError;

    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from("gallery_photos")
      .insert([{ title, image_url: publicUrlData.publicUrl }]);

    if (dbError) throw dbError;

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// 6. Delete Gallery Media
export async function deleteGalleryMedia(id: string, type: "reel" | "photo") {
  try {
    const table = type === "reel" ? "reels" : "gallery_photos";
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
// Equipment Delete Action
export async function deleteEquipment(id: string, imageUrl?: string) {
  const supabaseServer = await createClient();

  if (imageUrl) {
    const path = imageUrl.split("/equipment/")[1];
    if (path) {
      await supabaseServer.storage.from("equipment").remove([path]);
    }
  }

  const { error } = await supabaseServer
    .from("equipment")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete equipment: ${error.message}`);
  }

  revalidatePath("/admin/dashboard");
}

// Equipment Update Action
export async function updateEquipment(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const price_per_day = parseFloat(formData.get("price_per_day") as string);
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("equipment")
    .update({
      name,
      category,
      price_per_day,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update equipment: ${error.message}`);
  }

  revalidatePath("/admin/dashboard");
}
