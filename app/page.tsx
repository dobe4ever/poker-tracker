// // app/page.tsx

// "use client";
// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase";
// import { useTelegram } from "@/components/TelegramProvider";
// import { PokerSession } from "@/types/database";

// import Header from "@/components/Header";
// import StartSessionModal from "@/components/StartSessionModal";
// import ActiveSession from "@/components/ActiveSession";
// import SessionsTable from "@/components/SessionsTable";
// import TotalsBoxes from "@/components/TotalsBoxes";
// import ChartWidget, { FilterState } from "@/components/ChartWidget";

// export default function Home() {
//   const { user } = useTelegram();
//   const [isStartModalOpen, setIsStartModalOpen] = useState(false);
//   const [activeSessions, setActiveSessions] = useState<PokerSession[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
  
//   // Initialize filter state
//   const [filters, setFilters] = useState<FilterState>({
//     userId: "all", // Defaults to all, will auto-adjust to logged in user below
//     game: "all",
//     stake: "all",
//     opponent: "all"
//   });

//   // Automatically default filter to the logged-in user once their Telegram data loads
//   useEffect(() => {
//     if (user?.id) {
//       setFilters(prev => ({ ...prev, userId: user.id.toString() }));
//     }
//   }, [user?.id]);

//   const fetchActiveSessions = async () => {
//     if (!user?.id) return;
    
//     const { data, error } = await supabase
//       .from("sessions")
//       .select("*")
//       .eq("telegram_id", user.id.toString())
//       .eq("status", "in_progress")
//       .order("created_at", { ascending: false });

//     if (!error && data) {
//       setActiveSessions(data as PokerSession[]);
//     } else {
//       setActiveSessions([]);
//     }
//     setIsLoading(false);
//   };

//   useEffect(() => {
//     if (user?.id) {
//       fetchActiveSessions();
//     }
//   }, [user?.id]);

//   return (
//     <div className="flex flex-col h-screen w-full overflow-hidden">
//       <Header onAddClick={() => setIsStartModalOpen(true)} />
      
//       <main className="flex-1 overflow-y-auto pt-20 pb-8 px-4 space-y-3 w-full max-w-md mx-auto">
        
//         {/* 1. Totals Boxes */}
//         <TotalsBoxes refreshTrigger={refreshTrigger} filters={filters} />

//         {/* 2. Chart Widget */}
//         <ChartWidget refreshTrigger={refreshTrigger} filters={filters} setFilters={setFilters} />

//         {/* 3. Active Sessions */}
//         {!isLoading && activeSessions.length > 0 && (
//           <div className="space-y-2">
//             {activeSessions.map((session) => (
//               <ActiveSession 
//                 key={session.id}
//                 session={session} 
//                 onSessionUpdated={fetchActiveSessions}
//                 onSessionEnded={() => setRefreshTrigger(prev => prev + 1)} 
//               />
//             ))}
//           </div>
//         )}
        
//         {/* 4. Sessions Table */}
//         <SessionsTable refreshTrigger={refreshTrigger} filters={filters} />
        
//       </main>

//       <StartSessionModal 
//         isOpen={isStartModalOpen} 
//         onClose={() => setIsStartModalOpen(false)}
//         onSessionStarted={fetchActiveSessions}
//       />
//     </div>
//   );
// }



// app/page.tsx

"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useTelegram } from "@/components/TelegramProvider";
import { PokerSession } from "@/types/database";

import Header from "@/components/Header";
import StartSessionModal from "@/components/StartSessionModal";
import ActiveSession from "@/components/ActiveSession";
import SessionsTable from "@/components/SessionsTable";
import TotalsBoxes from "@/components/TotalsBoxes";
import ChartWidget, { FilterState } from "@/components/ChartWidget";

export default function Home() {
  const { user } = useTelegram();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [activeSessions, setActiveSessions] = useState<PokerSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    userId: "all", // Defaults to all, will auto-adjust to logged in user below
    game: "all",
    stake: "all",
    opponent: "all"
  });

  // Automatically default filter to the logged-in user once their Telegram data loads
  useEffect(() => {
    if (user?.id) {
      setFilters(prev => ({ ...prev, userId: user.id.toString() }));
    }
  }, [user?.id]);

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
    <div className="flex flex-col h-screen w-full overflow-hidden" style={{ backgroundColor: "var(--surface-0)" }}>
      <Header onAddClick={() => setIsStartModalOpen(true)} />

      <main className="flex-1 overflow-y-auto pt-20 pb-10 px-4 space-y-4 w-full max-w-md mx-auto">

        {/* 1. Totals Boxes */}
        <TotalsBoxes refreshTrigger={refreshTrigger} filters={filters} />

        {/* 2. Chart Widget */}
        <ChartWidget refreshTrigger={refreshTrigger} filters={filters} setFilters={setFilters} />

        {/* 3. Active Sessions */}
        {!isLoading && activeSessions.length > 0 && (
          <div className="space-y-2.5">
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

        {/* 4. Sessions Table */}
        <SessionsTable refreshTrigger={refreshTrigger} filters={filters} />

      </main>

      <StartSessionModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onSessionStarted={fetchActiveSessions}
      />
    </div>
  );
}
