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
      
      <main className="flex-1 overflow-y-auto pt-20 pb-8 px-4 space-y-6 w-full max-w-md mx-auto">
        
        {!isLoading && activeSessions.map((session) => (
          <ActiveSession 
            key={session.id}
            session={session} 
            onSessionUpdated={fetchActiveSessions} 
          />
        ))}

        <Widget title="Totals Boxes" />
        <Widget title="Charts" />
        
        {/* Replaced the placeholder with the actual table */}
        <SessionsTable />
        
      </main>

      <StartSessionModal 
        isOpen={isStartModalOpen} 
        onClose={() => setIsStartModalOpen(false)}
        onSessionStarted={fetchActiveSessions}
      />
    </div>
  );
}
