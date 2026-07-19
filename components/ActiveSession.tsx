// components/ActiveSession.tsx

"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PokerSession } from "@/types/database";
import { calculateSessionStats } from "@/lib/calculations";

interface Props {
  session: PokerSession;
  onSessionUpdated: () => void;
  onSessionEnded: () => void;
}

export default function ActiveSession({ session, onSessionUpdated, onSessionEnded }: Props) {
  const [modalView, setModalView] = useState<"none" | "addChips" | "endSession">("none");
  
  const [addAmount, setAddAmount] = useState<number>(0);
  const [endStack, setEndStack] = useState<number>(session.start_stack);
  const [handsPlayed, setHandsPlayed] = useState<number>(0);

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAddChips = async () => {
    if (addAmount <= 0) return setModalView("none");
    const newStack = session.start_stack + addAmount;
    await supabase.from("sessions").update({ start_stack: newStack }).eq("id", session.id);
    setModalView("none");
    setAddAmount(0);
    onSessionUpdated();
  };

  const handleFinish = async () => {
    if (handsPlayed <= 0) return alert("Hands played must be greater than 0");

    const endTime = new Date().toISOString();
    const stats = calculateSessionStats({
      startStack: session.start_stack,
      endStack: endStack,
      handsPlayed: handsPlayed,
      startTime: session.start_time,
      endTime: endTime,
      stake: session.stake,
      rakePercent: session.rake_percent || 4,
    });

    await supabase.from("sessions").update({
      status: "completed",
      end_stack: endStack,
      hands_played: handsPlayed,
      end_time: endTime,
      ...stats
    }).eq("id", session.id);
      
    setModalView("none");
    onSessionUpdated();
    onSessionEnded(); // Triggers the global refresh
  };

  return (
    <>
      {/* The Compact Trello-style Card */}
      <div className="bg-white dark:bg-zinc-900 border-l-4 border-l-green-500 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 shadow-sm flex items-center justify-between">
        
        {/* Left Side: Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {session.game.toUpperCase()} {session.stake}pp
            </span>
          </div>
          <span className="text-[11px] text-zinc-500 ml-4">
            Started {formatTime(session.start_time)}
          </span>
        </div>

        {/* Right Side: Stack & Actions */}
        <div className="flex items-center gap-3">
          <div className="text-right mr-1">
            <span className="text-[10px] font-semibold text-zinc-400 block leading-none">STACK</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">{session.start_stack}</span>
          </div>
          
          <button 
            onClick={() => setModalView("addChips")}
            className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full font-bold hover:bg-blue-200 transition-colors"
          >
            +
          </button>
          
          <button 
            onClick={() => setModalView("endSession")}
            className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full font-bold hover:bg-red-200 transition-colors"
          >
            ⏹
          </button>
        </div>
      </div>

      {/* Add Chips Modal */}
      {modalView === "addChips" && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 w-full max-w-xs shadow-xl">
            <h3 className="font-bold mb-3 text-zinc-900 dark:text-white">Add Chips</h3>
            <input type="number" value={addAmount || ""} onChange={(e) => setAddAmount(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none mb-4" placeholder="Amount" />
            <div className="flex gap-2">
              <button onClick={() => setModalView("none")} className="flex-1 py-2 rounded-lg text-sm font-semibold bg-zinc-100 dark:bg-zinc-800">Cancel</button>
              <button onClick={handleAddChips} className="flex-1 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* End Session Modal */}
      {modalView === "endSession" && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 w-full max-w-xs shadow-xl">
            <h3 className="font-bold mb-4 text-zinc-900 dark:text-white">End Session</h3>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">END STACK</label>
                <input type="number" value={endStack} onChange={(e) => setEndStack(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1">HANDS PLAYED</label>
                <input type="number" value={handsPlayed || ""} onChange={(e) => setHandsPlayed(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" placeholder="Required" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModalView("none")} className="flex-1 py-2 rounded-lg text-sm font-semibold bg-zinc-100 dark:bg-zinc-800">Cancel</button>
              <button onClick={handleFinish} className="flex-1 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white">End Session</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
