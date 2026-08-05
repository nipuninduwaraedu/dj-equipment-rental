"use client";

import { useState } from "react";
import { updateEquipment } from "@/app/actions/adminActions";

interface Equipment {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  status: "available" | "rented out" | "maintenance" | string;
}

export default function EditGearModal({
  gear,
  onClose,
}: {
  gear: Equipment;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const defaultStatus = gear.status?.toLowerCase();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await updateEquipment(gear.id, formData);
      onClose();
    } catch (err) {
      alert("Error updating item!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md text-white shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-red-500">
          Edit Gear - {gear.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Equipment Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={gear.name}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              defaultValue={gear.category}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Price Per Day (LKR)
            </label>
            <input
              type="number"
              name="price_per_day"
              defaultValue={gear.price_per_day}
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Availability Status
            </label>
            <select
              name="status"
              defaultValue={defaultStatus}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500"
            >
              <option value="available">Available</option>
              <option value="rented out">Rented Out</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
