// // components/EditSessionModal.tsx

// "use client";
// import { useState } from "react";
// import { supabase } from "@/lib/supabase";
// import { PokerSession, GameType } from "@/types/database";
// import { calculateSessionStats } from "@/lib/calculations";

// interface Props {
//   session: PokerSession | null;
//   onClose: () => void;
//   onSaved: () => void;
// }

// const STAKES = [0.25, 1, 2, 5, 10, 25, 50];
// const GAMES: GameType[] = ["reg", "prog", "2-7"];

// export default function EditSessionModal({ session, onClose, onSaved }: Props) {
//   if (!session) return null;

//   const [stake, setStake] = useState<number>(session.stake);
//   const [game, setGame] = useState<GameType>(session.game);
//   const [rake, setRake] = useState<number>(session.rake_percent || 4);
//   const [startStack, setStartStack] = useState<number>(session.start_stack);
//   const [endStack, setEndStack] = useState<number>(session.end_stack || 0);
//   const [handsPlayed, setHandsPlayed] = useState<number>(session.hands_played || 0);
//   const [opp1, setOpp1] = useState(session.opponent_1 || "");
//   const [opp2, setOpp2] = useState(session.opponent_2 || "");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSave = async () => {
//     if (handsPlayed <= 0) {
//       return alert("Hands played must be greater than 0");
//     }

//     setIsSubmitting(true);

//     const stats = calculateSessionStats({
//       startStack,
//       endStack,
//       handsPlayed,
//       startTime: session.start_time,
//       endTime: session.end_time || new Date().toISOString(),
//       stake,
//       rakePercent: rake,
//     });

//     const { error } = await supabase
//       .from("sessions")
//       .update({
//         stake,
//         game,
//         rake_percent: rake,
//         start_stack: startStack,
//         end_stack: endStack,
//         hands_played: handsPlayed,
//         opponent_1: opp1 || null,
//         opponent_2: opp2 || null,
//         ...stats
//       })
//       .eq("id", session.id);

//     setIsSubmitting(false);

//     if (error) {
//       console.error(error);
//       alert("Error updating session");
//     } else {
//       onSaved();
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
//       <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-sm p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
//         <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Edit Session</h2>
        
//         <div className="space-y-4">
//           <div className="flex gap-3">
//             <div className="flex-1">
//               <label className="block text-xs font-semibold text-zinc-500 mb-1">STAKE</label>
//               <select value={stake} onChange={(e) => setStake(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none">
//                 {STAKES.map(s => <option key={s} value={s}>{s}pp</option>)}
//               </select>
//             </div>
//             <div className="flex-1">
//               <label className="block text-xs font-semibold text-zinc-500 mb-1">GAME</label>
//               <select value={game} onChange={(e) => setGame(e.target.value as GameType)} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none">
//                 {GAMES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
//               </select>
//             </div>
//             <div className="w-20">
//               <label className="block text-xs font-semibold text-zinc-500 mb-1">RAKE %</label>
//               <input type="number" value={rake} onChange={(e) => setRake(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <div className="flex-1">
//               <label className="block text-xs font-semibold text-zinc-500 mb-1">START STACK</label>
//               <input type="number" value={startStack} onChange={(e) => setStartStack(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
//             </div>
//             <div className="flex-1">
//               <label className="block text-xs font-semibold text-zinc-500 mb-1">END STACK</label>
//               <input type="number" value={endStack} onChange={(e) => setEndStack(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-zinc-500 mb-1">HANDS PLAYED</label>
//             <input type="number" value={handsPlayed} onChange={(e) => setHandsPlayed(Number(e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
//           </div>

//           <div className="flex gap-4">
//             <div className="flex-1">
//               <label className="block text-xs font-semibold text-zinc-500 mb-1">OPPONENT 1</label>
//               <input type="text" value={opp1} onChange={(e) => setOpp1(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
//             </div>
//             <div className="flex-1">
//               <label className="block text-xs font-semibold text-zinc-500 mb-1">OPPONENT 2</label>
//               <input type="text" value={opp2} onChange={(e) => setOpp2(e.target.value)} className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2.5 text-sm outline-none" />
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button onClick={onClose} className="flex-1 py-2.5 rounded-lg font-semibold text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300">Cancel</button>
//           <button onClick={handleSave} disabled={isSubmitting} className="flex-1 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
//             {isSubmitting ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// components/EditSessionModal.tsx

