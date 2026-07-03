"use client";

import { useRef } from "react";
import {
  useActiveTab,
  useEditingMatchId,
  useTournamentActions,
} from "@/lib/store/tournamentStore";
import { BracketView } from "@/components/bracket/BracketView";
import { DndProvider } from "@/components/dnd/DndProvider";
import { GroupsView } from "@/components/groups/GroupsView";
import { MatchEditor } from "@/components/match/MatchEditor";
import { TabNav } from "@/components/tabs/TabNav";
import { Toolbar } from "@/components/toolbar/Toolbar";

export default function WallChartApp() {
  const exportRef = useRef<HTMLDivElement>(null);
  const activeTab = useActiveTab();
  const editingMatchId = useEditingMatchId();
  const { setActiveTab, openMatchEditor } = useTournamentActions();

  const handleEditMatch = (id: string) => openMatchEditor(id);

  return (
    <DndProvider>
      <div className="min-h-screen bg-zinc-100">
        <header className="no-print border-b border-zinc-200 bg-white px-4 py-4 shadow-sm">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">
                  FIFA World Cup 2026
                </h1>
                <p className="text-sm text-zinc-500">Dynamic Wall Chart</p>
              </div>
              <TabNav activeTab={activeTab} onChange={setActiveTab} />
            </div>
            <Toolbar exportRef={exportRef} activeTab={activeTab} />
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4">
          <div
            id="wallchart-export"
            ref={exportRef}
            data-export-tab={activeTab}
            className={`export-target rounded-xl bg-white p-4 shadow-sm print:shadow-none ${
              activeTab === "groups" ? "groups-export" : "bracket-export"
            }`}
          >
            <div className="mb-4 hidden print:block">
              <h1 className="text-2xl font-bold">FIFA World Cup 2026</h1>
              <p className="text-sm text-zinc-600">
                {activeTab === "groups" ? "Group Stage" : "Knockout Bracket"}
              </p>
            </div>

            {activeTab === "groups" ? (
              <GroupsView onEditMatch={handleEditMatch} />
            ) : (
              <BracketView onEditMatch={handleEditMatch} />
            )}
          </div>
        </main>

        {editingMatchId && (
          <MatchEditor
            key={editingMatchId}
            matchId={editingMatchId}
            onClose={() => openMatchEditor(null)}
          />
        )}
      </div>
    </DndProvider>
  );
}
