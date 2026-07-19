// components/ActiveSession.tsx

"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PokerSession } from "@/types/database";
import { calculateSessionStats } from "@/lib/calculations";

interface Props {
  session: PokerSession;
  onSessionUpdated: () => void;
}

export default function ActiveSession({ session, onSessionUpdated }: Props) {
  const [isFinishing, setIsFinishing] = useState(false);
  const [endStack, setEndStack] = useState<number>(session.start_stack);
  const [handsPlayed, setHandsPlayed] = useState<number>(0);
  
  const [isAddingChips, setIsAddingChips] = useState(false);
  const [addAmount, setAddAmount] = useState<number>(0);

  const handleAddChips = async () => {
    if (addAmount <= 0) return setIsAddingChips(false);
    
    const newStack = session.start_stack + addAmount;
    await supabase
      .from("sessions")
      .update({ start_stack: newStack })
      .eq("id", session.id);
      
    setIsAddingChips(false);
    setAddAmount(0);
    onSessionUpdated();
  };

  const handleFinish = async () => {
    const endTime = new Date().toISOString();
    
    // Run our math logic
    const stats = calculateSessionStats({
      startStack: session.start_stack,
      endStack: endStack,
      handsPlayed: handsPlayed,
      startTime: session.start_time,
      endTime: endTime,
      stake: session.stake,
      rakePercent: session.rake_percent || 4,
    });

    // Save everything to the database
    await supabase
      .from("sessions")
      .update({
        status: "completed",
        end_stack: endStack,
        hands_played: handsPlayed,
        end_time: endTime,
        ...stats // This spreads all 8 calculated fields into the update payload
      })
      .eq("id", session.id);
      
    setIsFinishing(false);
    onSessionUpdated();
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            Active Session
          </h2>
          <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">
            {session.game.toUpperCase()} • {session.stake}pp • {session.rake_percent}% Rake
            {session.opponent_1 && ` • vs ${session.opponent_1}`}
            {session.opponent_2 && `, ${session.opponent_2}`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-xl p-4 mb-4 border border-blue-100 dark:border-blue-900/50">
        <div>
          <p className="text-xs font-semibold text-zinc-500">CURRENT STACK</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{session.start_stack}</p>
        </div>
        
        {isAddingChips ? (
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={addAmount || ""}
              onChange={(e) => setAddAmount(Number(e.target.value))}
              className="w-20 bg-zinc-100 dark:bg-zinc-800 rounded p-1.5 text-sm outline-none"
              placeholder="+ Amt"
            />
            <button onClick={handleAddChips} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold">✓</button>
            <button onClick={() => setIsAddingChips(false)} className="bg-zinc-200 dark:bg-zinc-700 px-3 py-1.5 rounded text-sm font-bold">✕</button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingChips(true)}
            className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors"
          >
            + Add Chips
          </button>
        )}
      </div>

      {isFinishing ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">END STACK</label>
              <input type="number" value={endStack} onChange={(e) => setEndStack(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 text-sm outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">HANDS PLAYED</label>
              <input type="number" value={handsPlayed} onChange={(e) => setHandsPlayed(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 text-sm outline-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setIsFinishing(false)} className="flex-1 py-2 rounded-lg text-sm font-semibold bg-zinc-100 dark:bg-zinc-800">Cancel</button>
            <button onClick={handleFinish} className="flex-1 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white">End Session</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsFinishing(true)}
          className="w-full py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
        >
          Finish Session
        </button>
      )}
    </div>
  );
}
