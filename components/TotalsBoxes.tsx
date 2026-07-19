// components/TotalsBoxes.tsx

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegram } from "./TelegramProvider";

interface Props {
  refreshTrigger: number;
}

export default function TotalsBoxes({ refreshTrigger }: Props) {
  const { user } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    hands: 0,
    hours: 0,
    win: 0,
    winPer100: 0,
    ptsPer100: 0,
    winPerHour: 0,
  });

  useEffect(() => {
    const fetchAndCalculateTotals = async () => {
      if (!user?.id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("sessions")
        .select("hands_played, hours_played, pnl, pts")
        .eq("telegram_id", user.id.toString())
        .eq("status", "completed");

      if (!error && data) {
        let totalHands = 0;
        let totalHours = 0;
        let totalWin = 0;
        let totalPts = 0;

        data.forEach((session) => {
          totalHands += session.hands_played || 0;
          totalHours += session.hours_played || 0;
          totalWin += session.pnl || 0;
          totalPts += session.pts || 0;
        });

        setTotals({
          hands: totalHands,
          hours: totalHours,
          win: totalWin,
          winPer100: totalHands > 0 ? (totalWin / totalHands) * 100 : 0,
          ptsPer100: totalHands > 0 ? (totalPts / totalHands) * 100 : 0,
          winPerHour: totalHours > 0 ? totalWin / totalHours : 0,
        });
      }
      setLoading(false);
    };

    fetchAndCalculateTotals();
  }, [user?.id, refreshTrigger]);

  // Helper to format numbers with commas (e.g., 1,234)
  const formatNum = (num: number, decimals: number = 0) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Helper to colorize financial numbers
  const ColorValue = ({ val, decimals = 1 }: { val: number; decimals?: number }) => {
    if (val > 0) return <span className="text-green-600 dark:text-green-500">+{formatNum(val, decimals)}</span>;
    if (val < 0) return <span className="text-red-600 dark:text-red-500">{formatNum(val, decimals)}</span>;
    return <span className="text-zinc-900 dark:text-white">{formatNum(val, decimals)}</span>;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4">
      {loading ? (
        <div className="h-[100px] flex items-center justify-center text-sm text-zinc-400">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-3 gap-y-4 gap-x-2">
          
          {/* Row 1 */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Hands</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">{formatNum(totals.hands)}</span>
          </div>
          
          <div className="flex flex-col items-center text-center border-l border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Win</span>
            <span className="text-lg font-bold"><ColorValue val={totals.win} /></span>
          </div>
          
          <div className="flex flex-col items-center text-center border-l border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Win/100</span>
            <span className="text-lg font-bold"><ColorValue val={totals.winPer100} /></span>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col items-center text-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Hours</span>
            <span className="text-lg font-bold text-zinc-900 dark:text-white">{formatNum(totals.hours, 1)}</span>
          </div>
          
          <div className="flex flex-col items-center text-center pt-2 border-t border-l border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Win/Hr</span>
            <span className="text-lg font-bold"><ColorValue val={totals.winPerHour} /></span>
          </div>
          
          <div className="flex flex-col items-center text-center pt-2 border-t border-l border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Pts/100</span>
            <span className="text-lg font-bold"><ColorValue val={totals.ptsPer100} /></span>
          </div>

        </div>
      )}
    </div>
  );
}
