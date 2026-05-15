"use client";

import { Bell, Search, User, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function TopBar() {
  const [usuario, setUsuario] = useState<{ nombre: string; rol: string } | null>(null);
  const [tema, setTema] = useState<"dark" | "light">("dark");
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("abogados").select("nombre, rol").eq("user_id", user.id).single();
      if (data) setUsuario(data);
    };
    getUser();

    const saved = localStorage.getItem("burgos-theme");
    if (saved === "light") {
      setTema("light");
      document.documentElement.classList.add("light-mode");
    }
  }, []);

  const toggleTema = () => {
    const next = tema === "dark" ? "light" : "dark";
    setTema(next);
    localStorage.setItem("burgos-theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  };

  return (
    <header className="h-14 border-b border-burgos-gray-800 bg-burgos-dark/80 backdrop-blur-lg flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Spacer for hamburger on mobile */}
      <div className="w-10 lg:hidden flex-shrink-0" />

      {/* Search - desktop only */}
      <div className="flex-1 max-w-md hidden lg:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600" />
          <input type="text" placeholder="Buscar expedientes, clientes..." className="w-full pl-9 pr-4 py-2 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button onClick={toggleTema} className="w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all" title={tema === "dark" ? "Modo claro" : "Modo oscuro"}>
          {tema === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button className="relative w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold transition-all">
          <Bell size={14} />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-burgos-gray-800">
          <div className="w-7 h-7 bg-burgos-dark-2 border border-burgos-gray-800 rounded-full flex items-center justify-center">
            <User size={12} className="text-burgos-gray-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] font-medium text-burgos-white leading-tight">{usuario?.nombre || "..."}</p>
            <p className="text-[9px] text-burgos-gray-600 capitalize">{usuario?.rol || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
