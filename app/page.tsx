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

export default function Home() {
  const { user } = useTelegram();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<PokerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveSession = async () => {
    if (!user?.id) return;
    
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("telegram_id", user.id.toString())
      .eq("status", "in_progress")
      .single();

    if (!error && data) {
      setActiveSession(data as PokerSession);
    } else {
      setActiveSession(null);
    }
    setIsLoading(false);
  };

  // Fetch session when Telegram user loads
  useEffect(() => {
    if (user?.id) {
      fetchActiveSession();
    }
  }, [user?.id]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Header onAddClick={() => setIsStartModalOpen(true)} />
      
      <main className="flex-1 overflow-y-auto pt-20 pb-8 px-4 space-y-6 w-full max-w-md mx-auto">
        
        {/* Show Active Session if it exists, otherwise show loading/nothing */}
        {!isLoading && activeSession && (
          <ActiveSession 
            session={activeSession} 
            onSessionUpdated={fetchActiveSession} 
          />
        )}

        {/* Placeholders for the other widgets we will build next */}
        <Widget title="Totals Boxes" />
        <Widget title="Charts" />
        <Widget title="Sessions Table" />
      </main>

      <StartSessionModal 
        isOpen={isStartModalOpen} 
        onClose={() => setIsStartModalOpen(false)}
        onSessionStarted={fetchActiveSession}
      />
    </div>
  );
}
