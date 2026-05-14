"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import Image from "next/image";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "¡Hola! Soy el asistente virtual de Burgos & Asociados. Puedo ayudarte con:\n\n• Información sobre el estudio y nuestras áreas\n• Solicitar un turno con un abogado\n• Horarios y ubicación\n\n¿En qué puedo ayudarte?",
  timestamp: new Date(),
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Conectar con Claude API endpoint
    // Por ahora respuesta placeholder
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Gracias por tu consulta. En este momento el asistente está en configuración. Para consultas urgentes, podés completar el formulario de contacto o llamarnos al (011) 4567-8900.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-burgos-gold hover:bg-burgos-gold-dark rounded-full shadow-lg flex items-center justify-center transition-colors group"
            aria-label="Abrir chat"
          >
            <MessageCircle className="w-6 h-6 text-burgos-navy" />
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-burgos-gold animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[520px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-burgos-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-burgos-navy px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-burgos-gold/20 rounded-full flex items-center justify-center">
                  <Image
                    src="/logo-burgos.png"
                    alt="Burgos"
                    width={20}
                    height={20}
                    className="rounded-sm"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">
                    Asistente Burgos
                  </p>
                  <p className="text-white/50 text-xs">
                    Consultas generales · Sin asesoría legal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-burgos-gray-100">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 bg-burgos-navy rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={14} className="text-burgos-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-burgos-gold text-burgos-navy rounded-br-sm"
                        : "bg-white text-burgos-gray-700 rounded-bl-sm shadow-sm"
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
                    <div className="w-7 h-7 bg-burgos-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User size={14} className="text-burgos-gray-700" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 bg-burgos-navy rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-burgos-gold" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-xl rounded-bl-sm shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-burgos-gray-300 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-burgos-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-burgos-gray-300 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-burgos-gray-200 bg-white flex-shrink-0"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu consulta..."
                  className="flex-1 px-3 py-2 bg-burgos-gray-100 rounded-lg text-sm text-burgos-gray-900 placeholder:text-burgos-gray-500 focus:outline-none focus:ring-2 focus:ring-burgos-gold/30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 bg-burgos-gold hover:bg-burgos-gold-dark disabled:bg-burgos-gray-200 rounded-lg flex items-center justify-center transition-colors"
                  aria-label="Enviar mensaje"
                >
                  <Send
                    size={16}
                    className="text-burgos-navy disabled:text-burgos-gray-500"
                  />
                </button>
              </div>
              <p className="text-[10px] text-burgos-gray-500 mt-1.5 text-center">
                Este asistente no brinda asesoría legal. Para consultas
                específicas, reservá un turno.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
