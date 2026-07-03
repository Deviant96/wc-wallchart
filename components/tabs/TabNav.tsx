"use client";

import type { TabView } from "@/lib/types/tournament";

interface TabNavProps {
  activeTab: TabView;
  onChange: (tab: TabView) => void;
}

export function TabNav({ activeTab, onChange }: TabNavProps) {
  const tabs: { id: TabView; label: string }[] = [
    { id: "groups", label: "Group Stage" },
    { id: "bracket", label: "Knockout Bracket" },
  ];

  return (
    <div className="no-print flex gap-1 rounded-lg bg-zinc-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            activeTab === tab.id
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
