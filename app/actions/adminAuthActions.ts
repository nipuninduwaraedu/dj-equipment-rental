"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

const supabaseServer = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
        setAll: async (cookiesToSet, _headers) => {
          const requestCookies = await cookies();
          cookiesToSet.forEach(({ name, value, options }) =>
            requestCookies.set(name, value, options),
          );
        },
      },
    },
  );

export async function registerAdmin(formData: FormData) {
  const supabase = supabaseServer();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    return { success: false, message: "All fields are required." };
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message || "Registration failed.",
    };
  }

  const { error: profileError } = await supabase.from("admin_profiles").insert([
    {
      id: authData.user.id,
      full_name: fullName,
      avatar_url: "",
    },
  ]);

  if (profileError) {
    console.error("Profile creation error:", profileError);
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function loginAdmin(formData: FormData) {
  const supabase = supabaseServer();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/", "layout");

  return { success: true, user: data.user };
}

export async function logoutAdmin() {
  const supabase = supabaseServer();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getAdminProfile() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    email: user.email,
    fullName: profile?.full_name || "Admin",
    avatarUrl: profile?.avatar_url || "",
    id: user.id,
  };
}

export async function updateAdminProfile(formData: FormData) {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Not authenticated" };

  const fullName = formData.get("fullName") as string;
  const file = formData.get("avatar") as File;

  let avatarUrl = "";

  if (file && file.size > 0) {
    const fileExt = file.name.split(".").pop();
    const fileName = `avatar_${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("equipment-images")
      .upload(filePath, buffer, { contentType: file.type, upsert: true });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("equipment-images")
        .getPublicUrl(filePath);
      avatarUrl = publicUrlData.publicUrl;
    }
  }

  const updatePayload: Record<string, any> = { full_name: fullName };
  if (avatarUrl) updatePayload.avatar_url = avatarUrl;

  const { error } = await supabase
    .from("admin_profiles")
    .update(updatePayload)
    .eq("id", user.id);

  if (error) return { success: false, message: error.message };

  revalidatePath("/admin/dashboard");
  return { success: true, avatarUrl };
}
