import React, { useMemo } from 'react';
import { BarChart2, TrendingUp, TrendingDown, Percent, DollarSign, Activity, ChevronRight } from 'lucide-react';

export default function Dashboard({ trades, setActiveView, onAddTradeClick, onLoadDemoData }) {
  // Calculations
  const stats = useMemo(() => {
    const total = trades.length;
    const wins = trades.filter((t) => t.pnl > 0).length;
    const losses = trades.filter((t) => t.pnl < 0).length;
    
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    const netPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    const avgPnL = total > 0 ? netPnL / total : 0;

    return {
      total,
      wins,
      losses,
      winRate: parseFloat(winRate.toFixed(1)),
      netPnL: parseFloat(netPnL.toFixed(2)),
      avgPnL: parseFloat(avgPnL.toFixed(2)),
    };
  }, [trades]);

  // Cumulative PnL for Chart
  const chartData = useMemo(() => {
    if (trades.length === 0) return [];
    
    // Sort trades ascending by date
    const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let sum = 0;
    const data = [{ date: 'Start', cumulative: 0 }];
    
    sorted.forEach((t) => {
      sum += t.pnl;
      data.push({
        date: t.date,
        cumulative: parseFloat(sum.toFixed(2)),
      });
    });
    
    return data;
  }, [trades]);

  // Recent Trades (max 5)
  const recentTrades = useMemo(() => {
    return [...trades]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [trades]);

  // Custom SVG Chart rendering math
  const svgChart = useMemo(() => {
    if (chartData.length < 2) return null;

    const width = 600;
    const height = 220;
    const padding = 30;

    const values = chartData.map((d) => d.cumulative);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal;

    const getX = (index) => {
      return padding + (index / (chartData.length - 1)) * (width - padding * 2);
    };

    const getY = (val) => {
      if (range === 0) return height / 2;
      // Subtract from height - padding because SVG y starts from top
      return height - padding - ((val - minVal) / range) * (height - padding * 2);
    };

    // Construct path coordinates
    const points = chartData.map((d, i) => `${getX(i)},${getY(d.cumulative)}`);
    const linePath = `M ${points.join(' L ')}`;
    
    // Filled path coordinates
    const zeroY = getY(0);
    // Boundary of fill path goes down to zero line or chart bottom
    // We will clip it to the bottom of the chart area for visual consistency
    const bottomY = height - padding;
    const fillPath = `M ${getX(0)},${bottomY} L ${points.join(' L ')} L ${getX(chartData.length - 1)},${bottomY} Z`;

    const gridLinesCount = 4;
    const gridLines = Array.from({ length: gridLinesCount }, (_, i) => {
      const ratio = i / (gridLinesCount - 1);
      const val = minVal + ratio * range;
      const y = getY(val);
      return { y, val: val.toFixed(0) };
    });

    return {
      width,
      height,
      linePath,
      fillPath,
      gridLines,
      points: chartData.map((d, i) => ({
        x: getX(i),
        y: getY(d.cumulative),
        cumulative: d.cumulative,
        date: d.date,
      })),
      isProfit: stats.netPnL >= 0,
    };
  }, [chartData, stats.netPnL]);

  if (trades.length === 0) {
    return (
      <div className="dashboard-view animate-fade-in">
        <div className="view-header">
          <div>
            <h2>Trading Dashboard</h2>
            <p className="view-subtitle">Get started by entering your trading history.</p>
          </div>
        </div>

        <div className="card welcome-card py-5 flex-center" style={{ flexDirection: 'column', gap: '20px', textAlign: 'center', alignItems: 'center' }}>
          <div className="metric-icon total" style={{ width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={32} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 800 }}>Welcome to HeroTrader</h3>
          <p style={{ maxWidth: '500px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Your trading journal is currently empty. Start logging your trades manually or load our curated sample data to explore the dashboard metrics and visual analytics.
          </p>
          <div className="flex-center gap-2 mt-3" style={{ flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={onAddTradeClick} id="welcome-add-trade-btn">
              + Log Your First Trade
            </button>
            <button className="btn btn-secondary" onClick={onLoadDemoData} id="welcome-load-demo-btn">
              ⚡ Load Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-view animate-fade-in">
      <div className="view-header">
        <div>
          <h2>Trading Dashboard</h2>
          <p className="view-subtitle">Overview of your lifetime trading stats and equity curve.</p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="metrics-grid">
        {/* Card 1: Total Trades */}
        <div className="metric-card card">
          <div className="metric-icon total">
            <BarChart2 size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Total Trades</span>
            <span className="metric-value">{stats.total}</span>
          </div>
        </div>

        {/* Card 2: Net PnL */}
        <div className="metric-card card">
          <div className={`metric-icon ${stats.netPnL >= 0 ? 'profit' : 'loss'}`}>
            <DollarSign size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Net Profit/Loss</span>
            <span className={`metric-value ${stats.netPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
              {stats.netPnL >= 0 ? '+' : ''}${stats.netPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Card 3: Win Rate */}
        <div className="metric-card card">
          <div className="metric-icon win-rate">
            <Percent size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Win Rate</span>
            <span className="metric-value">{stats.winRate}%</span>
          </div>
        </div>

        {/* Card 4: Winning Trades */}
        <div className="metric-card card">
          <div className="metric-icon profit">
            <TrendingUp size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Winning Trades</span>
            <span className="metric-value text-profit">{stats.wins}</span>
          </div>
        </div>

        {/* Card 5: Losing Trades */}
        <div className="metric-card card">
          <div className="metric-icon loss">
            <TrendingDown size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Losing Trades</span>
            <span className="metric-value text-loss">{stats.losses}</span>
          </div>
        </div>

        {/* Card 6: Average PnL */}
        <div className="metric-card card">
          <div className="metric-icon avg">
            <Activity size={22} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Avg. Profit / Trade</span>
            <span className={`metric-value ${stats.avgPnL >= 0 ? 'text-profit' : 'text-loss'}`}>
              {stats.avgPnL >= 0 ? '+' : ''}${stats.avgPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Equity Chart & Recent Trades */}
      <div className="dashboard-grid">
        {/* Equity Chart Card */}
        <div className="chart-card card">
          <div className="card-header">
            <h3>Equity Curve (Cumulative PnL)</h3>
            <span className="card-tag">Growth Chart</span>
          </div>
          <div className="chart-container">
            {trades.length < 2 ? (
              <div className="chart-empty-state">
                <p>Log at least 2 trades to display your equity curve chart.</p>
                <button className="btn btn-primary btn-sm mt-3" onClick={onAddTradeClick}>
                  Log Your First Trade
                </button>
              </div>
            ) : (
              svgChart && (
                <div className="svg-wrapper">
                  <svg
                    viewBox={`0 0 ${svgChart.width} ${svgChart.height}`}
                    width="100%"
                    height="100%"
                    className="equity-svg"
                  >
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={svgChart.isProfit ? '#10b981' : '#ef4444'} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={svgChart.isProfit ? '#10b981' : '#ef4444'} stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid Lines */}
                    {svgChart.gridLines.map((line, idx) => (
                      <g key={idx}>
                        <line
                          x1="30"
                          y1={line.y}
                          x2={svgChart.width - 30}
                          y2={line.y}
                          stroke="var(--border-color)"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={25}
                          y={line.y + 4}
                          textAnchor="end"
                          fontSize="9"
                          fill="var(--text-muted)"
                          fontWeight="500"
                        >
                          ${line.val}
                        </text>
                      </g>
                    ))}

                    {/* Filled Gradient Area */}
                    <path d={svgChart.fillPath} fill="url(#chartGrad)" />

                    {/* Main Line */}
                    <path
                      d={svgChart.linePath}
                      fill="none"
                      stroke={svgChart.isProfit ? '#10b981' : '#ef4444'}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {svgChart.points.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="var(--card-bg)"
                        stroke={pt.cumulative >= 0 ? '#10b981' : '#ef4444'}
                        strokeWidth="2"
                        className="chart-dot"
                      >
                        <title>
                          Date: {pt.date}&#10;Cumulative P&amp;L: ${pt.cumulative}
                        </title>
                      </circle>
                    ))}
                  </svg>
                </div>
              )
            )}
          </div>
        </div>

        {/* Recent Trades Card */}
        <div className="recent-trades-card card">
          <div className="card-header">
            <h3>Recent Journal Entries</h3>
            <button className="text-btn flex-center gap-1" onClick={() => setActiveView('history')} id="dashboard-view-all-btn">
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="recent-list">
            {recentTrades.length === 0 ? (
              <div className="recent-empty-state">
                <p>No trades logged yet.</p>
              </div>
            ) : (
              recentTrades.map((trade) => {
                const isProfit = trade.pnl >= 0;
                return (
                  <div key={trade.id} className="recent-item">
                    <div className="recent-item-main">
                      <span className={`badge ${trade.type.toLowerCase()}`}>{trade.type}</span>
                      <div className="recent-item-info">
                        <span className="recent-item-asset">{trade.asset}</span>
                        <span className="recent-item-date">{trade.date}</span>
                      </div>
                    </div>
                    <div className="recent-item-pnl">
                      <span className={`font-semibold ${isProfit ? 'text-profit' : 'text-loss'}`}>
                        {isProfit ? '+' : ''}${trade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="recent-item-qty">{trade.quantity} unit{trade.quantity !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
