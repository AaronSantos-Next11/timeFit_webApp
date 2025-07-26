import React, { useState } from 'react';
import { Search, MessageSquare, Bell, Plus, ChevronLeft, ChevronRight, X, Menu } from 'lucide-react';
import './Calendar.css';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const daysOfWeekShort = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [showEventsSidebar, setShowEventsSidebar] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '09:00',
    endTime: '10:00',
    category: 'meetings'
  });

  const formatDate = (date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const formatFullDate = (date) => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Obtener primer día del mes y último día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Obtener días del mes actual
    const daysInMonth = lastDay.getDate();
    
    // Obtener día de la semana del primer día (0=Domingo, 6=Sábado)
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false
      });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Días del próximo mes para completar la cuadrícula
    const totalCells = 42; // 6 semanas x 7 días
    const remaining = totalCells - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const getWeekDays = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    
    // Ajustar al lunes de la semana actual
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para que la semana empiece en lunes
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventsForSelectedDate = () => {
    return events.filter(event => isSameDay(event.date, selectedDate));
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'sales': 'Ventas',
      'feedback': 'Feedback',
      'reports': 'Reportes',
      'evaluation': 'Evaluación',
      'maintenance': 'Mantenimiento',
      'training': 'Capacitación',
      'metrics': 'Métricas',
      'special': 'Especial',
      'meetings': 'Reuniones'
    };
    return labels[category] || 'General';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'sales': '#FF8787',
      'feedback': '#9775FA',
      'reports': '#4DABF7',
      'evaluation': '#FFD43B',
      'maintenance': '#51CF66',
      'training': '#FF922B',
      'metrics': '#748FFC',
      'special': '#F783AC',
      'meetings': '#FAB005'
    };
    return colors[category] || '#868E96';
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    // Usar setFullYear para manejar correctamente el cambio de año
    newDate.setFullYear(
      newDate.getFullYear(),
      newDate.getMonth() + direction,
      newDate.getDate()
    );
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    // Verificar si cambiamos de año
    if (newDate.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));
    } else {
      setCurrentDate(newDate);
    }
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    // Verificar si cambiamos de mes o año
    if (newDate.getMonth() !== currentDate.getMonth() || 
        newDate.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));
    } else {
      setCurrentDate(newDate);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({...prev, date: date}));
  };

  const toggleSidebar = () => {
    setShowEventsSidebar(!showEventsSidebar);
  };

  const handleAddEvent = () => {
    setShowEventForm(true);
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const eventToAdd = {
      ...newEvent,
      id: Date.now(),
      date: new Date(newEvent.date)
    };
    setEvents([...events, eventToAdd]);
    setShowEventForm(false);
    setNewEvent({
      title: '',
      date: selectedDate,
      time: '09:00',
      endTime: '10:00',
      category: 'meetings'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({...prev, [name]: value}));
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getEventPosition = (event) => {
    const startHour = parseInt(event.time.split(':')[0]);
    const startMinute = parseInt(event.time.split(':')[1]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const endMinute = parseInt(event.endTime.split(':')[1]);
    
    const startPosition = (startHour * 60 + startMinute) / 60;
    const duration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
    
    return {
      top: `${startPosition * 50}px`,
      height: `${Math.max(duration * 50, 30)}px`
    };
  };

  const calendarDays = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(currentDate);

  const renderMonthView = () => (
    <div className="calendar-month">
      <div className="month-header">
        {daysOfWeek.map((day) => (
          <div key={day} className="month-header-day">
            {day}
          </div>
        ))}
      </div>
      <div className="month-grid">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDate(day.date);
          const isSelected = isSameDay(day.date, selectedDate);
          const isToday = isSameDay(day.date, new Date());

          return (
            <div
              key={index}
              className={`month-day ${!day.isCurrentMonth ? 'not-current-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => {
                handleDateClick(day.date);
                setShowEventsSidebar(true);
              }}
            >
              <div className="day-number">
                {day.date.getDate()}
              </div>
              <div className="day-events">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div 
                    key={event.id} 
                    className="day-event"
                    style={{ 
                      backgroundColor: getCategoryColor(event.category),
                      marginTop: eventIndex > 0 ? '2px' : '0'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateClick(day.date);
                      setShowEventsSidebar(true);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div 
                    className="day-events-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateClick(day.date);
                      setShowEventsSidebar(true);
                    }}
                  >
                    Ver {dayEvents.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="calendar-week">
      <div className="week-header">
        <div className="week-time-column"></div>
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          return (
            <div 
              key={index} 
              className={`week-header-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="week-day-name">
                {daysOfWeekShort[index]}
              </div>
              <div className="week-day-number">
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="week-content">
        <div className="week-time-column">
          {hours.map((hour) => (
            <div key={hour} className="week-hour">
              {hour}
            </div>
          ))}
        </div>
        {weekDays.map((day, dayIndex) => (
          <div key={dayIndex} className="week-day-column">
            {hours.map((hour, hourIndex) => (
              <div key={hourIndex} className="week-hour-slot"></div>
            ))}
            {getEventsForDate(day).map((event) => (
              <div
                key={event.id}
                className="week-event"
                style={{
                  backgroundColor: getCategoryColor(event.category),
                  ...getEventPosition(event)
                }}
                onClick={() => {
                  handleDateClick(day);
                  setShowEventsSidebar(true);
                }}
              >
                <div className="week-event-title">
                  {event.title}
                </div>
                <div className="week-event-time">
                  {event.time} - {event.endTime}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDayView = () => (
    <div className="calendar-day">
      <div className="day-header">
        <div className="day-title">
          {formatFullDate(currentDate).charAt(0).toUpperCase() + formatFullDate(currentDate).slice(1)}
        </div>
      </div>
      <div className="day-content">
        <div className="day-time-column">
          {hours.map((hour) => (
            <div key={hour} className="day-hour">
              {hour}
            </div>
          ))}
        </div>
        <div className="day-events-column">
          {hours.map((hour, hourIndex) => (
            <div key={hourIndex} className="day-hour-slot"></div>
          ))}
          {getEventsForDate(currentDate).map((event) => (
            <div
              key={event.id}
              className="day-event"
              style={{
                backgroundColor: getCategoryColor(event.category),
                ...getEventPosition(event)
              }}
              onClick={() => {
                setSelectedDate(currentDate);
                setShowEventsSidebar(true);
              }}
            >
              <div className="day-event-title">
                {event.title}
              </div>
              <div className="day-event-time">
                {event.time} - {event.endTime}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getNavigationLabel = () => {
    if (view === 'month') {
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === 'week') {
      const weekStart = getWeekDays(currentDate)[0];
      const weekEnd = getWeekDays(currentDate)[6];
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `Semana del ${weekStart.getDate()} al ${weekEnd.getDate()} ${months[weekStart.getMonth()]}`;
      } else {
        return `Semana del ${weekStart.getDate()} ${months[weekStart.getMonth()]} al ${weekEnd.getDate()} ${months[weekEnd.getMonth()]}`;
      }
    } else {
      return `${daysOfWeek[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    }
  };

  const handleNavigation = (direction) => {
    if (view === 'month') {
      navigateMonth(direction);
    } else if (view === 'week') {
      navigateWeek(direction);
    } else {
      navigateDay(direction);
    }
  };

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="header-left">
          <div>
            <h1 className="header-title">Calendario</h1>
            <p className="header-subtitle">
              Organiza y gestiona las actividades diarias del gimnasio
            </p>
          </div>
        </div>
        <div className="header-right">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar un actividad, recordatorio, pendiente..."
              className="search-input"
            />
          </div>
          <button className="header-button">
            <MessageSquare />
          </button>
          <button className="header-button">
            <Bell />
          </button>
          <div className="user-info">
            <div className="user-avatar">G</div>
            <div>
              <p className="user-name">Yair Guzman</p>
              <p className="user-role">Administrador</p>
            </div>
          </div>
        </div>
      </header>

      <div className="calendar-controls">
        <div className="view-buttons">
          {['month', 'week', 'day'].map((viewType) => (
            <button
              key={viewType}
              onClick={() => setView(viewType)}
              className={`view-button ${view === viewType ? 'active' : ''}`}
            >
              {viewType === 'month' ? 'Mes' : viewType === 'week' ? 'Semana' : 'Día'}
            </button>
          ))}
        </div>
        
        <div className="navigation-controls">
          <div className="navigation-buttons">
            <button onClick={() => handleNavigation(-1)} className="nav-button">
              <ChevronLeft />
            </button>
            <div className="current-period">
              {getNavigationLabel()}
            </div>
            <button onClick={() => handleNavigation(1)} className="nav-button">
              <ChevronRight />
            </button>
          </div>
          
          <button onClick={toggleSidebar} className="sidebar-toggle" title={showEventsSidebar ? "Ocultar eventos" : "Mostrar eventos"}>
            <Menu />
          </button>
        </div>
      </div>

      <div className="calendar-main">
        <div className="calendar-views">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>

        <div className={`events-sidebar ${showEventsSidebar ? 'visible' : ''}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              {formatDate(selectedDate)}
            </h2>
            <button onClick={toggleSidebar} className="sidebar-close">
              <X />
            </button>
          </div>

          <div className="sidebar-content">
            {getEventsForSelectedDate().map((event) => (
              <div key={event.id} className="sidebar-event">
                <div className="sidebar-event-content">
                  <div className="sidebar-event-time">
                    {event.time} - {event.endTime}
                  </div>
                  <div className="sidebar-event-title">
                    {event.title}
                  </div>
                  <div className="sidebar-event-category">
                    {getCategoryLabel(event.category)}
                  </div>
                  <button onClick={() => handleDeleteEvent(event.id)} className="sidebar-event-delete">
                    <X />
                  </button>
                </div>
              </div>
            ))}
            
            {getEventsForSelectedDate().length === 0 && (
              <div className="sidebar-empty">
                <p>No hay eventos programados para este día</p>
              </div>
            )}
          </div>

          <div className="sidebar-footer">
            <button onClick={handleAddEvent} className="add-event-button">
              <Plus />
            </button>
          </div>
        </div>

        {showEventForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Agregar nuevo evento</h3>
                <button onClick={() => setShowEventForm(false)} className="modal-close">
                  <X />
                </button>
              </div>
              <form onSubmit={handleEventSubmit}>
                <div className="form-group">
                  <label className="form-label">Título del evento</label>
                  <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={newEvent.date.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setNewEvent(prev => ({...prev, date}));
                    }}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label">Hora de inicio</label>
                    <input
                      type="time"
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hora de fin</label>
                    <input
                      type="time"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select
                    name="category"
                    value={newEvent.category}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="meetings">Reuniones</option>
                    <option value="sales">Ventas</option>
                    <option value="feedback">Feedback</option>
                    <option value="reports">Reportes</option>
                    <option value="evaluation">Evaluación</option>
                    <option value="maintenance">Mantenimiento</option>
                    <option value="training">Capacitación</option>
                    <option value="metrics">Métricas</option>
                    <option value="special">Especial</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="form-button secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="form-button primary">
                    Guardar Evento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEventsSidebar && <div className="sidebar-overlay" onClick={toggleSidebar} />}
      </div>
    </div>
  );
}