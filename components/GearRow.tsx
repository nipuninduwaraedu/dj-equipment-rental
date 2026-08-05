"use client";

import { useState } from "react";
import { deleteEquipment } from "@/app/actions/adminActions";
import EditGearModal from "@/components/EditGearModal";

export default function GearRow({ item }: { item: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteEquipment(item.id, item.image_url);
      } catch (err) {
        alert("Failed to delete item");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <tr className="border-b border-zinc-800 hover:bg-zinc-900/50">
        <td className="p-4 font-medium">{item.name}</td>
        <td className="p-4 text-zinc-400">{item.category}</td>
        <td className="p-4">LKR {item.price_per_day}</td>
        <td className="p-4">
          <span
            className={`px-2.5 py-1 text-xs rounded-full font-medium ${
              item.status === "Available"
                ? "bg-emerald-500/10 text-emerald-500"
                : item.status === "Rented Out"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-rose-500/10 text-rose-500"
            }`}
          >
            {item.status}
          </span>
        </td>
        <td className="p-4 flex gap-2">
          <button
            onClick={() => setIsEditOpen(true)}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs rounded transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-1 bg-red-950/50 hover:bg-red-900 text-red-400 text-xs rounded transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </td>
      </tr>

      {/* Edit Modal Popup */}
      {isEditOpen && (
        <EditGearModal gear={item} onClose={() => setIsEditOpen(false)} />
      )}
    </>
  );
}
