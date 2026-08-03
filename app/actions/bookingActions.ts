"use server";

import { supabase } from "@/lib/supabase";

export async function createBooking(data: {
  equipmentId: string;
  equipmentName: string;
  clientName: string;
  phoneNumber: string;
  whatsappNumber: string;
  startDate: string;
  endDate: string;
}) {
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert([
      {
        equipment_id: data.equipmentId,
        client_name: data.clientName,
        phone_number: data.phoneNumber,
        whatsapp_number: data.whatsappNumber,
        start_date: data.startDate,
        end_date: data.endDate,
        status: "PENDING",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error);
    return { success: false, message: error.message };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (botToken && chatId) {
    const cleanPhone = data.whatsappNumber.replace(/^0/, "94");
    const waText = encodeURIComponent(
      `Hi ${data.clientName}, regarding your booking request for ${data.equipmentName} (${data.startDate} to ${data.endDate}) at Red Monkey Entertainment...`,
    );
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    const telegramText =
      ` *RED MONKEY ENTERTAINMENT*\n` +
      ` *NEW GEAR BOOKING REQUEST!*\n\n` +
      ` *Gear:* ${data.equipmentName}\n` +
      ` *Client:* ${data.clientName}\n` +
      ` *Phone:* ${data.phoneNumber}\n` +
      ` *WhatsApp:* ${data.whatsappNumber}\n` +
      ` *Dates:* ${data.startDate} to ${data.endDate}\n\n` +
      ` Click below to start WhatsApp conversation with client directly.`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "💬 Direct WhatsApp Client", url: waLink }],
            ],
          },
        }),
      });
    } catch (err) {
      console.error("Telegram API Dispatch Error:", err);
    }
  }

  return { success: true, booking };
}

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, equipment(name, image_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, data: [] };
  }

  return { success: true, data };
}

export async function updateBookingStatus(
  bookingId: string,
  equipmentId: string,
  status: "APPROVED" | "REJECTED",
) {
  const { error: bookingErr } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (bookingErr) {
    return { success: false, message: bookingErr.message };
  }

  if (status === "APPROVED") {
    await supabase
      .from("equipment")
      .update({ status: "maintenance" })
      .eq("id", equipmentId);
  }

  return { success: true };
}

export async function deleteBooking(bookingId: string) {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
