"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Search, Filter, Disc3 } from "lucide-react";

export default function EquipmentCatalogPage() {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilteredGear() {
      setLoading(true);
      let query = supabase
        .from("equipment")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (searchQuery.trim() !== "") {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data } = await query;
      setEquipmentList(data || []);
      setLoading(false);
    }

    const timer = setTimeout(() => fetchFilteredGear(), 300); // Debounce
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  return (
    <div className="bg-zinc-950 text-white min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-2">
            Pro Audio & <span className="text-red-500">DJ Gear Catalog</span>
          </h1>
          <p className="text-zinc-400 text-xs">
            Search and check live availability directly from our warehouse
            database.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search gear name (e.g. Pioneer, Subwoofer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 w-full md:w-auto"
            >
              <option value="all">All Gear Status</option>
              <option value="available">Available Only</option>
              <option value="maintenance">In Maintenance</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-red-500 flex justify-center">
            <Disc3 className="w-10 h-10 animate-spin" />
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="p-16 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 text-xs">
            No equipment matching your backend filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {equipmentList.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-red-900/50 transition duration-300 flex flex-col"
              >
                <div className="relative aspect-video bg-zinc-950">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider ${
                      item.status === "available"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-rose-950 text-rose-400 border border-rose-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-3 mb-6">
                      {item.description}
                    </p>
                  </div>
                  <Link
                    href={`/equipment/${item.id}`}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition text-center shadow-md shadow-red-600/10"
                  >
                    Request Booking
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
