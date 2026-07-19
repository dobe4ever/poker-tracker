// app/page.tsx

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegram } from "@/components/TelegramProvider";
import { PokerSession } from "@/types/database";

import Header from "@/components/Header";
import Widget from "@/components/Widget";
import StartSessionModal from "@/components/StartSessionModal";
import ActiveSession from "@/components/ActiveSession";
import SessionsTable from "@/components/SessionsTable";

export default function Home() {
  const { user } = useTelegram();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [activeSessions, setActiveSessions] = useState<PokerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Global refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchActiveSessions = async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("telegram_id", user.id.toString())
      .eq("status", "in_progress")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setActiveSessions(data as PokerSession[]);
    } else {
      setActiveSessions([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchActiveSessions();
    }
  }, [user?.id]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header onAddClick={() => setIsStartModalOpen(true)} />
      
      <main className="flex-1 overflow-y-auto pt-20 pb-8 px-4 space-y-4 w-full max-w-md mx-auto">
        
        {/* 1. Totals Boxes Placeholder */}
        <Widget title="Totals Boxes" />

        {/* 2. Filters Bar Placeholder */}
        <Widget title="Filters Bar" />

        {/* 3. Chart Placeholder */}
        <Widget title="Chart" />

        {/* 4. Active Sessions (Trello Cards) */}
        {!isLoading && activeSessions.length > 0 && (
          <div className="space-y-2">
            {activeSessions.map((session) => (
              <ActiveSession 
                key={session.id}
                session={session} 
                onSessionUpdated={fetchActiveSessions}
                onSessionEnded={() => setRefreshTrigger(prev => prev + 1)} 
              />
            ))}
          </div>
        )}
        
        {/* 5. Sessions Table */}
        <SessionsTable refreshTrigger={refreshTrigger} />
        
      </main>

      <StartSessionModal 
        isOpen={isStartModalOpen} 
        onClose={() => setIsStartModalOpen(false)}
        onSessionStarted={fetchActiveSessions}
      />
    </div>
  );
}
