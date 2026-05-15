"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, Trash2, FileText, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FileUpload } from "@/components/ui/FileUpload";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface DocIA {
  id: string;
  nombre: string;
  tipo: string | null;
  estado: string;
  creado_en: string;
}

export default function IAPage() {
  const [tab, setTab] = useState<"chat" | "documentos">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abogadoId, setAbogadoId] = useState<string | null>(null);
  const [documentos, setDocumentos] = useState<DocIA[]>([]);
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
      if (data) {
        setAbogadoId(data.id);
        setMessages([{
          id: "welcome",
          role: "assistant",
          content: `Hola ${data.nombre.split(" ")[0]}. Soy tu asistente jurídico especializado en ${data.especialidad}. ¿Qué necesitás?`,
        }]);
        // Cargar documentos
        const { data: docs } = await supabase.from("documentos_ia").select("*").eq("abogado_id", data.id).order("creado_en", { ascending: false });
        if (docs) setDocumentos(docs);
      }
    };
    getAbogado();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, abogadoId, tipo: "privada" }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.reply || "Error al procesar." }]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Error de conexión." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDocUpload = async (url: string, fileName: string) => {
    if (!abogadoId) return;
    await supabase.from("documentos_ia").insert({
      abogado_id: abogadoId,
      nombre: fileName,
      tipo: fileName.split(".").pop() || null,
      url,
    });
    const { data: docs } = await supabase.from("documentos_ia").select("*").eq("abogado_id", abogadoId).order("creado_en", { ascending: false });
    if (docs) setDocumentos(docs);
  };

  const deleteDoc = async (id: string) => {
    await supabase.from("documentos_ia").delete().eq("id", id);
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header with tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-burgos-white flex items-center gap-2">
            <Sparkles size={24} className="text-burgos-gold" />
            Asistente IA
          </h1>
          <p className="text-burgos-gray-400 text-sm mt-1">
            {tab === "chat" ? "Llama 3.3 70B via Groq" : `${documentos.length} documentos cargados`}
          </p>
        </div>
        <div className="flex gap-1 bg-burgos-dark-2 rounded-xl p-1 border border-burgos-gray-800">
          <button onClick={() => setTab("chat")} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${tab === "chat" ? "bg-burgos-gold/10 text-burgos-gold" : "text-burgos-gray-400 hover:text-burgos-white"}`}>
            Chat
          </button>
          <button onClick={() => setTab("documentos")} className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${tab === "documentos" ? "bg-burgos-gold/10 text-burgos-gold" : "text-burgos-gray-400 hover:text-burgos-white"}`}>
            Mis Documentos
          </button>
        </div>
      </motion.div>

      {tab === "chat" ? (
        /* Chat area */
        <div className="flex-1 bg-burgos-dark rounded-2xl border border-burgos-gray-800 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <Sparkles size={28} className="text-burgos-gold mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-burgos-white mb-2">¿En qué puedo ayudarte?</h3>
                  <p className="text-sm text-burgos-gray-400">Análisis de casos, redacción de escritos, consultas de normativa.</p>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-burgos-gold/10 border border-burgos-gold/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-burgos-gold" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-burgos-gold text-burgos-black rounded-br-md" : "bg-burgos-dark-2 border border-burgos-gray-800 text-burgos-gray-200 rounded-bl-md"}`}>
                  {msg.content.split("\n").map((line, i) => (<span key={i}>{line}{i < msg.content.split("\n").length - 1 && <br />}</span>))}
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
          <form onSubmit={handleSend} className="p-4 border-t border-burgos-gray-800 bg-burgos-dark-2 flex-shrink-0">
            <div className="flex gap-3">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribí tu consulta jurídica..." className="flex-1 px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30" />
              <button type="submit" disabled={!input.trim() || loading} className="w-11 h-11 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gray-800 rounded-xl flex items-center justify-center transition-colors">
                <Send size={16} className="text-burgos-black" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Documentos tab */
        <div className="flex-1 bg-burgos-dark rounded-2xl border border-burgos-gray-800 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-burgos-white mb-2">Subir documentos para entrenar tu IA</h2>
            <p className="text-xs text-burgos-gray-400 mb-4">
              Subí PDFs, Word o textos con leyes, doctrina, jurisprudencia o modelos de tu especialidad. La IA los usará como contexto para responder tus consultas.
            </p>
            <FileUpload
              bucket="ia-documentos"
              folder={abogadoId || "temp"}
              accept=".pdf,.doc,.docx,.txt"
              maxSizeMB={20}
              label="Subir documento"
              onUpload={handleDocUpload}
            />
          </div>

          {documentos.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={40} className="text-burgos-gray-800 mx-auto mb-3" />
              <p className="text-burgos-gray-600 text-sm">No tenés documentos cargados.</p>
              <p className="text-burgos-gray-600 text-xs mt-1">Subí PDFs con leyes, fallos o doctrina de tu área.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documentos.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-burgos-dark-2 rounded-xl border border-burgos-gray-800">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-burgos-gold" />
                    <div>
                      <p className="text-sm text-burgos-white">{doc.nombre}</p>
                      <p className="text-[10px] text-burgos-gray-600">
                        {new Date(doc.creado_en).toLocaleDateString()} · {doc.tipo?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${doc.estado === "listo" ? "bg-green-500/10 text-green-400" : doc.estado === "error" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {doc.estado}
                    </span>
                    <button onClick={() => deleteDoc(doc.id)} className="w-7 h-7 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
