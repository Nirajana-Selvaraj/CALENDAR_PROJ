import React, { useState } from 'react';
import '../styles/EventList.css';

const EventList = ({ events, currentDate, view, onEditEvent, onDeleteEvent }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

 
  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];

  const getFilteredEvents = () => {
    const today = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return events.filter(event => {
      const eventDate = new Date(event.date);
      switch (view) {
        case 'day':
          return eventDate.toDateString() === currentDate.toDateString();
        case 'week':
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        case 'month':
          return eventDate.getMonth() === currentDate.getMonth() && 
                 eventDate.getFullYear() === currentDate.getFullYear();
        default:
          return true;
      }
    }).sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA - dateB;
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateA - dateB;
    }).slice(0, 5);
  };

  const formatEventDate = (date) => {
    const eventDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (eventDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return eventDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

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

  const filteredEvents = getFilteredEvents().filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const upcomingEvents = getUpcomingEvents();

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
          {view === 'day' ? 'Today\'s Events' : 
           view === 'week' ? 'This Week\'s Events' : 
           'This Month\'s Events'}
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
                        <span className="event-date">
                          {formatEventDate(event.date)}
                        </span>
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

      {view === 'month' && (
        <div className="event-section">
          <h3 className="section-title">Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <div className="no-events">
              <p>No upcoming events</p>
            </div>
          ) : (
            <div className="events-container">
              {upcomingEvents.map(event => (
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
                          <span className="event-date">
                            {formatEventDate(event.date)}
                          </span>
                          <span className="event-time">
                            {formatTime(event.time)}
                          </span>
                        </div>
                      </div>
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
        </div>
      )}
    </div>
  );
};

export default EventList;