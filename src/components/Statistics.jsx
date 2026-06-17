import React, { useMemo } from 'react';
import { Award, Frown, TrendingUp, TrendingDown, Percent, BarChart } from 'lucide-react';

export default function Statistics({ trades, onLoadDemoData }) {
  const stats = useMemo(() => {
    if (trades.length === 0) {
      return {
        total: 0,
        winsCount: 0,
        lossesCount: 0,
        breakevensCount: 0,
        totalProfit: 0,
        totalLoss: 0,
        netPnL: 0,
        winRate: 0,
        bestTrade: null,
        worstTrade: null,
        profitFactor: 0,
      };
    }

    const total = trades.length;
    const wins = trades.filter((t) => t.pnl > 0);
    const losses = trades.filter((t) => t.pnl < 0);
    const breakevens = trades.filter((t) => t.pnl === 0);

    const totalProfit = wins.reduce((sum, t) => sum + t.pnl, 0);
    const totalLoss = losses.reduce((sum, t) => sum + t.pnl, 0);
    const netPnL = totalProfit + totalLoss;

    const winRate = (wins.length / total) * 100;

    // Find best and worst trade objects
    let bestTrade = trades[0];
    let worstTrade = trades[0];

    trades.forEach((t) => {
      if (t.pnl > bestTrade.pnl) bestTrade = t;
      if (t.pnl < worstTrade.pnl) worstTrade = t;
    });

    // Profit Factor = Total Profit / Absolute Total Loss
    const absLoss = Math.abs(totalLoss);
    const profitFactor = absLoss > 0 ? totalProfit / absLoss : totalProfit > 0 ? Infinity : 0;

    return {
      total,
      winsCount: wins.length,
      lossesCount: losses.length,
      breakevensCount: breakevens.length,
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      totalLoss: parseFloat(totalLoss.toFixed(2)),
      netPnL: parseFloat(netPnL.toFixed(2)),
      winRate: parseFloat(winRate.toFixed(1)),
      bestTrade,
      worstTrade,
      profitFactor: parseFloat(profitFactor.toFixed(2)),
    };
  }, [trades]);

  // SVG circular gauge variables
  const strokeWidth = 8;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.winRate / 100) * circumference;

  return (
    <div className="statistics-view animate-fade-in">
      <div className="view-header">
        <div>
          <h2>Performance Analytics</h2>
          <p className="view-subtitle">Detailed breakdown of profit metrics, win distributions, and performance ratios.</p>
        </div>
      </div>

      {trades.length === 0 ? (
        <div className="card empty-state py-5 flex-center" style={{ flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
          <BarChart size={48} className="text-muted mb-2" />
          <p>No trading data available. Add some trades in your journal to calculate statistics.</p>
          <button className="btn btn-secondary btn-sm mt-2" onClick={onLoadDemoData} id="stats-load-demo-btn">
            ⚡ Load Demo Data
          </button>
        </div>
      ) : (
        <div className="stats-layout">
          {/* Left Column: Key Stats and Gauge */}
          <div className="stats-main-card card">
            <div className="card-header">
              <h3>Win/Loss Distribution</h3>
              <span className="card-tag">Ratio Analysis</span>
            </div>

            <div className="gauge-section">
              {/* Circular SVG Gauge */}
              <div className="gauge-container">
                <svg className="gauge-svg" width="120" height="120" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="var(--border-color)"
                    strokeWidth={strokeWidth}
                  />
                  {/* Dynamic Progress Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="gauge-ring"
                  />
                  {/* Center Text */}
                  <text x="50" y="52" textAnchor="middle" className="gauge-text-val">
                    {stats.winRate}%
                  </text>
                  <text x="50" y="68" textAnchor="middle" className="gauge-text-lbl">
                    Win Rate
                  </text>
                </svg>
              </div>

              {/* Legend and details */}
              <div className="gauge-legend">
                <div className="legend-item">
                  <div className="legend-marker win"></div>
                  <div className="legend-info">
                    <span className="legend-label">Winning Trades</span>
                    <span className="legend-val font-semibold text-profit">
                      {stats.winsCount} ({((stats.winsCount / stats.total) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>

                <div className="legend-item">
                  <div className="legend-marker loss"></div>
                  <div className="legend-info">
                    <span className="legend-label">Losing Trades</span>
                    <span className="legend-val font-semibold text-loss">
                      {stats.lossesCount} ({((stats.lossesCount / stats.total) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>

                {stats.breakevensCount > 0 && (
                  <div className="legend-item">
                    <div className="legend-marker breakeven"></div>
                    <div className="legend-info">
                      <span className="legend-label">Breakeven Trades</span>
                      <span className="legend-val font-semibold text-muted">
                        {stats.breakevensCount} ({((stats.breakevensCount / stats.total) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Financial Cards */}
          <div className="stats-details-grid">
            {/* Profit Card */}
            <div className="metric-card card profit-details">
              <div className="metric-icon profit">
                <TrendingUp size={22} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Total Gross Profit</span>
                <span className="metric-value text-profit">${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Loss Card */}
            <div className="metric-card card loss-details">
              <div className="metric-icon loss">
                <TrendingDown size={22} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Total Gross Loss</span>
                <span className="metric-value text-loss">${stats.totalLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Profit Factor */}
            <div className="metric-card card ratio-details">
              <div className="metric-icon avg">
                <Percent size={22} />
              </div>
              <div className="metric-content">
                <span className="metric-label">Profit Factor</span>
                <span className="metric-value font-semibold">
                  {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                </span>
                <span className="metric-subtext">Gross Profit / Gross Loss</span>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Best / Worst Trade Highlights */}
          <div className="outliers-grid">
            {/* Best Trade Card */}
            <div className="outlier-card card best-trade-card">
              <div className="card-header border-none">
                <div className="outlier-icon-wrapper win">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="outlier-title">Best Trade</h3>
                  <span className="outlier-subtitle">Highest PnL recorded</span>
                </div>
              </div>

              {stats.bestTrade && (
                <div className="outlier-body">
                  <div className="outlier-pnl text-profit">
                    +${stats.bestTrade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="outlier-info-grid">
                    <div className="outlier-info-item">
                      <span className="lbl">Asset</span>
                      <span className="val asset-tag">{stats.bestTrade.asset}</span>
                    </div>
                    <div className="outlier-info-item">
                      <span className="lbl">Type</span>
                      <span className={`val badge ${stats.bestTrade.type.toLowerCase()}`}>{stats.bestTrade.type}</span>
                    </div>
                    <div className="outlier-info-item">
                      <span className="lbl">Date</span>
                      <span className="val">{stats.bestTrade.date}</span>
                    </div>
                    <div className="outlier-info-item">
                      <span className="lbl">Quantity</span>
                      <span className="val">{stats.bestTrade.quantity}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Worst Trade Card */}
            <div className="outlier-card card worst-trade-card">
              <div className="card-header border-none">
                <div className="outlier-icon-wrapper loss">
                  <Frown size={24} />
                </div>
                <div>
                  <h3 className="outlier-title">Worst Trade</h3>
                  <span className="outlier-subtitle">Lowest PnL recorded</span>
                </div>
              </div>

              {stats.worstTrade && (
                <div className="outlier-body">
                  <div className="outlier-pnl text-loss">
                    ${stats.worstTrade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="outlier-info-grid">
                    <div className="outlier-info-item">
                      <span className="lbl">Asset</span>
                      <span className="val asset-tag">{stats.worstTrade.asset}</span>
                    </div>
                    <div className="outlier-info-item">
                      <span className="lbl">Type</span>
                      <span className={`val badge ${stats.worstTrade.type.toLowerCase()}`}>{stats.worstTrade.type}</span>
                    </div>
                    <div className="outlier-info-item">
                      <span className="lbl">Date</span>
                      <span className="val">{stats.worstTrade.date}</span>
                    </div>
                    <div className="outlier-info-item">
                      <span className="lbl">Quantity</span>
                      <span className="val">{stats.worstTrade.quantity}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
