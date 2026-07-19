// // components/Header.tsx

// "use client";
// import { useTelegram } from "./TelegramProvider";

// interface HeaderProps {
//   onAddClick: () => void;
// }

// export default function Header({ onAddClick }: HeaderProps) {
//   const { user } = useTelegram();

//   return (
//     <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 text-white shadow-md z-50 flex items-center justify-between px-4">
//       <div className="font-bold text-xl tracking-tight">
//         PokerTracker
//       </div>

//       <div className="flex items-center gap-4">
//         <button 
//           onClick={onAddClick}
//           className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
//         >
//           + Add
//         </button>
        
//         <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center border border-zinc-600">
//           {user?.photo_url ? (
//             <img 
//               src={user.photo_url} 
//               alt={user.first_name} 
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <span className="text-lg font-medium text-zinc-300">
//               {user?.first_name?.charAt(0) || "U"}
//             </span>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }



// components/Header.tsx

"use client";
import { useTelegram } from "./TelegramProvider";

interface HeaderProps {
  onAddClick: () => void;
}

export default function Header({ onAddClick }: HeaderProps) {
  const { user } = useTelegram();

  return (
    <header
      className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 backdrop-blur-xl"
      style={{
        backgroundColor: "rgba(10, 11, 13, 0.85)",
        borderBottom: "1px solid var(--surface-3)",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: "var(--accent-muted)", color: "var(--accent)" }}
        >
          ♠
        </div>
        <span className="font-semibold text-[15px] tracking-tight" style={{ color: "var(--text-primary)" }}>
          Poker Tracker
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent)")}
        >
          <span className="text-base leading-none">+</span> New session
        </button>

        <div
          className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--surface-2)", border: "1px solid var(--surface-3)" }}
        >
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.first_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              {user?.first_name?.charAt(0) || "U"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
