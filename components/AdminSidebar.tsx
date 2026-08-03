"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getAdminProfile,
  logoutAdmin,
  updateAdminProfile,
} from "@/app/actions/adminAuthActions";
import {
  User,
  LogOut,
  Upload,
  Disc3,
  Layers,
  Package,
  ImageIcon,
} from "lucide-react";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const p = await getAdminProfile();
      if (!p) {
        router.push("/admin/login");
      } else {
        setProfile(p);
      }
    }
    loadProfile();
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateAdminProfile(formData);
    setUpdating(false);

    if (res.success) {
      setEditing(false);
      const updated = await getAdminProfile();
      setProfile(updated);
    } else {
      alert(res.message);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/admin/login");
  };

  if (!profile) return null;

  return (
    <aside className="w-full lg:w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen p-6 flex flex-col justify-between shrink-0">
      <div>
        <div className="mb-8 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
          <h2 className="font-black text-sm uppercase tracking-wider text-white">
            Red Monkey <span className="text-red-500">Suite</span>
          </h2>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-900 border border-red-600/40 shrink-0">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-zinc-500 absolute inset-0 m-auto" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs text-white truncate">
                {profile.fullName}
              </h4>
              <p className="text-[10px] text-zinc-400 truncate">
                {profile.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setEditing(!editing)}
            className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-[10px] font-bold uppercase text-zinc-300 transition"
          >
            {editing ? "Close Profile Settings" : "Edit Profile Photo"}
          </button>

          {editing && (
            <form
              onSubmit={handleProfileUpdate}
              className="mt-3 space-y-2 border-t border-zinc-800 pt-3"
            >
              <input
                type="text"
                name="fullName"
                defaultValue={profile.fullName}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-[10px] text-white"
              />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="w-full text-[9px] text-zinc-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-zinc-800 file:text-white"
              />
              <button
                type="submit"
                disabled={updating}
                className="w-full py-1.5 bg-red-600 text-white font-bold text-[10px] uppercase rounded-lg flex items-center justify-center gap-1"
              >
                {updating ? (
                  <Disc3 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-3 h-3" /> Save Changes
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase transition flex items-center gap-3 ${activeTab === "bookings" ? "bg-red-600 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
          >
            <Layers className="w-4 h-4" /> Bookings
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase transition flex items-center gap-3 ${activeTab === "inventory" ? "bg-red-600 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
          >
            <Package className="w-4 h-4" /> Inventory
          </button>
          <button
            onClick={() => setActiveTab("media")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase transition flex items-center gap-3 ${activeTab === "media" ? "bg-red-600 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
          >
            <ImageIcon className="w-4 h-4" /> Media & Reels
          </button>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-3 bg-zinc-950 hover:bg-rose-950 text-rose-400 border border-zinc-800 rounded-xl text-xs font-extrabold uppercase transition flex items-center justify-center gap-2 mt-8"
      >
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </aside>
  );
}
