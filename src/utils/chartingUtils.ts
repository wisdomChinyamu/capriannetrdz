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

  const wins = trades.filter(t => t.status === 'win').length;
  const losses = trades.filter(t => t.status === 'loss').length;

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

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const avgPnL = trades.length > 0 ? totalPnL / trades.length : 0;
  const winningTrades = trades.filter(t => (t.pnl || 0) > 0).length;
  const losingTrades = trades.filter(t => (t.pnl || 0) < 0).length;

  return {
    totalPnL: Math.round(totalPnL * 100) / 100,
    avgPnL: Math.round(avgPnL * 100) / 100,
    winningTrades,
    losingTrades,
  };
}
