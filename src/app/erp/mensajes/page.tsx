"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, User, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Mensaje {
  id: string;
  remitente_tipo: string;
  remitente_id: string;
  cuerpo: string;
  creado_en: string;
}

interface Cliente {
  id: string;
  nombre: string;
  dni: string;
}

export default function MensajesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [abogadoId, setAbogadoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: abogado } = await supabase.from("abogados").select("id").eq("user_id", user.id).single();
      if (abogado) setAbogadoId(abogado.id);

      const { data: clientesData } = await supabase.from("clientes").select("id, nombre, dni").eq("activo", true).order("nombre");
      if (clientesData) setClientes(clientesData);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedCliente) return;
    const fetchMensajes = async () => {
      const { data } = await supabase.from("mensajes").select("*").or(`remitente_id.eq.${selectedCliente.id},remitente_id.eq.${abogadoId}`).order("creado_en", { ascending: true });
      if (data) setMensajes(data);
    };
    fetchMensajes();

    // Polling cada 5 segundos para simular realtime
    const interval = setInterval(fetchMensajes, 5000);
    return () => clearInterval(interval);
  }, [selectedCliente, abogadoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !abogadoId || !selectedCliente) return;

    await supabase.from("mensajes").insert({
      remitente_tipo: "abogado",
      remitente_id: abogadoId,
      cuerpo: input.trim(),
    });

    setInput("");
    // Refresh
    const { data } = await supabase.from("mensajes").select("*").or(`remitente_id.eq.${selectedCliente.id},remitente_id.eq.${abogadoId}`).order("creado_en", { ascending: true });
    if (data) setMensajes(data);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-burgos-gold/30 border-t-burgos-gold rounded-full animate-spin" /></div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
          <MessageSquare size={24} className="text-burgos-gold" />
          Mensajes
        </h1>
        <p className="text-burgos-gray-400 text-sm mt-1">Comunicación con clientes</p>
      </motion.div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Lista de clientes */}
        <div className="w-64 flex-shrink-0 bg-burgos-dark rounded-2xl border border-burgos-gray-800 overflow-y-auto">
          <div className="p-3 border-b border-burgos-gray-800">
            <p className="text-[10px] uppercase tracking-wider text-burgos-gray-600 font-medium">Clientes ({clientes.length})</p>
          </div>
          {clientes.length === 0 ? (
            <p className="text-burgos-gray-600 text-xs text-center py-8">Sin clientes</p>
          ) : (
            <div className="p-2 space-y-1">
              {clientes.map((c) => (
                <button key={c.id} onClick={() => setSelectedCliente(c)} className={`w-full text-left p-3 rounded-xl transition-all ${selectedCliente?.id === c.id ? "bg-burgos-gold/10 border border-burgos-gold/20" : "hover:bg-burgos-dark-2 border border-transparent"}`}>
                  <p className="text-sm text-burgos-white font-medium">{c.nombre}</p>
                  <p className="text-[10px] text-burgos-gray-600">DNI: {c.dni}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 bg-burgos-dark rounded-2xl border border-burgos-gray-800 flex flex-col overflow-hidden">
          {!selectedCliente ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Users size={40} className="text-burgos-gray-800 mx-auto mb-3" />
                <p className="text-burgos-gray-600 text-sm">Seleccioná un cliente para ver la conversación</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-burgos-gray-800 flex-shrink-0">
                <p className="text-sm font-semibold text-burgos-white">{selectedCliente.nombre}</p>
                <p className="text-[10px] text-burgos-gray-600">DNI: {selectedCliente.dni}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {mensajes.length === 0 && (
                  <p className="text-burgos-gray-600 text-sm text-center py-8">Sin mensajes. Iniciá la conversación.</p>
                )}
                {mensajes.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.remitente_tipo === "abogado" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${msg.remitente_tipo === "abogado" ? "bg-burgos-gold text-burgos-black rounded-br-md" : "bg-burgos-dark-2 border border-burgos-gray-800 text-burgos-gray-200 rounded-bl-md"}`}>
                      {msg.cuerpo}
                      <p className={`text-[9px] mt-1 ${msg.remitente_tipo === "abogado" ? "text-burgos-black/50" : "text-burgos-gray-600"}`}>
                        {new Date(msg.creado_en).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 border-t border-burgos-gray-800 flex-shrink-0">
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribí un mensaje..." className="flex-1 px-4 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30" />
                  <button type="submit" disabled={!input.trim()} className="w-10 h-10 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gray-800 rounded-xl flex items-center justify-center transition-colors">
                    <Send size={14} className="text-burgos-black" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
