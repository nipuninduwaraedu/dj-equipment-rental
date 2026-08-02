import Link from 'next/link';
import { Disc3 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-zinc-950/90 backdrop-blur-md border-b border-red-900/40 text-white sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-wider">
        <div className="bg-red-600/20 p-2 rounded-xl border border-red-500/30">
          <Disc3 className="w-6 h-6 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <span>RED MONKEY <span className="text-red-500">ENTERTAINMENT</span></span>
      </Link>
      <div className="flex gap-6 text-sm font-semibold tracking-wide">
        <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>
        <Link href="/equipment" className="hover:text-red-500 transition-colors">Gear Catalog</Link>
        <Link href="/contact" className="hover:text-red-500 transition-colors">Contact</Link>
      </div>
    </nav>
  );
}