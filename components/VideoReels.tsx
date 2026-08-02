import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function VideoReels() {
  const { data: reels } = await supabase
    .from("reels")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (!reels || reels.length === 0) return null;

  return (
    <section className="py-16 bg-zinc-950 px-6 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
          Live Stage & <span className="text-red-500">Events in Action</span>
        </h2>
        <p className="text-zinc-400 text-sm mt-2">
          Check out our latest setups powering high-energy gigs.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-zinc-900 border border-red-900/30 shadow-lg group"
          >
            <video
              src={reel.video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent text-white font-bold text-xs uppercase tracking-wide">
              {reel.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
