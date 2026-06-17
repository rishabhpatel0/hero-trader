import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Download, Search, ArrowUpDown, Calendar, Filter, X } from 'lucide-react';

export default function TradeHistory({ trades, onEdit, onDelete, onLoadDemoData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [assetFilter, setAssetFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  // Extract all unique assets for filter dropdown
  const uniqueAssets = useMemo(() => {
    const assets = trades.map((t) => t.asset.toUpperCase());
    return ['All', ...new Set(assets)].sort();
  }, [trades]);

  // Apply filters and sort
  const filteredAndSortedTrades = useMemo(() => {
    let result = [...trades];

    // 1. Text Search (Asset Name or Notes)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.asset.toLowerCase().includes(term) ||
          (t.notes && t.notes.toLowerCase().includes(term))
      );
    }

    // 2. Asset Filter
    if (assetFilter !== 'All') {
      result = result.filter((t) => t.asset.toUpperCase() === assetFilter.toUpperCase());
    }

    // 3. Date Range Filter
    if (startDate) {
      result = result.filter((t) => t.date >= startDate);
    }
    if (endDate) {
      result = result.filter((t) => t.date <= endDate);
    }

    // 4. Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [trades, searchTerm, assetFilter, startDate, endDate, sortDirection]);

  // Toggle sort order
  const handleSortToggle = () => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setAssetFilter('All');
    setStartDate('');
    setEndDate('');
  };

  // CSV Export Function
  const exportToCSV = () => {
    if (filteredAndSortedTrades.length === 0) return;

    // Headers
    const headers = ['Date', 'Asset', 'Type', 'Entry Price', 'Exit Price', 'Quantity', 'Profit/Loss ($)', 'Notes'];
    
    // Rows
    const rows = filteredAndSortedTrades.map((t) => [
      t.date,
      t.asset,
      t.type,
      t.entryPrice,
      t.exitPrice,
      t.quantity,
      t.pnl,
      `"${(t.notes || '').replace(/"/g, '""')}"`, // escape quotes for CSV
    ]);

    // Combine
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    // Create Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trading_journal_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="trade-history-view animate-fade-in">
      <div className="view-header">
        <div>
          <h2>Trade History</h2>
          <p className="view-subtitle">Review, filter, and manage your complete trading record.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredAndSortedTrades.length === 0}
          className="btn btn-secondary flex-center gap-2"
          id="btn-export-csv"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="filters-card card">
        <div className="filters-grid">
          {/* Search */}
          <div className="filter-group search-group">
            <label htmlFor="search-input">Search Journal</label>
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                id="search-input"
                placeholder="Search asset or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Asset Select */}
          <div className="filter-group">
            <label htmlFor="asset-filter">Asset</label>
            <div className="select-wrapper">
              <Filter size={14} className="filter-select-icon" />
              <select
                id="asset-filter"
                value={assetFilter}
                onChange={(e) => setAssetFilter(e.target.value)}
              >
                {uniqueAssets.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset === 'All' ? 'All Assets' : asset}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div className="filter-group">
            <label htmlFor="start-date">Start Date</label>
            <div className="date-wrapper">
              <Calendar size={14} className="date-icon" />
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          {/* End Date */}
          <div className="filter-group">
            <label htmlFor="end-date">End Date</label>
            <div className="date-wrapper">
              <Calendar size={14} className="date-icon" />
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {(searchTerm || assetFilter !== 'All' || startDate || endDate) && (
          <div className="filters-summary">
            <span>Showing {filteredAndSortedTrades.length} of {trades.length} trades</span>
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              <X size={14} /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Trades Table Container */}
      <div className="table-card card">
        {filteredAndSortedTrades.length === 0 ? (
          <div className="empty-state py-5 flex-center" style={{ flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
            {trades.length === 0 ? (
              <>
                <p>Your trading journal is currently empty.</p>
                <div className="flex-center gap-2 mt-2">
                  <button className="btn btn-primary btn-sm" onClick={() => onEdit(null)}>
                    + Log First Trade
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={onLoadDemoData}>
                    ⚡ Load Demo Data
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>No trades found matching the filters.</p>
                <button className="btn btn-secondary btn-sm mt-2" onClick={handleClearFilters}>
                  Reset Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="trades-table">
              <thead>
                <tr>
                  <th onClick={handleSortToggle} className="sortable-header" id="th-date">
                    <div className="header-cell">
                      <span>Date</span>
                      <ArrowUpDown size={14} className="sort-icon" />
                    </div>
                  </th>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Entry</th>
                  <th>Exit</th>
                  <th>Qty</th>
                  <th>Profit / Loss</th>
                  <th>Notes</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTrades.map((trade) => {
                  const isProfit = trade.pnl >= 0;
                  return (
                    <tr key={trade.id} className="trade-row">
                      <td className="font-medium">{trade.date}</td>
                      <td>
                        <span className="asset-tag">{trade.asset}</span>
                      </td>
                      <td>
                        <span className={`badge ${trade.type.toLowerCase()}`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="numeric">${trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="numeric">${trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="numeric">{trade.quantity}</td>
                      <td className={`numeric font-semibold ${isProfit ? 'text-profit' : 'text-loss'}`}>
                        {isProfit ? '+' : ''}${trade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="notes-cell" title={trade.notes}>
                        <div className="notes-truncation">{trade.notes || '—'}</div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => onEdit(trade)}
                            className="action-btn edit-btn"
                            title="Edit Trade"
                            id={`btn-edit-${trade.id}`}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => onDelete(trade.id)}
                            className="action-btn delete-btn"
                            title="Delete Trade"
                            id={`btn-delete-${trade.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
