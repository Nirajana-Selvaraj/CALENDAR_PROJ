import React, { useState } from 'react';
import '../styles/DayView.css';

const DayView = ({ events, currentDate, onEditEvent, onDeleteEvent }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];

 
  const filteredEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === currentDate.toDateString();
    })
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA - dateB;
    });

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      personal: '👤',
      work: '💼',
      health: '🏥',
      social: '👥',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  return (
    <div className="event-list">
      <div className="event-section">
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <input
            type="text"
            placeholder="🔍 Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 12,
              border: '1.5px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: 15
            }}
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '1.5px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: 15
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <h3 className="section-title">
          Events for {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>No events scheduled</p>
          </div>
        ) : (
          <div className="events-container">
            {filteredEvents.map(event => (
              <div key={event.id} className={`event-item ${event.priority}`}>
                <div className="event-header">
                  <div className="event-info">
                    <span className="event-category">
                      {getCategoryIcon(event.category)}
                    </span>
                    <div className="event-details">
                      <h4 className="event-title">
                        {event.isHoliday && <span title="Holiday" style={{marginRight: 6}}>🎉</span>}
                        {event.title}
                      </h4>
                      <div className="event-meta">
                        <span className="event-time">
                          {formatTime(event.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="event-actions">
                    <button
                      className="edit-btn"
                      onClick={() => onEditEvent(event)}
                      title="Edit event"
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDeleteEvent(event.id)}
                      title="Delete event"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                {event.location && (
                  <div className="event-location">
                    📍 {event.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="category-chips">
          {categories.slice(1).map(cat => (
            <button
              key={cat}
              className={`category-chip${selectedCategory === cat ? ' selected' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)} ({events.filter(e => e.category === cat).length})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;