"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { PokerSession, GameType } from "@/types/database";
import { calculateSessionStats } from "@/lib/calculations";

interface Props {
  session: PokerSession | null;
  onClose: () => void;
  onSaved: () => void;
}

const STAKES = [0.25, 1, 2, 5, 10, 25, 50];
const GAMES: GameType[] = ["reg", "prog", "2-7"];

export default function EditSessionModal({ session, onClose, onSaved }: Props) {
  if (!session) return null;

  const [stake, setStake] = useState<number>(session.stake);
  const [game, setGame] = useState<GameType>(session.game);
  const [rake, setRake] = useState<number>(session.rake_percent || 4);
  const [startStack, setStartStack] = useState<number>(session.start_stack);
  const [endStack, setEndStack] = useState<number>(session.end_stack || 0);
  const [handsPlayed, setHandsPlayed] = useState<number>(session.hands_played || 0);
  const [opp1, setOpp1] = useState(session.opponent_1 || "");
  const [opp2, setOpp2] = useState(session.opponent_2 || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (handsPlayed <= 0) {
      return alert("Hands played must be greater than 0");
    }

    setIsSubmitting(true);

    const stats = calculateSessionStats({
      startStack,
      endStack,
      handsPlayed,
      startTime: session.start_time,
      endTime: session.end_time || new Date().toISOString(),
      stake,
      rakePercent: rake,
    });

    const { error } = await supabase
      .from("sessions")
      .update({
        stake,
        game,
        rake_percent: rake,
        start_stack: startStack,
        end_stack: endStack,
        hands_played: handsPlayed,
        opponent_1: opp1 || null,
        opponent_2: opp2 || null,
        ...stats
      })
      .eq("id", session.id);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Error updating session");
    } else {
      onSaved();
      onClose();
    }
  };

  const labelCls = "block text-[11px] font-semibold uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "var(--text-tertiary)" };
  const inputCls = "w-full rounded-lg p-2.5 text-sm outline-none";
  const inputStyle = { backgroundColor: "var(--surface-2)", color: "var(--text-primary)", border: "1px solid var(--surface-3)" };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div
        className="rounded-2xl w-full max-w-sm p-6"
        style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--surface-3)", boxShadow: "var(--shadow-modal)" }}
      >
        <h2 className="text-[17px] font-semibold mb-5" style={{ color: "var(--text-primary)" }}>Edit session</h2>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelCls} style={labelStyle}>Stake</label>
              <select value={stake} onChange={(e) => setStake(Number(e.target.value))} className={`num ${inputCls}`} style={inputStyle}>
                {STAKES.map(s => <option key={s} value={s}>{s}pp</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelCls} style={labelStyle}>Game</label>
              <select value={game} onChange={(e) => setGame(e.target.value as GameType)} className={inputCls} style={inputStyle}>
                {GAMES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="w-20">
              <label className={labelCls} style={labelStyle}>Rake %</label>
              <input type="number" value={rake} onChange={(e) => setRake(Number(e.target.value))} className={`num ${inputCls}`} style={inputStyle} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelCls} style={labelStyle}>Start stack</label>
              <input type="number" value={startStack} onChange={(e) => setStartStack(Number(e.target.value))} className={`num ${inputCls}`} style={inputStyle} />
            </div>
            <div className="flex-1">
              <label className={labelCls} style={labelStyle}>End stack</label>
              <input type="number" value={endStack} onChange={(e) => setEndStack(Number(e.target.value))} className={`num ${inputCls}`} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className={labelCls} style={labelStyle}>Hands played</label>
            <input type="number" value={handsPlayed} onChange={(e) => setHandsPlayed(Number(e.target.value))} className={`num ${inputCls}`} style={inputStyle} />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelCls} style={labelStyle}>Opponent 1</label>
              <input type="text" value={opp1} onChange={(e) => setOpp1(e.target.value)} className={inputCls} style={inputStyle} />
            </div>
            <div className="flex-1">
              <label className={labelCls} style={labelStyle}>Opponent 2</label>
              <input type="text" value={opp2} onChange={(e) => setOpp2(e.target.value)} className={inputCls} style={inputStyle} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors"
            style={{ backgroundColor: "var(--surface-2)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
            style={{ backgroundColor: "var(--accent)", color: "#fff" }}
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
