


import React from 'react';
import '../styles/MonthView.css';

const MonthView = ({ currentDate, selectedDate, events, onDateClick }) => {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const totalDays = 42; 

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }

  const isToday = (date) => date.toDateString() === today.toDateString();
  const isCurrentMonth = (date) => date.getMonth() === month;
  const isSelected = (date) => selectedDate && date.toDateString() === selectedDate.toDateString();

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="month-view">
      <div className="weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="days-grid">
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          return (
            <div
              key={index}
              className={`day-cell ${
                isCurrentMonth(date) ? 'current-month' : 'other-month'
              } ${isToday(date) ? 'today' : ''} ${
                isSelected(date) ? 'selected' : ''
              }`}
              onClick={() => onDateClick(date)}
            >
              <span className="day-number">{date.getDate()}</span>
              <div className="day-events">
                {dayEvents.slice(0, 3).map((event, idx, arr) => {
                  const hasConflict = arr.filter(e => e.time === event.time).length > 1;
                  return (
                    <div
                      key={event.id}
                      className={`event-dot ${event.priority || 'medium'} ${hasConflict ? 'conflict-dot' : ''} ${event.isHoliday ? 'holiday-dot' : ''}`}
                      title={`${event.title}${hasConflict ? ' (Conflict)' : ''}${event.isHoliday ? ' (Holiday)' : ''}`}
                    >
                      {event.isHoliday ? '🎉 ' : ''}
                      {event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="more-events">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;