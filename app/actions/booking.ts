"use server";

import { supabase } from "@/lib/supabase";

export async function submitBooking(formData: {
  equipmentId: string;
  equipmentName: string;
  clientName: string;
  phoneNumber: string;
  whatsappNumber: string;
  startDate: string;
  endDate: string;
}) {
  // 1. Save Booking to Supabase Database
  const { error } = await supabase.from("bookings").insert([
    {
      equipment_id: formData.equipmentId,
      client_name: formData.clientName,
      phone_number: formData.phoneNumber,
      whatsapp_number: formData.whatsappNumber,
      start_date: formData.startDate,
      end_date: formData.endDate,
      status: "PENDING",
    },
  ]);

  if (error) {
    console.error("Supabase Booking Error:", error);
    return { success: false, message: "Failed to record booking." };
  }

  // 2. Instant Telegram Bot Alert
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (botToken && chatId) {
    const text =
      ` *NEW EQUIPMENT BOOKING REQUEST!* 🎧\n\n` +
      ` *Gear:* ${formData.equipmentName}\n` +
      ` *Client:* ${formData.clientName}\n` +
      ` *Phone:* ${formData.phoneNumber}\n` +
      ` *WhatsApp:* ${formData.whatsappNumber}\n` +
      ` *Dates:* ${formData.startDate} to ${formData.endDate}\n\n` +
      ` Log in to Admin Dashboard to Approve/Reject.`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
      });
    } catch (err) {
      console.error("Telegram push notification failed:", err);
    }
  }

  return { success: true };
}
