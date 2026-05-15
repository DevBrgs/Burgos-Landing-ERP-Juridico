"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

interface ExportButtonsProps {
  data: Record<string, any>[];
  columns: { key: string; label: string }[];
  filename: string;
}

export function ExportButtons({ data, columns, filename }: ExportButtonsProps) {
  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Burgos & Asociados — ${filename}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString("es-AR")}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [columns.map(c => c.label)],
      body: data.map(row => columns.map(c => String(row[c.key] || "—"))),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [201, 168, 76] },
    });

    doc.save(`${filename}.pdf`);
  };

  const exportExcel = async () => {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(
      data.map(row => {
        const obj: Record<string, any> = {};
        columns.forEach(c => { obj[c.label] = row[c.key] || ""; });
        return obj;
      })
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  if (data.length === 0) return null;

  return (
    <div className="flex gap-2">
      <button onClick={exportPDF} className="inline-flex items-center gap-1.5 text-[10px] text-burgos-gray-400 hover:text-burgos-gold bg-burgos-dark-2 border border-burgos-gray-800 hover:border-burgos-gold/20 px-3 py-1.5 rounded-lg transition-all" title="Exportar PDF">
        <FileText size={12} /> PDF
      </button>
      <button onClick={exportExcel} className="inline-flex items-center gap-1.5 text-[10px] text-burgos-gray-400 hover:text-burgos-gold bg-burgos-dark-2 border border-burgos-gray-800 hover:border-burgos-gold/20 px-3 py-1.5 rounded-lg transition-all" title="Exportar Excel">
        <FileSpreadsheet size={12} /> Excel
      </button>
    </div>
  );
}
