"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import Image from "next/image";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "¡Hola! Soy el asistente virtual de Burgos & Asociados. Puedo ayudarte con:\n\n• Información sobre el estudio\n• Solicitar un turno con un abogado\n• Horarios y ubicación\n\n¿En qué puedo ayudarte?",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // TODO: Conectar con Claude API
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Gracias por tu consulta. El asistente está en configuración. Para consultas urgentes, completá el formulario de contacto o llamanos al (011) 4567-8900.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-burgos-gold hover:bg-burgos-gold-light rounded-full shadow-[0_0_30px_rgba(201,168,76,0.3)] flex items-center justify-center transition-colors"
            aria-label="Abrir chat"
          >
            <MessageCircle className="w-6 h-6 text-burgos-black" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[520px] max-h-[80vh] bg-burgos-dark rounded-2xl shadow-2xl border border-burgos-gray-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-burgos-dark-2 border-b border-burgos-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-burgos-gold/10 border border-burgos-gold/20 rounded-full flex items-center justify-center">
                  <Image
                    src="/logo-burgos.png"
                    alt="Burgos"
                    width={18}
                    height={18}
                    className="rounded-sm"
                  />
                </div>
                <div>
                  <p className="text-burgos-white text-sm font-semibold">
                    Asistente Burgos
                  </p>
                  <p className="text-burgos-gray-600 text-[10px]">
                    Consultas generales · Sin asesoría legal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-burgos-gray-600 hover:text-burgos-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-burgos-black/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 bg-burgos-dark-2 border border-burgos-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={12} className="text-burgos-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
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
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 bg-burgos-dark-2 border border-burgos-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={12} className="text-burgos-gold" />
                  </div>
                  <div className="bg-burgos-dark-2 border border-burgos-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-burgos-gray-600 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-burgos-gray-600 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-1.5 h-1.5 bg-burgos-gray-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-burgos-gray-800 bg-burgos-dark-2 flex-shrink-0"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu consulta..."
                  className="flex-1 px-3 py-2.5 bg-burgos-black/50 border border-burgos-gray-800 rounded-xl text-sm text-burgos-white placeholder:text-burgos-gray-600 focus:outline-none focus:border-burgos-gold/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 bg-burgos-gold hover:bg-burgos-gold-light disabled:bg-burgos-gray-800 rounded-xl flex items-center justify-center transition-colors"
                  aria-label="Enviar"
                >
                  <Send size={14} className="text-burgos-black" />
                </button>
              </div>
              <p className="text-[9px] text-burgos-gray-600 mt-1.5 text-center">
                No brinda asesoría legal · Para consultas específicas, reservá turno
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
