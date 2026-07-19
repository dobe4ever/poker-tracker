// lib/calculations.ts

interface SessionMathInputs {
  startStack: number;
  endStack: number;
  handsPlayed: number;
  startTime: string;
  endTime: string;
  stake: number;
  rakePercent: number;
}

export function calculateSessionStats(inputs: SessionMathInputs) {
  const { startStack, endStack, handsPlayed, startTime, endTime, stake, rakePercent } = inputs;

  // 1. P&L
  const pnl = endStack - startStack;

  // 2. Hours Played
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const hoursPlayed = (end - start) / (1000 * 60 * 60);

  // 3. Points (OFC Logic: Rake only applied to wins)
  let pts = 0;
  if (pnl >= 0) {
    const rakeMultiplier = stake * (1 - rakePercent / 100);
    pts = pnl / rakeMultiplier;
  } else {
    pts = pnl / stake;
  }

  // 4. Winrates (Per 100 Hands)
  const pt_winrate = handsPlayed > 0 ? (pts / handsPlayed) * 100 : 0;
  const chip_winrate = handsPlayed > 0 ? (pnl / handsPlayed) * 100 : 0;

  // 5. Hourly Rates
  const hands_per_hour = hoursPlayed > 0 ? handsPlayed / hoursPlayed : 0;
  const chips_per_hour = hoursPlayed > 0 ? pnl / hoursPlayed : 0;
  const pts_per_hour = hoursPlayed > 0 ? pts / hoursPlayed : 0;

  return {
    pnl: Number(pnl.toFixed(2)),
    hours_played: Number(hoursPlayed.toFixed(4)),
    pts: Number(pts.toFixed(2)),
    pt_winrate: Number(pt_winrate.toFixed(2)),
    chip_winrate: Number(chip_winrate.toFixed(2)),
    hands_per_hour: Number(hands_per_hour.toFixed(0)),
    chips_per_hour: Number(chips_per_hour.toFixed(2)),
    pts_per_hour: Number(pts_per_hour.toFixed(2)),
  };
}
