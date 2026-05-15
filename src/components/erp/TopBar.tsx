"use client";

import { Bell, Search, User } from "lucide-react";

export function TopBar() {
  return (
    <header className="h-16 border-b border-burgos-gray-800 bg-burgos-dark/80 backdrop-blur-lg flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-burgos-gray-600"
          />
          <input
            type="text"
            placeholder="Buscar expedientes, clientes..."
            className="w-full pl-9 pr-4 py-2 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <button className="relative w-9 h-9 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl flex items-center justify-center text-burgos-gray-400 hover:text-burgos-gold hover:border-burgos-gold/30 transition-all">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-burgos-gold text-burgos-black text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-burgos-gray-800">
          <div className="w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 rounded-full flex items-center justify-center">
            <User size={14} className="text-burgos-gray-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-burgos-white">Dr. Burgos</p>
            <p className="text-[10px] text-burgos-gray-600">Director</p>
          </div>
        </div>
      </div>
    </header>
  );
}
