// components/SessionsTable.tsx

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegram } from "./TelegramProvider";
import { PokerSession } from "@/types/database";
import EditSessionModal from "./EditSessionModal";

interface Props {
  refreshTrigger: number;
}

export default function SessionsTable({ refreshTrigger }: Props) {
  const { user } = useTelegram();
  const [sessions, setSessions] = useState<PokerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [editingSession, setEditingSession] = useState<PokerSession | null>(null);
  const PAGE_SIZE = 20;

  const fetchSessions = async (pageIndex: number) => {
    if (!user?.id) return;
    setLoading(true);
    
    const start = pageIndex * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("telegram_id", user.id.toString())
      .eq("status", "completed")
      .order("end_time", { ascending: false })
      .range(start, end);

    if (!error && data) {
      if (pageIndex === 0) {
        setSessions(data as PokerSession[]);
      } else {
        setSessions(prev => [...prev, ...(data as PokerSession[])]);
      }
      setHasMore(data.length === PAGE_SIZE);
    }
    setLoading(false);
  };

  // Re-fetch page 0 whenever the refreshTrigger changes
  useEffect(() => {
    if (user?.id) {
      setPage(0);
      fetchSessions(0);
    }
  }, [user?.id, refreshTrigger]);

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

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Sessions</h2>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_auto] gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          <div>Date</div>
          <div>Stake</div>
          <div>Hands</div>
          <div className="text-right">Win</div>
          <div className="text-right">Pts/100</div>
          <div className="w-12 text-center">Act</div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {sessions.map((session) => (
            <div key={session.id} className="grid grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr_auto] gap-2 px-4 py-3 items-center text-xs text-zinc-700 dark:text-zinc-300">
              <div>{formatDate(session.end_time!)}</div>
              <div>{session.stake}</div>
              <div>{session.hands_played}</div>
              
              <div className={`text-right font-semibold ${session.pnl! > 0 ? 'text-green-600 dark:text-green-500' : session.pnl! < 0 ? 'text-red-600 dark:text-red-500' : ''}`}>
                {session.pnl! > 0 ? '+' : ''}{session.pnl}
              </div>
              
              <div className={`text-right font-semibold ${session.pt_winrate! > 0 ? 'text-green-600 dark:text-green-500' : session.pt_winrate! < 0 ? 'text-red-600 dark:text-red-500' : ''}`}>
                {session.pt_winrate! > 0 ? '+' : ''}{session.pt_winrate}
              </div>
              
              <div className="w-12 flex justify-between items-center text-zinc-400">
                <button onClick={() => setEditingSession(session)} className="hover:text-blue-500 p-1">✏️</button>
                <button onClick={() => handleDelete(session.id)} className="hover:text-red-500 p-1">🗑️</button>
              </div>
            </div>
          ))}
          
          {sessions.length === 0 && !loading && (
            <div className="p-8 text-center text-sm text-zinc-500">No sessions recorded yet.</div>
          )}
        </div>
      </div>

      {hasMore && (
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <button 
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchSessions(nextPage);
            }}
            disabled={loading}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <EditSessionModal 
        session={editingSession} 
        onClose={() => setEditingSession(null)} 
        onSaved={() => {
          fetchSessions(0);
          setPage(0);
        }} 
      />
    </div>
  );
}
