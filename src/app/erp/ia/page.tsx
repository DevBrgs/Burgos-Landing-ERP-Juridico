"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, User, Sparkles, FileText, X, Plus, MessageSquare, Menu, Trash2, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FileUpload } from "@/components/ui/FileUpload";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

interface ChatSession {
  id: string;
  titulo: string;
  mensajes: { role: string; content: string }[];
  creado_en: string;
  actualizado_en: string;
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
  const [abogadoNombre, setAbogadoNombre] = useState("");
  const [abogadoEspecialidad, setAbogadoEspecialidad] = useState("");
  const [documentos, setDocumentos] = useState<DocIA[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Load abogado info + sessions on mount
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("abogados")
        .select("id, nombre, especialidad")
        .eq("user_id", user.id)
        .single();
      if (data) {
        setAbogadoId(data.id);
        setAbogadoNombre(data.nombre);
        setAbogadoEspecialidad(data.especialidad);
        // Load sessions
        await loadSessions(data.id);
        // Load documents
        const { data: docs } = await supabase.from("documentos_ia").select("*").eq("abogado_id", data.id).order("creado_en", { ascending: false });
        if (docs) setDocumentos(docs);
      }
    };
    init();
  }, []);

  const loadSessions = async (aId: string) => {
    const { data } = await supabase
      .from("chat_sesiones")
      .select("*")
      .eq("abogado_id", aId)
      .order("actualizado_en", { ascending: false })
      .limit(20);
    if (data) setSessions(data);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message for new conversations
  const getWelcomeMessage = useCallback((): Message => ({
    id: "welcome",
    role: "assistant",
    content: `Hola ${abogadoNombre.split(" ")[0] || ""}. Soy tu asistente jurídico especializado en ${abogadoEspecialidad || "derecho"}. ¿Qué necesitás?`,
  }), [abogadoNombre, abogadoEspecialidad]);

  // Start a new conversation
  const startNewSession = () => {
    setCurrentSessionId(null);
    setMessages([getWelcomeMessage()]);
    setLastFailedMessage(null);
    setShowSidebar(false);
  };

  // Load a session's messages
  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    const msgs: Message[] = session.mensajes.map((m, i) => ({
      id: `loaded-${i}`,
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
    setMessages(msgs.length > 0 ? msgs : [getWelcomeMessage()]);
    setLastFailedMessage(null);
    setShowSidebar(false);
  };

  // Save messages to Supabase
  const saveSession = async (msgs: Message[], sessionId: string | null, firstUserMsg?: string) => {
    if (!abogadoId) return null;

    const mensajesData = msgs
      .filter(m => m.id !== "welcome" && !m.error)
      .map(m => ({ role: m.role, content: m.content }));

    if (sessionId) {
      // Update existing session
      await supabase
        .from("chat_sesiones")
        .update({ mensajes: mensajesData, actualizado_en: new Date().toISOString() })
        .eq("id", sessionId);
      return sessionId;
    } else {
      // Create new session
      const titulo = firstUserMsg
        ? firstUserMsg.slice(0, 50) + (firstUserMsg.length > 50 ? "..." : "")
        : "Nueva conversación";
      const { data } = await supabase
        .from("chat_sesiones")
        .insert({
          abogado_id: abogadoId,
          titulo,
          mensajes: mensajesData,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString(),
        })
        .select("id")
        .single();
      return data?.id || null;
    }
  };

  // Delete a session
  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from("chat_sesiones").delete().eq("id", sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      startNewSession();
    }
  };

  // Send message handler with error fallback
  const handleSend = async (e: React.FormEvent, retryMessage?: string) => {
    e.preventDefault();
    const messageText = retryMessage || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: messageText };

    // If retrying, remove the error message first
    if (retryMessage) {
      setMessages(prev => prev.filter(m => !m.error));
    } else {
      setMessages(prev => [...prev, userMsg]);
    }

    setInput("");
    setLoading(true);
    setLastFailedMessage(null);

    const currentMessages = retryMessage
      ? [...messages.filter(m => !m.error)]
      : [...messages, userMsg];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, abogadoId, tipo: "privada" }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Error al procesar.",
      };

      const updatedMessages = [...currentMessages, assistantMsg];
      setMessages(updatedMessages);

      // Save to Supabase
      const isFirstExchange = !currentSessionId && currentMessages.filter(m => m.role === "user" && m.id !== "welcome").length <= 1;
      const firstUserMsg = isFirstExchange ? messageText : undefined;
      const newSessionId = await saveSession(updatedMessages, currentSessionId, firstUserMsg);

      if (newSessionId && !currentSessionId) {
        setCurrentSessionId(newSessionId);
      }

      // Refresh sessions list
      if (abogadoId) await loadSessions(abogadoId);
    } catch {
      // Fallback: show friendly error with retry button
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "El asistente no está disponible en este momento. Intentá de nuevo en unos segundos.",
        error: true,
      };
      setMessages(prev => [...prev, errorMsg]);
      setLastFailedMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Retry handler
  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lastFailedMessage) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSend(fakeEvent, lastFailedMessage);
    }
  };

  const handleDocUpload = async (url: string, fileName: string) => {
    if (!abogadoId) return;
    const { data } = await supabase.from("documentos_ia").insert({
      abogado_id: abogadoId,
      nombre: fileName,
      tipo: fileName.split(".").pop() || null,
      url,
    }).select("id").single();

    if (data) {
      fetch("/api/ia-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentoId: data.id, abogadoId }),
      });
    }

    const { data: docs } = await supabase.from("documentos_ia").select("*").eq("abogado_id", abogadoId).order("creado_en", { ascending: false });
    if (docs) setDocumentos(docs);
  };

  const deleteDoc = async (id: string) => {
    await supabase.from("documentos_ia").delete().eq("id", id);
    setDocumentos(prev => prev.filter(d => d.id !== id));
  };

  // Set initial welcome message when abogado data is ready
  useEffect(() => {
    if (abogadoNombre && messages.length === 0 && !currentSessionId) {
      setMessages([getWelcomeMessage()]);
    }
  }, [abogadoNombre, abogadoEspecialidad]);

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
        /* Chat area with sessions sidebar */
        <div className="flex-1 flex overflow-hidden rounded-2xl border border-burgos-gray-800">
          {/* Sessions sidebar - desktop */}
          <div className="hidden md:flex w-64 flex-col bg-burgos-dark border-r border-burgos-gray-800 flex-shrink-0">
            <div className="p-3 border-b border-burgos-gray-800">
              <button
                onClick={startNewSession}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-burgos-gold/10 hover:bg-burgos-gold/20 border border-burgos-gold/20 rounded-xl text-sm text-burgos-gold transition-colors"
              >
                <Plus size={16} />
                Nueva conversación
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => loadSession(session)}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? "bg-burgos-gold/10 border border-burgos-gold/20"
                      : "hover:bg-burgos-dark-2 border border-transparent"
                  }`}
                >
                  <MessageSquare size={14} className="text-burgos-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-burgos-white truncate">{session.titulo}</p>
                    <p className="text-[10px] text-burgos-gray-600">
                      {new Date(session.actualizado_en).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-burgos-gray-600 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-xs text-burgos-gray-600 text-center py-4">Sin conversaciones</p>
              )}
            </div>
          </div>

          {/* Mobile sidebar overlay */}
          {showSidebar && (
            <div className="md:hidden fixed inset-0 z-50 flex">
              <div className="w-72 bg-burgos-dark border-r border-burgos-gray-800 flex flex-col h-full shadow-2xl">
                <div className="p-3 border-b border-burgos-gray-800 flex items-center justify-between">
                  <button
                    onClick={startNewSession}
                    className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-burgos-gold/10 hover:bg-burgos-gold/20 border border-burgos-gold/20 rounded-xl text-sm text-burgos-gold transition-colors"
                  >
                    <Plus size={16} />
                    Nueva conversación
                  </button>
                  <button onClick={() => setShowSidebar(false)} className="ml-2 w-8 h-8 flex items-center justify-center rounded-lg text-burgos-gray-400 hover:text-burgos-white">
                    <X size={18} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {sessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => loadSession(session)}
                      className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        currentSessionId === session.id
                          ? "bg-burgos-gold/10 border border-burgos-gold/20"
                          : "hover:bg-burgos-dark-2 border border-transparent"
                      }`}
                    >
                      <MessageSquare size={14} className="text-burgos-gray-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-burgos-white truncate">{session.titulo}</p>
                        <p className="text-[10px] text-burgos-gray-600">
                          {new Date(session.actualizado_en).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteSession(session.id, e)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-burgos-gray-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {sessions.length === 0 && (
                    <p className="text-xs text-burgos-gray-600 text-center py-4">Sin conversaciones</p>
                  )}
                </div>
              </div>
              <div className="flex-1 bg-black/50" onClick={() => setShowSidebar(false)} />
            </div>
          )}

          {/* Chat main area */}
          <div className="flex-1 bg-burgos-dark flex flex-col overflow-hidden">
            {/* Mobile toggle button */}
            <div className="md:hidden flex items-center gap-2 p-3 border-b border-burgos-gray-800">
              <button
                onClick={() => setShowSidebar(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-burgos-dark-2 border border-burgos-gray-800 text-burgos-gray-400 hover:text-burgos-white transition-colors"
              >
                <Menu size={16} />
              </button>
              <span className="text-xs text-burgos-gray-400 truncate">
                {currentSessionId ? sessions.find(s => s.id === currentSessionId)?.titulo || "Chat" : "Nueva conversación"}
              </span>
            </div>

            {/* Messages */}
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
                    <div className={`w-8 h-8 ${msg.error ? "bg-red-500/10 border-red-500/20" : "bg-burgos-gold/10 border-burgos-gold/20"} border rounded-xl flex items-center justify-center flex-shrink-0 mt-1`}>
                      <Bot size={16} className={msg.error ? "text-red-400" : "text-burgos-gold"} />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.error ? "" : ""}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-burgos-gold text-burgos-black rounded-br-md"
                        : msg.error
                          ? "bg-red-500/5 border border-red-500/20 text-red-300 rounded-bl-md"
                          : "bg-burgos-dark-2 border border-burgos-gray-800 text-burgos-gray-200 rounded-bl-md"
                    }`}>
                      {msg.content.split("\n").map((line, i) => (<span key={i}>{line}{i < msg.content.split("\n").length - 1 && <br />}</span>))}
                    </div>
                    {msg.error && lastFailedMessage && (
                      <button
                        onClick={handleRetry}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-burgos-dark-2 border border-burgos-gray-800 rounded-lg text-xs text-burgos-gray-300 hover:text-burgos-white hover:border-burgos-gold/30 transition-colors"
                      >
                        <RefreshCw size={12} />
                        Reintentar
                      </button>
                    )}
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
            <form onSubmit={handleSend} className="p-4 border-t border-burgos-gray-800 bg-burgos-dark-2 flex-shrink-0">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu consulta jurídica..."
                  className="flex-1 px-4 py-3 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30"
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
