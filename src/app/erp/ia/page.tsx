"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function IAPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abogadoId, setAbogadoId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const getAbogado = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("abogados")
        .select("id, nombre, especialidad")
        .eq("user_id", user.id)
        .single();
      if (data) setAbogadoId(data.id);
    };
    getAbogado();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          abogadoId,
          tipo: "privada",
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Error al procesar la consulta.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Error de conexión. Verificá que la API key de Groq esté configurada.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 flex-shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <Sparkles size={24} className="text-burgos-gold" />
            Asistente IA
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            IA jurídica personalizada · Llama 3.3 70B via Groq
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-burgos-gray-600 hover:text-red-400 transition-colors p-2"
            title="Limpiar conversación"
          >
            <Trash2 size={18} />
          </button>
        )}
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 bg-burgos-dark rounded-2xl border border-burgos-gray-800 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-burgos-gold/5 border border-burgos-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={28} className="text-burgos-gold" />
                </div>
                <h3 className="text-lg font-semibold text-burgos-white mb-2">
                  ¿En qué puedo ayudarte?
                </h3>
                <p className="text-sm text-burgos-gray-400 mb-6">
                  Puedo analizar casos, sugerir estrategias, redactar borradores
                  de escritos y responder consultas jurídicas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "¿Cuál es el plazo para contestar demanda en fuero civil?",
                    "Redactá un modelo de cédula de notificación",
                    "Analizá la viabilidad de un recurso de apelación",
                    "¿Qué dice el art. 245 LCT sobre indemnización?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="text-left text-xs text-burgos-gray-400 hover:text-burgos-gold bg-burgos-dark-2 hover:bg-burgos-dark-3 border border-burgos-gray-800 hover:border-burgos-gold/20 rounded-xl p-3 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-burgos-gold/10 border border-burgos-gold/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-burgos-gold" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-burgos-gold text-burgos-black rounded-br-md"
                    : "bg-burgos-dark-2 border border-burgos-gray-800 text-burgos-gray-200 rounded-bl-md"
                }`}
              >
                {msg.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.content.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 bg-burgos-dark-2 border border-burgos-gray-800 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={14} className="text-burgos-gray-400" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-burgos-gold/10 border border-burgos-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-burgos-gold" />
              </div>
              <div className="bg-burgos-dark-2 border border-burgos-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-burgos-gray-600 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-burgos-gray-600 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-burgos-gray-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-burgos-gray-800 bg-burgos-dark-2 flex-shrink-0"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu consulta jurídica..."
              className="flex-1 px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-11 h-11 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gray-800 rounded-xl flex items-center justify-center transition-colors"
            >
              <Send size={16} className="text-burgos-black" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
