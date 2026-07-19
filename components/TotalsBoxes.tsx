// // components/TotalsBoxes.tsx

// "use client";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useTelegram } from "./TelegramProvider";
// import { FilterState } from "./ChartWidget";

// interface Props {
//   refreshTrigger: number;
//   filters: FilterState;
// }

// export default function TotalsBoxes({ refreshTrigger, filters }: Props) {
//   const { user } = useTelegram();
//   const [loading, setLoading] = useState(true);
//   const [totals, setTotals] = useState({ hands: 0, hours: 0, win: 0, winPer100: 0, ptsPer100: 0, winPerHour: 0 });

//   useEffect(() => {
//     const fetchAndCalculateTotals = async () => {
//       setLoading(true);

//       let query = supabase
//         .from("sessions")
//         .select("hands_played, hours_played, pnl, pts")
//         .eq("status", "completed");

//       // Apply User Filter
//       if (filters.userId !== "all") {
//         query = query.eq("telegram_id", filters.userId);
//       }

//       // Apply other Filters
//       if (filters.game !== "all") query = query.eq("game", filters.game);
//       if (filters.stake !== "all") query = query.eq("stake", Number(filters.stake));
//       if (filters.opponent !== "all") {
//         query = query.or(`opponent_1.eq.${filters.opponent},opponent_2.eq.${filters.opponent}`);
//       }

//       const { data, error } = await query;

//       if (!error && data) {
//         let totalHands = 0, totalHours = 0, totalWin = 0, totalPts = 0;
//         data.forEach((session) => {
//           totalHands += session.hands_played || 0;
//           totalHours += session.hours_played || 0;
//           totalWin += session.pnl || 0;
//           totalPts += session.pts || 0;
//         });

//         setTotals({
//           hands: totalHands,
//           hours: totalHours,
//           win: totalWin,
//           winPer100: totalHands > 0 ? (totalWin / totalHands) * 100 : 0,
//           ptsPer100: totalHands > 0 ? (totalPts / totalHands) * 100 : 0,
//           winPerHour: totalHours > 0 ? totalWin / totalHours : 0,
//         });
//       }
//       setLoading(false);
//     };

//     fetchAndCalculateTotals();
//   }, [user?.id, refreshTrigger, filters]);

//   const formatNum = (num: number, decimals: number = 0) => num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
//   const ColorValue = ({ val, decimals = 1 }: { val: number; decimals?: number }) => {
//     if (val > 0) return <span className="text-green-600 dark:text-green-500">+{formatNum(val, decimals)}</span>;
//     if (val < 0) return <span className="text-red-600 dark:text-red-500">{formatNum(val, decimals)}</span>;
//     return <span className="text-zinc-900 dark:text-white">{formatNum(val, decimals)}</span>;
//   };

//   return (
//     <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-3">
//       {loading ? (
//         <div className="h-[80px] flex items-center justify-center text-xs text-zinc-400">Loading stats...</div>
//       ) : (
//         <div className="grid grid-cols-3 gap-y-3 gap-x-2">
//           <div className="flex flex-col items-center text-center"><span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Hands</span><span className="text-base font-bold text-zinc-900 dark:text-white">{formatNum(totals.hands)}</span></div>
//           <div className="flex flex-col items-center text-center border-l border-zinc-100 dark:border-zinc-800"><span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Win</span><span className="text-base font-bold"><ColorValue val={totals.win} /></span></div>
//           <div className="flex flex-col items-center text-center border-l border-zinc-100 dark:border-zinc-800"><span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Win/100</span><span className="text-base font-bold"><ColorValue val={totals.winPer100} /></span></div>
//           <div className="flex flex-col items-center text-center pt-1.5 border-t border-zinc-100 dark:border-zinc-800"><span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Hours</span><span className="text-base font-bold text-zinc-900 dark:text-white">{formatNum(totals.hours, 1)}</span></div>
//           <div className="flex flex-col items-center text-center pt-1.5 border-t border-l border-zinc-100 dark:border-zinc-800"><span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Win/Hr</span><span className="text-base font-bold"><ColorValue val={totals.winPerHour} /></span></div>
//           <div className="flex flex-col items-center text-center pt-1.5 border-t border-l border-zinc-100 dark:border-zinc-800"><span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Pts/100</span><span className="text-base font-bold"><ColorValue val={totals.ptsPer100} /></span></div>
//         </div>
//       )}
//     </div>
//   );
// }



