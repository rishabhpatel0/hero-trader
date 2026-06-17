import React from 'react';
import { LayoutDashboard, History, BarChart3, TrendingUp, ExternalLink } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar({ activeView, setActiveView, theme, toggleTheme, onAddTradeClick }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Trade History', icon: History },
    { id: 'stats', label: 'Analytics & Stats', icon: BarChart3 },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Logo */}
      <div className="brand">
        <div className="brand-logo">
          <TrendingUp size={24} className="brand-icon" />
        </div>
        <div className="brand-text">
          <h1>HeroTrader</h1>
          <span>Journal & Analytics</span>
        </div>
      </div>

      {/* Quick Action */}
      <div className="sidebar-action">
        <button className="btn btn-primary btn-block" onClick={onAddTradeClick} id="sidebar-add-trade-btn">
          + New Journal Entry
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile and Footer Buttons */}
      <div className="sidebar-footer">
        {/* Theme Toggle in Sidebar */}
        <div className="theme-toggle-container">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Developer Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">RP</div>
          <div className="profile-info">
            <span className="profile-name">Rishabh Patel</span>
            <span className="profile-email" title="rishabhpatel00042@gmail.com">rishabhpatel00042@gmail.com</span>
          </div>
        </div>

        {/* Mandatory CTA Button */}
        <a
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-hero btn-block"
          id="btn-digital-heroes"
        >
          <span>Built for Digital Heroes</span>
          <ExternalLink size={14} className="btn-hero-icon" />
        </a>
      </div>
    </aside>
  );
}
