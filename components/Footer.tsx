export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-500 border-t border-zinc-900 py-8 text-center text-xs tracking-wider uppercase">
      <p>
        © {new Date().getFullYear()} Red Monkey Entertainment. Sound, Lights &
        Production Gear.
      </p>
    </footer>
  );
}
