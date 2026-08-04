"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createBooking } from "@/app/actions/bookingActions";
import {
  Disc3,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  User,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const equipmentId = resolvedParams.id;

  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    clientName: "",
    phoneNumber: "",
    whatsappNumber: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    async function fetchGear() {
      const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .eq("id", equipmentId)
        .single();

      if (error) {
        console.error("Error fetching gear details:", error);
      } else {
        setEquipment(data);
      }
      setLoading(false);
    }
    fetchGear();
  }, [equipmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const res = await createBooking({
      equipmentId,
      equipmentName: equipment.name,
      clientName: formData.clientName,
      phoneNumber: formData.phoneNumber,
      whatsappNumber: formData.whatsappNumber,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });

    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMsg(
        res.message || "Failed to submit booking request. Please try again.",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-red-500 gap-3">
        <Disc3 className="w-10 h-10 animate-spin" />
        <p className="text-xs font-semibold text-zinc-400">
          Loading Equipment Specs...
        </p>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold">Equipment Resource Not Found</h2>
        <Link
          href="/equipment"
          className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase hover:bg-zinc-800 transition"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase text-zinc-400 hover:text-red-500 transition mb-8 bg-zinc-900/60 border border-zinc-800/80 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gear Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800/90 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 mb-6 group">
              <Image
                src={equipment.image_url}
                alt={equipment.name}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
              />
              <span
                className={`absolute top-4 right-4 text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider shadow-lg ${
                  equipment.status === "available"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-rose-950 text-rose-400 border border-rose-800"
                }`}
              >
                ● {equipment.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-3">
              {equipment.name}
            </h1>

            <div className="flex items-center gap-4 border-y border-zinc-800/80 py-3 my-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-red-500" /> Tested Pro Gear
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Instant Telegram
                Notification
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Specifications & Overview
              </h3>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed whitespace-pre-line bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/60">
                {equipment.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-zinc-900 border border-red-900/40 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-6">
              <h2 className="text-xl font-black uppercase tracking-wide text-white">
                Reserve Gear
              </h2>
              <p className="text-zinc-400 text-xs mt-1">
                Submit your dates for quick availability check.
              </p>
            </div>

            {success ? (
              <div className="text-center py-10 bg-zinc-950/80 rounded-2xl border border-emerald-900/50 p-6">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-white mb-2">
                  Request Dispatched!
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                  Red Monkey Entertainment team received your request for{" "}
                  <span className="text-white font-semibold">
                    {equipment.name}
                  </span>
                  . We will review and contact you via WhatsApp shortly.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      clientName: "",
                      phoneNumber: "",
                      whatsappNumber: "",
                      startDate: "",
                      endDate: "",
                    });
                  }}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold uppercase rounded-xl transition border border-zinc-700"
                >
                  Place Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-red-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="e.g. Kasun Perera"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-500" /> Phone No.
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="0771234567"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />{" "}
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          whatsappNumber: e.target.value,
                        })
                      }
                      placeholder="0771234567"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-500" /> Event
                      Start
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-500" /> Event
                      End
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || equipment.status !== "available"}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-extrabold uppercase tracking-wider rounded-xl transition shadow-lg shadow-red-600/20 mt-2 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Disc3 className="w-4 h-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : equipment.status !== "available" ? (
                    "Gear Currently Unavailable"
                  ) : (
                    "Confirm Booking Request"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
