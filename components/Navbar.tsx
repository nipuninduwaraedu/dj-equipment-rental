import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-zinc-950/90 backdrop-blur-md border-b border-red-900/40 text-white sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <Link
        href="/"
        className="flex items-center gap-3 text-xl font-extrabold tracking-wider"
      >
        <div className="relative w-10 h-10 rounded-full border border-red-500/40 p-0.5 overflow-hidden">
          <Image
            src="/logo.png"
            alt="Red Monkey Entertainment Logo"
            width={40}
            height={40}
            className="w-full h-full rounded-full object-cover animate-spin"
            style={{ animationDuration: "10s" }}
          />
        </div>
        <span>
          RED MONKEY <span className="text-red-500">ENTERTAINMENT</span>
        </span>
      </Link>
      <div className="flex gap-6 text-sm font-semibold tracking-wide">
        <Link href="/" className="hover:text-red-500 transition-colors">
          Home
        </Link>
        <Link
          href="/equipment"
          className="hover:text-red-500 transition-colors"
        >
          Gear Catalog
        </Link>
        <Link href="/contact" className="hover:text-red-500 transition-colors">
          Contact
        </Link>
      </div>
    </nav>
  );
}
