"use client";

import { useState } from "react";
import { exportPdf, exportPrint } from "@/lib/export/exportPdf";
import { exportPng } from "@/lib/export/exportPng";
import type { TabView } from "@/lib/types/tournament";

interface ExportMenuProps {
  exportRef: React.RefObject<HTMLElement | null>;
  activeTab: TabView;
}

export function ExportMenu({ exportRef, activeTab }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const getFilename = (ext: string) => {
    const date = new Date().toISOString().slice(0, 10);
    return `wc2026-wallchart-${activeTab}-${date}.${ext}`;
  };

  const runExport = async (type: "png" | "pdf" | "print") => {
    if (!exportRef.current) return;
    setBusy(true);
    try {
      if (type === "png") {
        await exportPng(exportRef.current, getFilename("png"));
      } else if (type === "pdf") {
        await exportPdf(exportRef.current, getFilename("pdf"), activeTab);
      } else {
        exportPrint();
      }
    } finally {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={busy}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
      >
        {busy ? "Exporting…" : "Export ▾"}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            <button
              onClick={() => runExport("png")}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-zinc-50"
            >
              Download PNG
            </button>
            <button
              onClick={() => runExport("pdf")}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-zinc-50"
            >
              Download PDF
            </button>
            <button
              onClick={() => runExport("print")}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-zinc-50"
            >
              Print…
            </button>
          </div>
        </>
      )}
    </div>
  );
}
