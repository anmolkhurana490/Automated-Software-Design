import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/projects" },
];

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/80 bg-slate-950/80 backdrop-blur-xl supports-backdrop-filter:bg-slate-950/70">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 text-sm font-black text-white shadow-lg shadow-cyan-900/40 transition group-hover:rotate-6">
            AS
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Advanced Agent</p>
            <p className="text-sm font-black text-slate-100">Software Architect Studio</p>
          </div>
        </Link>

        <ul className="flex items-center gap-2 sm:gap-3">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-300 transition hover:bg-cyan-500/20 hover:text-cyan-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
