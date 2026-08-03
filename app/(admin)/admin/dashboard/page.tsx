"use client";
import {
  uploadEquipment,
  updateEquipmentStatus,
  deleteEquipment,
  uploadReel,
  uploadGalleryPhoto,
  deleteGalleryMedia,
} from "@/app/actions/adminActions";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/AdminSidebar";
import {
  getBookings,
  updateBookingStatus,
  deleteBooking,
} from "@/app/actions/bookingActions";
import {
  Disc3,
  Trash2,
  Plus,
  MessageSquare,
  Image as ImageIcon,
  Film,
  Package,
  Layers,
  XCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "bookings" | "inventory" | "media"
  >("bookings");

  const [bookings, setBookings] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [uploadingEq, setUploadingEq] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    const [bRes, eqRes, rRes, pRes] = await Promise.all([
      getBookings(),
      supabase
        .from("equipment")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("reels")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    setBookings(bRes.data || []);
    setEquipmentList(eqRes.data || []);
    setReels(rRes.data || []);
    setPhotos(pRes.data || []);
    setLoading(false);
  }

  const handleBookingAction = async (
    booking: any,
    status: "APPROVED" | "REJECTED",
  ) => {
    const res = await updateBookingStatus(
      booking.id,
      booking.equipment_id,
      status,
    );
    if (res.success) {
      if (status === "APPROVED") {
        const cleanPhone = booking.whatsapp_number.replace(/^0/, "94");
        const waText = encodeURIComponent(
          `Hi ${booking.client_name}! Your booking request for ${booking.equipment?.name || "Gear"} (${booking.start_date} to ${booking.end_date}) has been APPROVED by Red Monkey Entertainment. Let's discuss details!`,
        );
        window.open(`https://wa.me/${cleanPhone}?text=${waText}`, "_blank");
      }
      loadDashboardData();
    }
  };

  const handleEquipmentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadingEq(true);
    const formData = new FormData(e.currentTarget);
    const res = await uploadEquipment(formData);
    setUploadingEq(false);
    if (res.success) {
      (e.target as HTMLFormElement).reset();
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  const handleMediaSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    type: "reel" | "photo",
  ) => {
    e.preventDefault();
    setUploadingMedia(true);
    const formData = new FormData(e.currentTarget);
    const res =
      type === "reel"
        ? await uploadReel(formData)
        : await uploadGalleryPhoto(formData);
    setUploadingMedia(false);
    if (res.success) {
      (e.target as HTMLFormElement).reset();
      loadDashboardData();
    } else {
      alert(res.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-red-500 gap-3">
        <Disc3 className="w-10 h-10 animate-spin" />
        <p className="text-xs font-semibold text-zinc-400">
          Loading Control Suite...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-950 text-white">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 lg:p-10 max-w-7xl">
        {activeTab === "bookings" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-5 h-5 text-red-500" /> Live Booking
                  Requests
                </h2>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Approve bookings to launch instant WhatsApp chats and
                  auto-lock gear availability.
                </p>
              </div>
              <span className="bg-red-950 border border-red-800 text-red-400 font-extrabold text-xs px-3 py-1 rounded-full">
                {bookings.length} Total Requests
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="p-4">Gear Requested</th>
                    <th className="p-4">Client Info</th>
                    <th className="p-4">Rental Dates</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/30 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        {b.equipment?.image_url && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-zinc-950 border border-zinc-800">
                            <Image
                              src={b.equipment.image_url}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span>{b.equipment?.name || "Equipment Deleted"}</span>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">
                          {b.client_name}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Phone: {b.phone_number}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-mono">
                          WA: {b.whatsapp_number}
                        </div>
                      </td>
                      <td className="p-4 text-zinc-300 font-mono">
                        {b.start_date} <br /> ➔ {b.end_date}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            b.status === "APPROVED"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : b.status === "REJECTED"
                                ? "bg-rose-950 text-rose-400 border border-rose-800"
                                : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleBookingAction(b, "APPROVED")}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase rounded-lg transition flex items-center gap-1 shadow-md shadow-emerald-600/20"
                            title="Approve & Open WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" /> Approve & Chat
                          </button>
                          <button
                            onClick={() => handleBookingAction(b, "REJECTED")}
                            className="p-1.5 bg-zinc-800 hover:bg-rose-950 text-rose-400 rounded-lg transition border border-zinc-700"
                            title="Reject Request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm("Delete this booking record?")) {
                                await deleteBooking(b.id);
                                loadDashboardData();
                              }
                            }}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl h-fit">
              <h3 className="font-extrabold uppercase text-sm mb-4 text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" /> Add Gear to Inventory
              </h3>
              <form onSubmit={handleEquipmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                    Equipment Title
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Pioneer DDJ-FLX6"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Technical specifications..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                    Availability Status
                  </label>
                  <select
                    name="status"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                    Upload Gear Photo
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    required
                    className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploadingEq}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  {uploadingEq ? (
                    <Disc3 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Upload Equipment"
                  )}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="font-extrabold uppercase text-sm mb-4 text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-red-500" /> Equipment Catalog (
                {equipmentList.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex gap-3 items-center justify-between"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-900">
                      <Image
                        src={item.image_url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">
                        {item.name}
                      </h4>
                      <select
                        value={item.status}
                        onChange={async (e) => {
                          await updateEquipmentStatus(item.id, e.target.value);
                          loadDashboardData();
                        }}
                        className="mt-1 bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold text-zinc-300 rounded-md px-2 py-1"
                      >
                        <option value="available">Available</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm("Delete equipment?")) {
                          await deleteEquipment(item.id);
                          loadDashboardData();
                        }
                      }}
                      className="p-2 text-zinc-500 hover:text-rose-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "media" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="font-extrabold uppercase text-sm mb-4 text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" /> Upload Stage Reel
                (MP4)
              </h3>
              <form
                onSubmit={(e) => handleMediaSubmit(e, "reel")}
                className="space-y-4 mb-6"
              >
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Reel Caption Title..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <input
                  type="file"
                  name="video"
                  accept="video/mp4,video/*"
                  required
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white"
                />
                <button
                  type="submit"
                  disabled={uploadingMedia}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  {uploadingMedia ? (
                    <Disc3 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Upload Video Reel"
                  )}
                </button>
              </form>

              <div className="space-y-2">
                {reels.map((r) => (
                  <div
                    key={r.id}
                    className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold truncate text-zinc-300">
                      {r.title}
                    </span>
                    <button
                      onClick={async () => {
                        await deleteGalleryMedia(r.id, "reel");
                        loadDashboardData();
                      }}
                      className="text-zinc-500 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="font-extrabold uppercase text-sm mb-4 text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-500" /> Upload Event
                Photo
              </h3>
              <form
                onSubmit={(e) => handleMediaSubmit(e, "photo")}
                className="space-y-4 mb-6"
              >
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Photo Event Caption..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white"
                />
                <button
                  type="submit"
                  disabled={uploadingMedia}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  {uploadingMedia ? (
                    <Disc3 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Upload Photo"
                  )}
                </button>
              </form>

              <div className="space-y-2">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold truncate text-zinc-300">
                      {p.title}
                    </span>
                    <button
                      onClick={async () => {
                        await deleteGalleryMedia(p.id, "photo");
                        loadDashboardData();
                      }}
                      className="text-zinc-500 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
