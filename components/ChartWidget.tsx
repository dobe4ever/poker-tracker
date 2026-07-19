// components/ChartWidget.tsx

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegram } from "./TelegramProvider";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export interface FilterState {
  game: string;
  stake: string;
  opponent: string;
}

interface Props {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  refreshTrigger: number;
}

export default function ChartWidget({ filters, setFilters, refreshTrigger }: Props) {
  const { user } = useTelegram();
  const [activeTab, setActiveTab] = useState<"time" | "hands">("time");
  const [timePeriod, setTimePeriod] = useState<"D" | "W" | "M">("D");
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [opponentsList, setOpponentsList] = useState<string[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user?.id) return;

      // 1. Fetch all completed sessions for this user, ordered oldest to newest (for cumulative math)
      let query = supabase
        .from("sessions")
        .select("*")
        .eq("telegram_id", user.id.toString())
        .eq("status", "completed")
        .order("end_time", { ascending: true });

      // Apply Filters
      if (filters.game !== "all") query = query.eq("game", filters.game);
      if (filters.stake !== "all") query = query.eq("stake", Number(filters.stake));
      if (filters.opponent !== "all") {
        query = query.or(`opponent_1.eq.${filters.opponent},opponent_2.eq.${filters.opponent}`);
      }

      const { data } = await query;
      if (!data) return;

      // Extract unique opponents for the dropdown (only do this if opponent filter is 'all' to preserve the list)
      if (filters.opponent === "all") {
        const opps = new Set<string>();
        data.forEach(d => {
          if (d.opponent_1) opps.add(d.opponent_1);
          if (d.opponent_2) opps.add(d.opponent_2);
        });
        setOpponentsList(Array.from(opps));
      }

      // 2. Process Data based on Active Tab
      if (activeTab === "time") {
        const grouped = new Map<string, { pnl: number; hands: number }>();
        
        data.forEach(s => {
          const date = new Date(s.end_time!);
          let key = "";
          if (timePeriod === "D") key = date.toISOString().split("T")[0];
          if (timePeriod === "M") key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (timePeriod === "W") {
            const day = date.getDay();
            const diff = date.getDate() - day;
            key = new Date(date.setDate(diff)).toISOString().split("T")[0];
          }

          const existing = grouped.get(key) || { pnl: 0, hands: 0 };
          grouped.set(key, {
            pnl: existing.pnl + (s.pnl || 0),
            hands: existing.hands + (s.hands_played || 0),
          });
        });

        let cumulativePnl = 0;
        const processed = Array.from(grouped.keys()).sort().map(key => {
          const val = grouped.get(key)!;
          cumulativePnl += val.pnl;
          
          // Format date for display
          const d = new Date(key);
          const displayDate = timePeriod === "M" 
            ? d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
            : `${d.getMonth() + 1}/${d.getDate()}`;

          return {
            date: displayDate,
            profit: Number(cumulativePnl.toFixed(2)),
            volume: val.hands,
          };
        });
        setChartData(processed);
      } 
      
      else if (activeTab === "hands") {
        let cumulativeHands = 0;
        let cumulativePnl = 0;
        let cumulativePts = 0;

        const processed = data.map(s => {
          cumulativeHands += (s.hands_played || 0);
          cumulativePnl += (s.pnl || 0);
          cumulativePts += (s.pts || 0);

          return {
            hands: cumulativeHands,
            profit: Number(cumulativePnl.toFixed(2)),
            points: Number(cumulativePts.toFixed(2)),
          };
        });
        setChartData(processed);
      }
    };

    fetchChartData();
  }, [user?.id, activeTab, timePeriod, filters, refreshTrigger]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      
      {/* HEADER */}
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
        {/* Title & Filters */}
        <div className="flex flex-col gap-3 mb-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Performance</h2>
          <div className="flex gap-2">
            <select 
              value={filters.game} 
              onChange={(e) => setFilters({ ...filters, game: e.target.value })}
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1.5 text-xs font-semibold outline-none text-zinc-700 dark:text-zinc-300"
            >
              <option value="all">All Games</option>
              <option value="reg">REG</option>
              <option value="prog">PROG</option>
              <option value="2-7">2-7</option>
            </select>
            <select 
              value={filters.stake} 
              onChange={(e) => setFilters({ ...filters, stake: e.target.value })}
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1.5 text-xs font-semibold outline-none text-zinc-700 dark:text-zinc-300"
            >
              <option value="all">All Stakes</option>
              {[0.25, 1, 2, 5, 10, 25, 50].map(s => <option key={s} value={s}>{s}pp</option>)}
            </select>
            <select 
              value={filters.opponent} 
              onChange={(e) => setFilters({ ...filters, opponent: e.target.value })}
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1.5 text-xs font-semibold outline-none text-zinc-700 dark:text-zinc-300"
            >
              <option value="all">All Opps</option>
              {opponentsList.map(opp => <option key={opp} value={opp}>{opp}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("time")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === "time" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500"}`}
          >
            Over Time
          </button>
          <button 
            onClick={() => setActiveTab("hands")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === "hands" ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white" : "text-zinc-500"}`}
          >
            By Hands
          </button>
        </div>
      </div>

      {/* CHART BODY */}
      <div className="p-4">
        {/* Period Controls (Only show if 'time' tab is active) */}
        {activeTab === "time" && (
          <div className="flex justify-end gap-2 mb-4">
            {["D", "W", "M"].map(p => (
              <button 
                key={p}
                onClick={() => setTimePeriod(p as any)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${timePeriod === p ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* The Chart Area */}
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "time" ? (
              <ComposedChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#18181b', border: 'none', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar yAxisId="right" dataKey="volume" name="Hands" fill="#3b82f6" opacity={0.3} radius={[2, 2, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="profit" name="Profit" stroke="#22c55e" strokeWidth={3} dot={false} />
              </ComposedChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <XAxis dataKey="hands" tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717a' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: '#18181b', border: 'none', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="profit" name="Profit ($)" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="points" name="Points" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
