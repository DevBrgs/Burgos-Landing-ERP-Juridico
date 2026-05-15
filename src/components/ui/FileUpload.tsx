"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FileUploadProps {
  bucket: string;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  onUpload: (url: string, fileName: string) => void;
  label?: string;
  compact?: boolean;
}

export function FileUpload({
  bucket,
  folder = "",
  accept = "*",
  maxSizeMB = 10,
  onUpload,
  label = "Subir archivo",
  compact = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFile = async (file: File) => {
    setError("");

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo supera ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${folder ? folder + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      setError("Error al subir: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    onUpload(urlData.publicUrl, file.name);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (compact) {
    return (
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 text-xs text-burgos-gold hover:text-burgos-gold-light bg-burgos-gold/5 hover:bg-burgos-gold/10 border border-burgos-gold/20 px-3 py-2 rounded-lg transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
          {uploading ? "Subiendo..." : label}
        </button>
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
        {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-burgos-gold/50 bg-burgos-gold/5"
            : "border-burgos-gray-800 hover:border-burgos-gold/30 hover:bg-burgos-dark-2"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-burgos-gold animate-spin" />
            <p className="text-xs text-burgos-gray-400">Subiendo...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-burgos-gray-600" />
            <p className="text-xs text-burgos-gray-400">
              Arrastrá un archivo o hacé click para seleccionar
            </p>
            <p className="text-[10px] text-burgos-gray-600">
              Máximo {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}
