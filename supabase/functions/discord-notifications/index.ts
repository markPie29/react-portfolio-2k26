import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const DISCORD_WEBHOOK_URL = Deno.env.get("DISCORD_WEBHOOK_URL");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (_req) => {
  if (!DISCORD_WEBHOOK_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ error: "Missing environment variables on Edge Function" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

  let unconfirmedSent = 0;
  let upcomingSent = 0;

  try {
    // -------------------------------------------------------------------------
    // JOB 1: Hourly Reminder for Unconfirmed Inquiries (status = 'new')
    // Sent if created > 1 hour ago AND (last_reminder_sent_at is null OR < 1 hour ago)
    // -------------------------------------------------------------------------
    const { data: pendingInquiries, error: inqError } = await supabase
      .from("inquiries")
      .select("*")
      .eq("status", "new")
      .lt("created_at", oneHourAgo);

    if (inqError) {
      console.error("Error querying pending inquiries:", inqError);
    } else if (pendingInquiries && pendingInquiries.length > 0) {
      for (const inq of pendingInquiries) {
        // Check if reminder was sent within the last hour
        if (inq.last_reminder_sent_at) {
          const lastSentTime = new Date(inq.last_reminder_sent_at).getTime();
          if (now.getTime() - lastSentTime < 60 * 60 * 1000) {
            continue; // Skip if sent less than 1 hr ago
          }
        }

        const createdAtStr = new Date(inq.created_at).toLocaleString("en-US", {
          timeZone: "Asia/Manila",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });

        const discordPayload = {
          embeds: [
            {
              title: "⏰ Reminder: Unconfirmed Project Inquiry!",
              color: 16753920, // Orange (#FF9800)
              description: `You have an unconfirmed inquiry from **${inq.full_name}** that has been waiting for review.`,
              fields: [
                { name: "Client Name", value: inq.full_name, inline: true },
                { name: "Email", value: inq.email, inline: true },
                { name: "Project Type", value: inq.project_type, inline: true },
                { name: "Submitted At", value: createdAtStr, inline: true },
                { name: "Description", value: String(inq.description).substring(0, 500), inline: false },
              ],
              footer: { text: "Action Needed: Please log into the Admin Dashboard to review & confirm." },
              timestamp: now.toISOString(),
            },
          ],
        };

        const res = await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(discordPayload),
        });

        if (res.ok) {
          unconfirmedSent++;
          await supabase
            .from("inquiries")
            .update({ last_reminder_sent_at: now.toISOString() })
            .eq("id", inq.id);
        }
      }
    }

    // -------------------------------------------------------------------------
    // JOB 2: 1-Hour Pre-Call Alert for Confirmed Discovery Calls
    // Checks bookings where status = 'confirmed', booked_date = TODAY,
    // and booked_time falls within the upcoming 15 to 75 minutes.
    // -------------------------------------------------------------------------
    const todayStr = now.toISOString().split("T")[0];

    const { data: confirmedBookings, error: bookError } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "confirmed")
      .eq("booked_date", todayStr)
      .is("last_upcoming_alert_at", null);

    if (bookError) {
      console.error("Error querying confirmed bookings:", bookError);
    } else if (confirmedBookings && confirmedBookings.length > 0) {
      for (const b of confirmedBookings) {
        if (!b.booked_time) continue;
        
        // Parse booking time (HH:mm) into Date object for comparison
        const [h, m] = b.booked_time.split(":").map(Number);
        const callTime = new Date(now);
        callTime.setHours(h, m, 0, 0);

        const diffMinutes = (callTime.getTime() - now.getTime()) / (1000 * 60);

        // Notify if call is happening in 15 to 75 minutes
        if (diffMinutes >= 15 && diffMinutes <= 75) {
          const discordPayload = {
            embeds: [
              {
                title: "📞 Upcoming Discovery Call in ~1 Hour!",
                color: 3066993, // Green (#2ECC71)
                description: `You have a confirmed client meeting starting soon with **${b.client_name}**.`,
                fields: [
                  { name: "Client Name", value: b.client_name, inline: true },
                  { name: "Email", value: b.client_email, inline: true },
                  { name: "Scheduled Time", value: `${b.booked_date} at ${b.booked_time}`, inline: true },
                  { name: "Meeting Link", value: b.meeting_link || "No meeting link set", inline: false },
                ],
                footer: { text: "Portfolio Admin Notification" },
                timestamp: now.toISOString(),
              },
            ],
          };

          const res = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordPayload),
          });

          if (res.ok) {
            upcomingSent++;
            await supabase
              .from("bookings")
              .update({ last_upcoming_alert_at: now.toISOString() })
              .eq("id", b.id);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        unconfirmedRemindersSent: unconfirmedSent,
        upcomingCallAlertsSent: upcomingSent,
        timestamp: now.toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
