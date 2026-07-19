// // components/SessionsTable.tsx

// "use client";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useTelegram } from "./TelegramProvider";
// import { PokerSession } from "@/types/database";
// import EditSessionModal from "./EditSessionModal";
// import { FilterState } from "./ChartWidget";

// interface Props {
//   refreshTrigger: number;
//   filters: FilterState;
// }

// export default function SessionsTable({ refreshTrigger, filters }: Props) {
//   const { user } = useTelegram();
//   const [sessions, setSessions] = useState<PokerSession[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);
//   const [editingSession, setEditingSession] = useState<PokerSession | null>(null);
//   const PAGE_SIZE = 20;

//   const fetchSessions = async (pageIndex: number) => {
//     setLoading(true);
    
//     const start = pageIndex * PAGE_SIZE;
//     const end = start + PAGE_SIZE - 1;

//     let query = supabase
//       .from("sessions")
//       .select("*")
//       .eq("status", "completed")
//       .order("end_time", { ascending: false })
//       .range(start, end);

//     // Apply User Filter
//     if (filters.userId !== "all") {
//       query = query.eq("telegram_id", filters.userId);
//     }

//     // Apply other Filters
//     if (filters.game !== "all") query = query.eq("game", filters.game);
//     if (filters.stake !== "all") query = query.eq("stake", Number(filters.stake));
//     if (filters.opponent !== "all") {
//       query = query.or(`opponent_1.eq.${filters.opponent},opponent_2.eq.${filters.opponent}`);
//     }

//     const { data, error } = await query;

//     if (!error && data) {
//       if (pageIndex === 0) setSessions(data as PokerSession[]);
//       else setSessions(prev => [...prev, ...(data as PokerSession[])]);
//       setHasMore(data.length === PAGE_SIZE);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     setPage(0);
//     fetchSessions(0);
//   }, [user?.id, refreshTrigger, filters]);

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this session?")) return;
//     await supabase.from("sessions").delete().eq("id", id);
//     fetchSessions(0);
//     setPage(0);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return `${date.getMonth() + 1}/${date.getDate()}`;
//   };

//   return (
//     <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
//       <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
//         <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Sessions</h2>
//       </div>
//       <div className="w-full">
//         <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_auto] gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//           <div>Date</div><div>Stake</div><div>Hands</div><div className="text-right">Win</div><div className="text-right">Pts/100</div><div className="w-12 text-center">Act</div>
//         </div>
//         <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
//           {sessions.map((session) => (
//             <div key={session.id} className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_auto] gap-2 px-4 py-3 items-center text-xs text-zinc-700 dark:text-zinc-300">
//               <div>{formatDate(session.end_time!)}</div><div>{session.stake}</div><div>{session.hands_played}</div>
//               <div className={`text-right font-semibold ${session.pnl! > 0 ? 'text-green-600 dark:text-green-500' : session.pnl! < 0 ? 'text-red-600 dark:text-red-500' : ''}`}>{session.pnl! > 0 ? '+' : ''}{session.pnl}</div>
//               <div className={`text-right font-semibold ${session.pt_winrate! > 0 ? 'text-green-600 dark:text-green-500' : session.pt_winrate! < 0 ? 'text-red-600 dark:text-red-500' : ''}`}>{session.pt_winrate! > 0 ? '+' : ''}{session.pt_winrate}</div>
//               <div className="w-12 flex justify-between items-center text-zinc-400"><button onClick={() => setEditingSession(session)} className="hover:text-blue-500 p-1">✏️</button><button onClick={() => handleDelete(session.id)} className="hover:text-red-500 p-1">🗑️</button></div>
//             </div>
//           ))}
//           {sessions.length === 0 && !loading && <div className="p-8 text-center text-sm text-zinc-500">No sessions found.</div>}
//         </div>
//       </div>
//       {hasMore && (
//         <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
//           <button onClick={() => { const nextPage = page + 1; setPage(nextPage); fetchSessions(nextPage); }} disabled={loading} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">{loading ? "Loading..." : "Load More"}</button>
//         </div>
//       )}
//       <EditSessionModal session={editingSession} onClose={() => setEditingSession(null)} onSaved={() => { fetchSessions(0); setPage(0); }} />
//     </div>
//   );
// }



