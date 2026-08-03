"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Film, Image as ImageIcon, Disc3 } from "lucide-react";

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState<"all" | "reels" | "photos">("all");
  const [reels, setReels] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const [reelsRes, photosRes] = await Promise.all([
        supabase
          .from("reels")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("gallery_photos")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      setReels(reelsRes.data || []);
      setPhotos(photosRes.data || []);
      setLoading(false);
    }
    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-red-500 flex justify-center items-center">
        <Disc3 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-16 bg-zinc-950 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
          Live Stage & <span className="text-red-500">Event Highlights</span>
        </h2>
        <p className="text-zinc-400 text-xs mt-2">
          Explore photos and stage reels from our recent gigs.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${activeTab === "all" ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            All Media
          </button>
          <button
            onClick={() => setActiveTab("reels")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition ${activeTab === "reels" ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            <Film className="w-3.5 h-3.5" /> Stage Reels ({reels.length})
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition ${activeTab === "photos" ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Event Photos ({photos.length})
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {(activeTab === "all" || activeTab === "reels") &&
          reels.map((reel) => (
            <div
              key={reel.id}
              className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-zinc-900 border border-red-900/30 group shadow-lg"
            >
              <video
                src={reel.video_url}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                <Film className="w-2.5 h-2.5" /> Reel
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent text-white font-bold text-xs uppercase">
                {reel.title}
              </div>
            </div>
          ))}

        {(activeTab === "all" || activeTab === "photos") &&
          photos.map((photo) => (
            <div
              key={photo.id}
              className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-zinc-900 border border-zinc-800 group shadow-lg"
            >
              <Image
                src={photo.image_url}
                alt={photo.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 left-2 bg-zinc-800 text-zinc-300 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-2.5 h-2.5" /> Photo
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/60 to-transparent text-white font-bold text-xs uppercase">
                {photo.title}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