// components/TotalsBoxes.tsx

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegram } from "./TelegramProvider";
import { FilterState } from "./ChartWidget";

interface Props {
  refreshTrigger: number;
  filters: FilterState;
}

const formatNum = (num: number, decimals: number = 0) =>
  num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

function ColorValue({ val, decimals = 1 }: { val: number; decimals?: number }) {
  const color = val > 0 ? "var(--positive)" : val < 0 ? "var(--negative)" : "var(--text-primary)";
  const sign = val > 0 ? "+" : "";
  return <span className="num" style={{ color }}>{sign}{formatNum(val, decimals)}</span>;
}

function Stat({
  label,
  value,
  border,
}: {
  label: string;
  value: React.ReactNode;
  border?: "left" | "top" | "top-left";
}) {
  const style: React.CSSProperties = {};
  if (border === "left") style.borderLeft = "1px solid var(--surface-3)";
  if (border === "top") style.borderTop = "1px solid var(--surface-3)";
  if (border === "top-left") {
    style.borderTop = "1px solid var(--surface-3)";
    style.borderLeft = "1px solid var(--surface-3)";
  }
  return (
    <div className="flex flex-col items-center text-center py-1.5" style={style}>
      <span
        className="text-[10px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: "var(--text-tertiary)" }}
      >
        {label}
      </span>
      <span className="num text-[15px] font-semibold">{value}</span>
    </div>
  );
}

export default function TotalsBoxes({ refreshTrigger, filters }: Props) {
  const { user } = useTelegram();
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ hands: 0, hours: 0, win: 0, winPer100: 0, ptsPer100: 0, winPerHour: 0 });

  useEffect(() => {
    const fetchAndCalculateTotals = async () => {
      setLoading(true);

      let query = supabase
        .from("sessions")
        .select("hands_played, hours_played, pnl, pts")
        .eq("status", "completed");

      // Apply User Filter
      if (filters.userId !== "all") {
        query = query.eq("telegram_id", filters.userId);
      }

      // Apply other Filters
      if (filters.game !== "all") query = query.eq("game", filters.game);
      if (filters.stake !== "all") query = query.eq("stake", Number(filters.stake));
      if (filters.opponent !== "all") {
        query = query.or(`opponent_1.eq.${filters.opponent},opponent_2.eq.${filters.opponent}`);
      }

      const { data, error } = await query;

      if (!error && data) {
        let totalHands = 0, totalHours = 0, totalWin = 0, totalPts = 0;
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
  }, [user?.id, refreshTrigger, filters]);

  return (
    <div
      className="rounded-2xl p-1"
      style={{
        backgroundColor: "var(--surface-1)",
        border: "1px solid var(--surface-3)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {loading ? (
        <div className="h-[84px] flex items-center justify-center text-xs" style={{ color: "var(--text-tertiary)" }}>
          Loading stats…
        </div>
      ) : (
        <div className="grid grid-cols-3">
          <Stat label="Hands" value={<span style={{ color: "var(--text-primary)" }}>{formatNum(totals.hands)}</span>} />
          <Stat label="Win" value={<ColorValue val={totals.win} />} border="left" />
          <Stat label="Win/100" value={<ColorValue val={totals.winPer100} />} border="left" />
          <Stat label="Hours" value={<span style={{ color: "var(--text-primary)" }}>{formatNum(totals.hours, 1)}</span>} border="top" />
          <Stat label="Win/Hr" value={<ColorValue val={totals.winPerHour} />} border="top-left" />
          <Stat label="Pts/100" value={<ColorValue val={totals.ptsPer100} />} border="top-left" />
        </div>
      )}
    </div>
  );
}
