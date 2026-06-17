import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

export default function TradeForm({ isOpen, onClose, onSubmit, editingTrade }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().substring(0, 10),
    asset: '',
    type: 'Buy',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Reset form when modal opens or editingTrade changes
  useEffect(() => {
    if (editingTrade) {
      setFormData({
        date: editingTrade.date,
        asset: editingTrade.asset,
        type: editingTrade.type,
        entryPrice: editingTrade.entryPrice.toString(),
        exitPrice: editingTrade.exitPrice.toString(),
        quantity: editingTrade.quantity.toString(),
        notes: editingTrade.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().substring(0, 10),
        asset: '',
        type: 'Buy',
        entryPrice: '',
        exitPrice: '',
        quantity: '',
        notes: '',
      });
    }
    setErrors({});
  }, [editingTrade, isOpen]);

  if (!isOpen) return null;

  // Live PnL calculation
  const entry = parseFloat(formData.entryPrice);
  const exit = parseFloat(formData.exitPrice);
  const qty = parseFloat(formData.quantity);
  
  let livePnL = null;
  let isPnLValid = !isNaN(entry) && !isNaN(exit) && !isNaN(qty) && entry > 0 && exit > 0 && qty > 0;

  if (isPnLValid) {
    if (formData.type === 'Buy') {
      livePnL = (exit - entry) * qty;
    } else {
      livePnL = (entry - exit) * qty;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'asset' ? value.toUpperCase() : value,
    }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.asset.trim()) newErrors.asset = 'Asset name is required';
    
    const entryNum = parseFloat(formData.entryPrice);
    if (isNaN(entryNum) || entryNum <= 0) {
      newErrors.entryPrice = 'Must be a positive number';
    }

    const exitNum = parseFloat(formData.exitPrice);
    if (isNaN(exitNum) || exitNum <= 0) {
      newErrors.exitPrice = 'Must be a positive number';
    }

    const qtyNum = parseFloat(formData.quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      newErrors.quantity = 'Must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const entryNum = parseFloat(formData.entryPrice);
    const exitNum = parseFloat(formData.exitPrice);
    const qtyNum = parseFloat(formData.quantity);
    
    let pnl = 0;
    if (formData.type === 'Buy') {
      pnl = (exitNum - entryNum) * qtyNum;
    } else {
      pnl = (entryNum - exitNum) * qtyNum;
    }

    onSubmit({
      id: editingTrade ? editingTrade.id : Date.now().toString(),
      date: formData.date,
      asset: formData.asset.trim().toUpperCase(),
      type: formData.type,
      entryPrice: entryNum,
      exitPrice: exitNum,
      quantity: qtyNum,
      notes: formData.notes.trim(),
      pnl: parseFloat(pnl.toFixed(2)),
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingTrade ? 'Edit Trade Log' : 'New Trade Log'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            {/* Date */}
            <div className="form-group">
              <label htmlFor="trade-date">Trade Date</label>
              <input
                type="date"
                id="trade-date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={errors.date ? 'input-error' : ''}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            {/* Asset */}
            <div className="form-group">
              <label htmlFor="trade-asset">Asset Name</label>
              <input
                type="text"
                id="trade-asset"
                name="asset"
                placeholder="e.g. BTCUSD, XAUUSD, TSLA"
                value={formData.asset}
                onChange={handleChange}
                className={errors.asset ? 'input-error' : ''}
              />
              {errors.asset && <span className="error-message">{errors.asset}</span>}
            </div>
          </div>

          {/* Trade Type Selection (Buy vs Sell) */}
          <div className="form-group">
            <label>Trade Type</label>
            <div className="type-toggle-container">
              <button
                type="button"
                id="type-buy-btn"
                className={`type-toggle-btn buy ${formData.type === 'Buy' ? 'active' : ''}`}
                onClick={() => handleTypeSelect('Buy')}
              >
                <TrendingUp size={16} />
                <span>Buy / Long</span>
              </button>
              <button
                type="button"
                id="type-sell-btn"
                className={`type-toggle-btn sell ${formData.type === 'Sell' ? 'active' : ''}`}
                onClick={() => handleTypeSelect('Sell')}
              >
                <TrendingDown size={16} />
                <span>Sell / Short</span>
              </button>
            </div>
          </div>

          <div className="form-row three-cols">
            {/* Entry Price */}
            <div className="form-group">
              <label htmlFor="trade-entry">Entry Price</label>
              <input
                type="number"
                id="trade-entry"
                name="entryPrice"
                step="any"
                min="0.00000001"
                placeholder="0.00"
                value={formData.entryPrice}
                onChange={handleChange}
                className={errors.entryPrice ? 'input-error' : ''}
              />
              {errors.entryPrice && <span className="error-message">{errors.entryPrice}</span>}
            </div>

            {/* Exit Price */}
            <div className="form-group">
              <label htmlFor="trade-exit">Exit Price</label>
              <input
                type="number"
                id="trade-exit"
                name="exitPrice"
                step="any"
                min="0.00000001"
                placeholder="0.00"
                value={formData.exitPrice}
                onChange={handleChange}
                className={errors.exitPrice ? 'input-error' : ''}
              />
              {errors.exitPrice && <span className="error-message">{errors.exitPrice}</span>}
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label htmlFor="trade-quantity">Quantity</label>
              <input
                type="number"
                id="trade-quantity"
                name="quantity"
                step="any"
                min="0.00000001"
                placeholder="1.0"
                value={formData.quantity}
                onChange={handleChange}
                className={errors.quantity ? 'input-error' : ''}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
          </div>

          {/* Live PnL Preview */}
          {isPnLValid && (
            <div className={`pnl-preview ${livePnL >= 0 ? 'profit' : 'loss'}`}>
              <div className="pnl-preview-label">Estimated Profit/Loss:</div>
              <div className="pnl-preview-value">
                {livePnL >= 0 ? '+' : ''}${livePnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="trade-notes">Notes (Optional)</label>
            <textarea
              id="trade-notes"
              name="notes"
              rows="3"
              placeholder="Record market conditions, strategy details, or emotional state..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} id="modal-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" id="modal-submit-btn">
              {editingTrade ? 'Save Changes' : 'Add Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
