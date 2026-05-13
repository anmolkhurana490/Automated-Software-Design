"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { useAuthViewModel } from "../../viewmodel/AuthViewModel";
import { useRouter } from "next/navigation";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuthViewModel();

  const onLogout = () => {
    logout();
    onClose();
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={modalRef}
        className="absolute top-16 right-4 sm:right-8 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-cyan-500/10 to-orange-500/10 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-4">
            <img
              src={user.image || "/default-user.png"}
              alt={user.name}
              onError={(e) => { (e.target as HTMLImageElement).src = "/default-user.png"; }}
              className="w-12 h-12 rounded-full border border-cyan-400/50"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <button className="w-full px-6 py-3 text-left text-sm font-semibold text-slate-200 hover:bg-slate-800/50 transition flex items-center gap-3">
            <Settings size={18} />
            Account Settings
          </button>

          <button
            onClick={onLogout}
            className="w-full px-6 py-3 text-left text-sm font-semibold text-red-400 hover:bg-slate-800/50 transition flex items-center gap-3"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
