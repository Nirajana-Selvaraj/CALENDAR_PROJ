import React from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import '../styles/Calendar.css';

const Calendar = ({ currentDate, selectedDate, events, view, onDateClick }) => {
  const renderView = () => {
    switch (view) {
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            onDateClick={onDateClick}
          />
        );
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            onDateClick={onDateClick}
          />
        );
      default:
        return (
          <MonthView
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            onDateClick={onDateClick}
          />
        );
    }
  };

  return (
    <div className="calendar">
      {renderView()}
    </div>
  );
};

export default Calendar;