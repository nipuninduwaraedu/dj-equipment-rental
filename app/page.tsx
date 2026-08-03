import Link from "next/link";
import GallerySection from "@/components/GallerySection";
import { ArrowRight, Flame, ShieldCheck, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      <section className="relative py-28 px-6 text-center border-b border-zinc-900 bg-gradient-to-b from-red-950/20 via-zinc-950 to-zinc-950">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/50 text-red-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            High Energy Sound & Stage Setup
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-tight mb-6">
            Powering Unforgettable <br />
            <span className="text-red-500">Events & Gigs</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-8 font-light">
            Rent industrial-grade DJ consoles, line-array sound systems, and
            stage lighting directly from{" "}
            <span className="text-zinc-200 font-medium">
              Red Monkey Entertainment
            </span>
            .
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/equipment"
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase tracking-wider rounded-xl transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
            >
              Browse Gear Catalog <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold uppercase tracking-wider rounded-xl transition"
            >
              Direct Contact
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-zinc-900/40 border-b border-zinc-900 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80">
            <Zap className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">Instant Telegram Alerts</h3>
            <p className="text-zinc-400 text-xs">
              Bookings are dispatched instantly to our crew for immediate
              availability checks.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80">
            <ShieldCheck className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">Pro-Grade Equipment</h3>
            <p className="text-zinc-400 text-xs">
              Pioneer DJ decks, RCF/JBL sound rigs, and automated stage wash
              lights.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80">
            <Flame className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-lg mb-1">Islandwide Stage Support</h3>
            <p className="text-zinc-400 text-xs">
              Full technical setup crew available for sound routing and visual
              effects.
            </p>
          </div>
        </div>
      </section>

      <GallerySection />
    </div>
  );
}
