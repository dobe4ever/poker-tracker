// components/StartSessionModal.tsx

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegram } from "./TelegramProvider";
import { GameType } from "@/types/database";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSessionStarted: () => void;
}

const STAKES = [0.25, 1, 2, 5, 10, 25, 50];
const GAMES: GameType[] = ["reg", "prog", "2-7"];

export default function StartSessionModal({ isOpen, onClose, onSessionStarted }: Props) {
  const { user } = useTelegram();
  const [stake, setStake] = useState<number>(2);
  const [game, setGame] = useState<GameType>("reg");
  const [rake, setRake] = useState<number>(4);
  const [startStack, setStartStack] = useState<number>(400);
  const [opp1, setOpp1] = useState("");
  const [opp2, setOpp2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setStartStack(stake * 200);
  }, [stake]);

  if (!isOpen) return null;

  const handleStart = async () => {
    if (!user?.id) return alert("Telegram user not found");
    setIsSubmitting(true);

    const { error } = await supabase.from("sessions").insert({
      telegram_id: user.id.toString(),
      status: "in_progress",
      stake,
      game,
      rake_percent: rake,
      start_stack: startStack,
      opponent_1: opp1 || null,
      opponent_2: opp2 || null,
    });

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Error starting session");
    } else {
      onSessionStarted();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Start Session</h2>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">STAKE</label>
              <select value={stake} onChange={(e) => setStake(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none">
                {STAKES.map(s => <option key={s} value={s}>{s}pp</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">GAME</label>
              <select value={game} onChange={(e) => setGame(e.target.value as GameType)} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none">
                {GAMES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="w-20">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">RAKE %</label>
              <input type="number" value={rake} onChange={(e) => setRake(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">START STACK</label>
            <input type="number" value={startStack} onChange={(e) => setStartStack(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">OPPONENT 1</label>
              <input type="text" placeholder="Optional" value={opp1} onChange={(e) => setOpp1(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-zinc-500 mb-1">OPPONENT 2</label>
              <input type="text" placeholder="Optional" value={opp2} onChange={(e) => setOpp2(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg font-semibold text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300">Cancel</button>
          <button onClick={handleStart} disabled={isSubmitting} className="flex-1 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? "Starting..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}
