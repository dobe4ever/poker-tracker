// components/Header.tsx

"use client";
import { useTelegram } from "./TelegramProvider";

export default function Header() {
  const { user } = useTelegram();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 text-white shadow-md z-50 flex items-center justify-between px-4">
      {/* Logo Area */}
      <div className="font-bold text-xl tracking-tight">
        PokerTracker
      </div>

      {/* Actions & Profile Area */}
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors">
          + Add
        </button>
        
        {/* Telegram Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center border border-zinc-600">
          {user?.photo_url ? (
            <img 
              src={user.photo_url} 
              alt={user.first_name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-medium text-zinc-300">
              {user?.first_name?.charAt(0) || "U"}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