// components/SessionsTable.tsx

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegram } from "./TelegramProvider";
import { PokerSession } from "@/types/database";
import EditSessionModal from "./EditSessionModal";
import { FilterState } from "./ChartWidget";

interface Props {
  refreshTrigger: number;
  filters: FilterState;
}

export default function SessionsTable({ refreshTrigger, filters }: Props) {
  const { user } = useTelegram();
  const [sessions, setSessions] = useState<PokerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [editingSession, setEditingSession] = useState<PokerSession | null>(null);
  const PAGE_SIZE = 20;

  const fetchSessions = async (pageIndex: number) => {
    setLoading(true);
    
    const start = pageIndex * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    let query = supabase
      .from("sessions")
      .select("*")
      .eq("status", "completed")
      .order("end_time", { ascending: false })
      .range(start, end);

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
      if (pageIndex === 0) setSessions(data as PokerSession[]);
      else setSessions(prev => [...prev, ...(data as PokerSession[])]);
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(0);
    fetchSessions(0);
  }, [user?.id, refreshTrigger, filters]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    await supabase.from("sessions").delete().eq("id", id);
    fetchSessions(0);
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const pnlColor = (val: number) => (val > 0 ? "var(--positive)" : val < 0 ? "var(--negative)" : "var(--text-primary)");

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--surface-3)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="px-4 py-3.5 flex justify-between items-center" style={{ borderBottom: "1px solid var(--surface-3)" }}>
        <h2 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>Sessions</h2>
      </div>

      <div className="w-full">
        <div
          className="grid grid-cols-[1fr_1fr_1fr_1.4fr_1.4fr_auto] gap-2 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: "var(--surface-2)", color: "var(--text-tertiary)" }}
        >
          <div>Date</div><div>Stake</div><div>Hands</div><div className="text-right">Win</div><div className="text-right">Pts/100</div><div className="w-12 text-center">Act</div>
        </div>

        <div>
          {sessions.map((session, i) => (
            <div
              key={session.id}
              className="grid grid-cols-[1fr_1fr_1fr_1.4fr_1.4fr_auto] gap-2 px-4 py-3 items-center text-xs"
              style={{
                color: "var(--text-secondary)",
                borderTop: i === 0 ? "none" : "1px solid var(--surface-3)",
              }}
            >
              <div className="num" style={{ color: "var(--text-primary)" }}>{formatDate(session.end_time!)}</div>
              <div className="num">{session.stake}</div>
              <div className="num">{session.hands_played}</div>
              <div className="num text-right font-semibold" style={{ color: pnlColor(session.pnl!) }}>
                {session.pnl! > 0 ? '+' : ''}{session.pnl}
              </div>
              <div className="num text-right font-semibold" style={{ color: pnlColor(session.pt_winrate!) }}>
                {session.pt_winrate! > 0 ? '+' : ''}{session.pt_winrate}
              </div>
              <div className="w-12 flex justify-between items-center">
                <button
                  onClick={() => setEditingSession(session)}
                  className="p-1 rounded transition-colors"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-label="Edit session"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                </button>
                <button
                  onClick={() => handleDelete(session.id)}
                  className="p-1 rounded transition-colors"
                  style={{ color: "var(--text-tertiary)" }}
                  aria-label="Delete session"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
            </div>
          ))}
          {sessions.length === 0 && !loading && (
            <div className="p-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
              No sessions yet — start one to see it here.
            </div>
          )}
        </div>
      </div>

      {hasMore && (
        <div className="p-3.5 text-center" style={{ borderTop: "1px solid var(--surface-3)" }}>
          <button
            onClick={() => { const nextPage = page + 1; setPage(nextPage); fetchSessions(nextPage); }}
            disabled={loading}
            className="text-sm font-semibold transition-colors"
            style={{ color: "var(--accent)" }}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

      <EditSessionModal session={editingSession} onClose={() => setEditingSession(null)} onSaved={() => { fetchSessions(0); setPage(0); }} />
    </div>
  );
}
