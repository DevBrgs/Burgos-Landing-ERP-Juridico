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
      const { data } = await supabase
        .from("abogados")
        .select("nombre, rol")
        .eq("user_id", user.id)
        .single();
      if (data) setUsuario(data);
    };
    getUser();

    // Cargar tema guardado
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
    <header className="h-16 border-b border-burgos-gray-800 bg-burgos-dark/80 backdrop-blur-lg flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600" />
          <input
            type="text"
            placeholder="Buscar expedientes, clientes..."
            className="w-full pl-9 pr-4 py-2 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTema}
          className="w-9 h-9 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold hover:border-burgos-gold/30 transition-all"
          title={tema === "dark" ? "Modo claro" : "Modo oscuro"}
        >
          {tema === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold hover:border-burgos-gold/30 transition-all">
          <Bell size={16} />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-burgos-gray-800">
          <div className="w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 rounded-full flex items-center justify-center">
            <User size={14} className="text-burgos-gray-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-burgos-white">
              {usuario?.nombre || "Cargando..."}
            </p>
            <p className="text-[10px] text-burgos-gray-600 capitalize">
              {usuario?.rol || ""}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
