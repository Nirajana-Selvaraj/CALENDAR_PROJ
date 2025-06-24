import React from 'react';
import '../styles/WeekView.css';

const WeekView = ({ currentDate, selectedDate, events, onDateClick }) => {
  const today = new Date();

  
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());


  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push(date);
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="time-column-header"></div>
        {weekDays.map((date, index) => (
          <div
            key={index}
            className={`week-day-header ${isToday(date) ? 'today' : ''} ${
              isSelected(date) ? 'selected' : ''
            }`}
            onClick={() => onDateClick(date)}
          >
            <div className="day-name">{weekDayNames[index]}</div>
            <div className="day-number">{date.getDate()}</div>
          </div>
        ))}
      </div>

      <div className="week-body">
        <div className="time-column">
          {hours.map(hour => (
            <div key={hour} className="time-slot">
              {formatTime(hour)}
            </div>
          ))}
        </div>

        {weekDays.map((date, dayIndex) => (
          <div key={dayIndex} className="day-column">
            {hours.map(hour => {
              const eventsForHour = getEventsForDate(date).filter(
                event => parseInt(event.time.split(':')[0]) === hour
              );
              return (
                <div
                  key={hour}
                  className="hour-slot"
                  onClick={() => onDateClick(date)}
                >
                  {eventsForHour.map((event, index) => (
                    <div
                      key={event.id}
                      className={`week-event ${event.priority || 'medium'} ${
                        eventsForHour.length > 1 ? 'conflict' : ''
                      }`}
                      title={`${event.title} - ${event.description || ''}${
                        eventsForHour.length > 1 ? ' (Conflict)' : ''
                      }`}
                    >
                      <div className="event-title">{event.title}</div>
                      <div className="event-time">{event.time}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
