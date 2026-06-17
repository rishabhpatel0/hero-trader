import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TradeHistory from './components/TradeHistory';
import Statistics from './components/Statistics';
import TradeForm from './components/TradeForm';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

export default function App() {
  const [trades, setTrades] = useLocalStorage('herotrader_trades', []);
  const [theme, setTheme] = useLocalStorage('herotrader_theme', 'light');
  const [activeView, setActiveView] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);

  // Sync theme with HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenAddTrade = () => {
    setEditingTrade(null);
    setIsFormOpen(true);
  };

  const handleOpenEditTrade = (trade) => {
    setEditingTrade(trade);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTrade(null);
  };

  const handleSaveTrade = (tradeData) => {
    if (editingTrade) {
      // Edit existing
      setTrades((prev) => prev.map((t) => (t.id === tradeData.id ? tradeData : t)));
    } else {
      // Add new
      setTrades((prev) => [tradeData, ...prev]);
    }
  };

  const handleLoadDemoData = () => {
    const demoTrades = [
      {
        id: 'demo-1',
        date: '2026-06-10',
        asset: 'BTCUSD',
        type: 'Buy',
        entryPrice: 65200.00,
        exitPrice: 67450.00,
        quantity: 0.5,
        notes: 'Bought breakout of the weekly range. Strong volume confirmation.',
        pnl: 1125.00
      },
      {
        id: 'demo-2',
        date: '2026-06-11',
        asset: 'XAUUSD',
        type: 'Sell',
        entryPrice: 2315.50,
        exitPrice: 2302.20,
        quantity: 10,
        notes: 'Short at resistance level. Target hit at major support.',
        pnl: 133.00
      },
      {
        id: 'demo-3',
        date: '2026-06-12',
        asset: 'NIFTY',
        type: 'Buy',
        entryPrice: 23400.00,
        exitPrice: 23310.00,
        quantity: 50,
        notes: 'Long on pullback. Stopped out early.',
        pnl: -4500.00
      },
      {
        id: 'demo-4',
        date: '2026-06-14',
        asset: 'BTCUSD',
        type: 'Sell',
        entryPrice: 66800.00,
        exitPrice: 65900.00,
        quantity: 1,
        notes: 'Short near range high. Covered at mid-range support.',
        pnl: 900.00
      },
      {
        id: 'demo-5',
        date: '2026-06-15',
        asset: 'ETHUSD',
        type: 'Buy',
        entryPrice: 3520.00,
        exitPrice: 3680.00,
        quantity: 5,
        notes: 'ETH breakout above 3500 level. Strong trend momentum.',
        pnl: 800.00
      },
      {
        id: 'demo-6',
        date: '2026-06-16',
        asset: 'AAPL',
        type: 'Buy',
        entryPrice: 185.00,
        exitPrice: 181.50,
        quantity: 100,
        notes: 'Bought support bounce. Broke below stop loss level.',
        pnl: -350.00
      }
    ];
    setTrades(demoTrades);
  };

  const handleDeleteTrade = (id) => {
    if (window.confirm('Are you sure you want to delete this trade entry? This action cannot be undone.')) {
      setTrades((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        theme={theme}
        toggleTheme={toggleTheme}
        onAddTradeClick={handleOpenAddTrade}
      />

      {/* Main Viewport */}
      <main className="main-content">
        {activeView === 'dashboard' && (
          <Dashboard
            trades={trades}
            setActiveView={setActiveView}
            onAddTradeClick={handleOpenAddTrade}
            onLoadDemoData={handleLoadDemoData}
          />
        )}

        {activeView === 'history' && (
          <TradeHistory
            trades={trades}
            onEdit={handleOpenEditTrade}
            onDelete={handleDeleteTrade}
            onLoadDemoData={handleLoadDemoData}
          />
        )}

        {activeView === 'stats' && (
          <Statistics trades={trades} onLoadDemoData={handleLoadDemoData} />
        )}

        {/* Global Footer */}
        <footer className="app-footer" id="app-footer">
          <div>
            &copy; {new Date().getFullYear()} HeroTrader. For analytics purposes only. No financial advice provided.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <div>Built by <strong>Rishabh Patel</strong></div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              rishabhpatel00042@gmail.com | +91 8218054036
            </div>
          </div>
        </footer>
      </main>

      {/* Add / Edit Trade Modal Dialog */}
      <TradeForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSaveTrade}
        editingTrade={editingTrade}
      />
    </div>
  );
}
