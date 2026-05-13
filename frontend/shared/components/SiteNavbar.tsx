"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ProfileModal } from "@/features/auth/views/components/ProfileModal";
import { useAuthViewModel } from "@/features/auth/viewmodel/AuthViewModel";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/projects" },
];

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, fetchSession } = useAuthViewModel();

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/80 bg-slate-950/80 backdrop-blur-xl supports-backdrop-filter:bg-slate-950/70">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-8 lg:px-12">
        <Link href="/" className="group flex min-w-0 items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src="/archflow-logo.png" alt="ArchFlow Logo" className="h-9 rounded-full group-hover:animate-spin-slow" />

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 sm:text-xs">ArchFlow</p>
            <p className="truncate text-sm font-black bg-linear-to-r from-slate-100 to-cyan-200 bg-clip-text text-transparent sm:text-base">Design Studio</p>
          </div>
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-700 p-2 text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200 sm:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <ul className="hidden items-center gap-2 sm:flex sm:gap-3">
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

          {/* Auth Section */}
          {user ? (
            <li className="relative ml-4 pl-4 border-l border-slate-700">
              <button
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-800/50 transition"
              >
                <img
                  src={user.image || "/default-user.png"}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-cyan-400/50"
                />
                <span className="text-xs font-semibold text-slate-200 hidden lg:inline">{user.name}</span>
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/auth/login"
                  className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-300 transition hover:bg-cyan-500/20 hover:text-cyan-200"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] bg-cyan-500 text-white transition hover:bg-cyan-600"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-3 sm:hidden">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Go</span>
                </Link>
              </li>
            ))}

            {/* Mobile Auth */}
            <li className="border-t border-slate-700 pt-2 mt-2">
              {user ? (
                <button
                  onClick={() => {
                    setProfileOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
                >
                  <img
                    src={user.image || "/default-user.png"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-cyan-400/50"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-xs text-slate-400">Welcome</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href="/auth/login"
                    className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex-1 rounded-xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-cyan-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* Profile Modal */}
      {user && (
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </header>
  );
}
