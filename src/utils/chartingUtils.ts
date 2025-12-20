/**
 * Simple charting utilities for analytics visualization
 * Since react-native doesn't have native chart libraries, 
 * we provide basic SVG-based alternatives
 */

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

/**
 * Calculate statistics from trade data
 */
export function calculateChartData(trades: any[]): ChartData[] {
  if (!trades || trades.length === 0) {
    return [];
  }

  // Group trades by status (e.g., win, loss, pending)
  const groupedByStatus = trades.reduce(
    (acc, trade) => {
      const status = trade.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const colors: Record<string, string> = {
    win: '#10b981',
    loss: '#ef4444',
    pending: '#f59e0b',
    unknown: '#9ca3af',
  };

  return Object.entries(groupedByStatus).map(([status, count]) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: count as number,
    color: colors[status] || '#6b7280',
  }));
}

/**
 * Calculate win/loss ratio
 */
export function calculateWinLossRatio(trades: any[]): {
  wins: number;
  losses: number;
  ratio: string;
} {
  if (!trades || trades.length === 0) {
    return { wins: 0, losses: 0, ratio: '0:0' };
  }

  let wins = 0;
  let losses = 0;

  trades.forEach((t: any) => {
    const statusRaw = t.status ?? t.result ?? null;
    const pnl = typeof t.pnl === 'number' ? t.pnl : null;

    if (statusRaw) {
      const s = String(statusRaw).toLowerCase();
      if (s === 'win' || s === 'won') wins++;
      else if (s === 'loss' || s === 'lost' || s === 'losses') losses++;
    } else if (pnl !== null) {
      if (pnl > 0) wins++;
      else if (pnl < 0) losses++;
    }
  });

  return {
    wins,
    losses,
    ratio: `${wins}:${losses}`,
  };
}

/**
 * Calculate profit/loss statistics
 */
export function calculatePnL(trades: any[]): {
  totalPnL: number;
  avgPnL: number;
  winningTrades: number;
  losingTrades: number;
} {
  if (!trades || trades.length === 0) {
    return { totalPnL: 0, avgPnL: 0, winningTrades: 0, losingTrades: 0 };
  }

  let totalPnL = 0;
  let winningTrades = 0;
  let losingTrades = 0;

  trades.forEach((trade: any) => {
    if (typeof trade.pnl === 'number') {
      totalPnL += trade.pnl;
      if (trade.pnl > 0) winningTrades++;
      else if (trade.pnl < 0) losingTrades++;
      return;
    }

    // Fallback: derive PnL from riskAmount + riskToReward + result/status
    const risk = typeof trade.riskAmount === 'number' ? trade.riskAmount : (typeof trade.risk === 'number' ? trade.risk : 0);
    const rr = typeof trade.riskToReward === 'number' ? trade.riskToReward : (typeof trade.riskRatio === 'number' ? trade.riskRatio : 0);
    const statusRaw = trade.status ?? trade.result ?? null;
    const res = statusRaw ? String(statusRaw).toLowerCase() : '';

    if (res === 'win' || res === 'won') {
      // profit = risk * rr (if rr available) otherwise assume 1:1
      const profit = risk * (rr || 1);
      totalPnL += profit;
      winningTrades++;
    } else if (res === 'loss' || res === 'lost') {
      totalPnL -= risk;
      losingTrades++;
    }
  });

  const avgPnL = trades.length > 0 ? totalPnL / trades.length : 0;

  return {
    totalPnL: Math.round(totalPnL * 100) / 100,
    avgPnL: Math.round(avgPnL * 100) / 100,
    winningTrades,
    losingTrades,
  };
}
