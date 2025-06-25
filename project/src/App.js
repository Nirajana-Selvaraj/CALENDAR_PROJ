import React, { useEffect, useState, useContext } from 'react';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';
import EventList from './components/EventList';
import Header from './components/Header';
import './styles/App.css';
import { ThemeContext } from './components/ThemeContext';

const CALENDARIFIC_API_KEY = process.env.REACT_APP_CALENDARIFIC_API_KEY;
console.log('API KEY:', process.env.REACT_APP_CALENDARIFIC_API_KEY);

const COUNTRY = 'IN';
const YEAR = new Date().getFullYear();

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState('month');

  const { theme } = useContext(ThemeContext);

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const nextMonth = String(today.getMonth() + 2 > 12 ? 1 : today.getMonth() + 2).padStart(2, '0');
  const nextMonthYear = today.getMonth() + 2 > 12 ? yyyy + 1 : yyyy;

  const staticEvents = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Discuss project goals',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      location: 'Conference Room',
      priority: 'high',
      category: 'work',
    },
    {
      id: '2',
      title: 'Doctor Visit',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      location: 'Clinic',
      priority: 'medium',
      category: 'health',
    },
    {
      id: '3',
      title: 'Birthday Party',
      description: "At Rahul's place",
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
      time: '19:00',
      location: "Rahul's House",
      priority: 'low',
      category: 'personal',
    },
    {
      id: '4',
      title: 'Project Deadline',
      description: 'Submit final report',
      date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
      time: '23:59',
      location: '',
      priority: 'high',
      category: 'work',
    },
    {
      id: '5',
      title: 'Yoga Class',
      description: 'Morning session',
      date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      time: '06:30',
      location: 'Community Center',
      priority: 'medium',
      category: 'health',
    },
    {
      id: '6',
      title: 'Family Dinner',
      description: 'Dinner at home',
      date: `${yyyy}-${mm}-10`,
      time: '20:00',
      location: 'Home',
      priority: 'low',
      category: 'personal',
    },
    {
      id: '7',
      title: 'Anniversary',
      description: 'Parents anniversary',
      date: `${yyyy}-${mm}-25`,
      time: '00:00',
      location: '',
      priority: 'high',
      category: 'personal',
    },
    {
      id: '8',
      title: 'Friend’s Wedding',
      description: 'Attend wedding ceremony',
      date: `${nextMonthYear}-${nextMonth}-15`,
      time: '18:00',
      location: 'Banquet Hall',
      priority: 'high',
      category: 'social',
    },
    {
      id: '9',
      title: 'Exam',
      description: 'Final exam',
      date: `${yyyy}-${mm}-28`,
      time: '09:00',
      location: 'School',
      priority: 'high',
      category: 'work',
    },
  ];

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    let userEvents = [];
    if (savedEvents) {
      userEvents = JSON.parse(savedEvents);
    }

    const allEvents = [
      ...staticEvents,
      ...userEvents.filter(ue => !staticEvents.some(se => se.id === ue.id)),
    ];
    setEvents(allEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(userEvents));
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    fetch(`https://calendarific.com/api/v2/holidays?&api_key=${CALENDARIFIC_API_KEY}&country=${COUNTRY}&year=${YEAR}`)
      .then(res => res.json())
      .then(data => {
        if (data?.response?.holidays) {
          const holidayEvents = data.response.holidays.map(h => ({
            id: `holiday-${h.date.iso}`,
            title: h.name,
            date: h.date.iso,
            time: '00:00',
            description: h.description,
            category: 'holiday',
            priority: 'high',
            isHoliday: true
          }));

          setEvents(prev => {
            const existingHolidayIds = new Set(prev.filter(ev => ev.isHoliday).map(ev => ev.id));
            const newHolidays = holidayEvents.filter(h => !existingHolidayIds.has(h.id));
            return [...newHolidays, ...prev];
          });
        }
      })
      .catch(err => console.error('Failed to fetch Indian holidays:', err));
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleAddEvent = (eventData) => {
    const newEvent = {
      id: Date.now().toString(),
      ...eventData,
      date: selectedDate || new Date(),
    };
    setEvents([...events, newEvent]);
    setShowEventModal(false);
    setSelectedDate(null);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setSelectedDate(new Date(event.date));
    setShowEventModal(true);
  };

  const handleUpdateEvent = (eventData) => {
    const updatedEvents = events.map(event =>
      event.id === editingEvent.id
        ? { ...event, ...eventData, date: selectedDate || event.date }
        : event
    );
    setEvents(updatedEvents);
    setShowEventModal(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const closeModal = () => {
    setShowEventModal(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + direction);
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    } else if (view === 'day') {
      newDate.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForSelectedDate = () => {
    const date = selectedDate || currentDate;
    return events.filter(event =>
      new Date(event.date).toDateString() === date.toDateString()
    );
  };

  const handleHeaderDateChange = (date) => {
    setCurrentDate(date);
    setSelectedDate(null);
  };

  return (
    <div className={`app ${theme}`}>
      <Header
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={navigateDate}
        onToday={goToToday}
        onAddEvent={() => setShowEventModal(true)}
        onDateChange={handleHeaderDateChange}
      />

      <div className="app-content">
        <div className="calendar-section">
          <Calendar
            currentDate={currentDate}
            selectedDate={selectedDate}
            events={events}
            view={view}
            onDateClick={handleDateClick}
          />
        </div>

        <div className="sidebar">
          <EventList
            events={events}
            currentDate={currentDate}
            view={view}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
      </div>

      {showEventModal && (
        <EventModal
          selectedDate={selectedDate || currentDate}
          editingEvent={editingEvent}
          onSave={editingEvent ? handleUpdateEvent : handleAddEvent}
          onClose={closeModal}
          eventsForDate={getEventsForSelectedDate()}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default App;
