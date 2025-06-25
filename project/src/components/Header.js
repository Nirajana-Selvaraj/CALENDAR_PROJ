import React, { useContext } from 'react';
import '../styles/Header.css';
import { ThemeContext } from '../components/ThemeContext';

const Header = ({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onToday,
  onAddEvent,
  onDateChange
}) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const formatHeaderDate = () => {
    const options = { year: 'numeric', month: 'long' };
    if (view === 'day') {
      options.day = 'numeric';
      options.weekday = 'long';
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('en-US', options);
  };

  const getInputDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">Calendar</h1>
        <button className="today-btn" onClick={onToday}>Today</button>
        <button className="add-event-button" onClick={onAddEvent}>Add Event</button>
      </div>

      <div className="header-center">
        <div className="navigation">
          <button className="nav-btn" onClick={() => onNavigate(-1)}>&#8249;</button>
          <input
            type="date"
            className="date-picker"
            value={getInputDate(currentDate)}
            onChange={e => onDateChange(new Date(e.target.value))}
            style={{ fontSize: 16, padding: '4px 8px', borderRadius: 6, border: '1px solid #e2e8f0' }}
          />
          <button className="nav-btn" onClick={() => onNavigate(1)}>&#8250;</button>
        </div>
      </div>

      <div className="header-right">
        <div className="view-selector">
          <button className={`view-btn ${view === 'month' ? 'active' : ''}`} onClick={() => onViewChange('month')}>Month</button>
          <button className={`view-btn ${view === 'week' ? 'active' : ''}`} onClick={() => onViewChange('week')}>Week</button>
          <button className={`view-btn ${view === 'day' ? 'active' : ''}`} onClick={() => onViewChange('day')}>Day</button>
        </div>

        {/* 🌗 Theme Toggle Button */}
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default Header;
