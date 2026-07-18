// types/database.ts

export type SessionStatus = 'in_progress' | 'completed';
export type GameType = 'reg' | 'prog' | '2-7';

export interface PokerSession {
  id: string;
  telegram_id: string;
  status: SessionStatus;
  
  // Base Inputs
  stake: number;
  game: GameType;
  opponent_1?: string | null;
  opponent_2?: string | null;
  start_stack: number;
  end_stack?: number | null;
  hands_played?: number | null;
  start_time: string;
  end_time?: string | null;
  created_at: string;

  // Calculated Stats
  hours_played?: number | null;
  pnl?: number | null;
  pts?: number | null;
  pt_winrate?: number | null;
  chip_winrate?: number | null;
  hands_per_hour?: number | null;
  chips_per_hour?: number | null;
  pts_per_hour?: number | null;
}
