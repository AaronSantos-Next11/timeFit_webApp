import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Box, Typography, IconButton, Grid, Avatar, Alert, Snackbar, MenuItem, Menu } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Menu as MenuIcon } from "@mui/icons-material";
import "./Calendar.css";

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const daysOfWeekShort = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

export default function Calendar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [showEventsSidebar, setShowEventsSidebar] = useState(false);
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: new Date(),
    time: "09:00",
    endTime: "10:00",
    category: "meetings",
  });

  // Estados para notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Función para navegar al perfil
  const handleProfileClick = () => {
    navigate("/user_profile");
    handleMenuClose();
  };

  const createLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day); // month - 1 porque los meses en JS van de 0-11
  };

  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Función para navegar al logout
  const handleLogoutClick = () => {
    navigate("/logout-confirm", { state: { from: location.pathname } });
    handleMenuClose();
  };

  const renderMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      <MenuItem onClick={handleProfileClick}>Mi Perfil</MenuItem>
      <MenuItem onClick={handleLogoutClick}>Cerrar sesión</MenuItem>
    </Menu>
  );

  // API URL y Token
  const API = import.meta.env.VITE_API_URL;
  const getToken = () => localStorage.getItem("token") || sessionStorage.getItem("token");

  // Lectura segura del usuario
  let admin = null;
  try {
    const adminDataString = localStorage.getItem("user") || sessionStorage.getItem("user");
    admin = adminDataString ? JSON.parse(adminDataString) : null;
  } catch {
    admin = null;
  }

  const colorMap = {
    Rojo: "#e74c3c",
    Azul: "#3498db",
    Verde: "#2ecc71",
    Amarillo: "#f1c40f",
    Morado: "#9b59b6",
    Naranja: "#e67e22",
    Rosa: "#e91e63",
    Durazno: "#ffb74d",
    Turquesa: "#1abc9c",
    RojoVino: "#880e4f",
    Lima: "#cddc39",
    Cian: "#00acc1",
    Lavanda: "#9575cd",
    Magenta: "#d81b60",
    Coral: "#ff7043",
  };

  const getMappedColor = (colorName) => colorMap[colorName] || "#ff4300";

  const getInitials = (username) => {
    if (!username) return "";
    return username.slice(0, 2).toUpperCase();
  };

  const getFirstNameAndLastName = (name, last_name) => {
    if (!name || !last_name) return "Usuario";
    const firstName = name.split(" ")[0];
    const firstLastName = last_name.split(" ")[0];
    return `${firstName} ${firstLastName}`;
  };

  const displayName = admin ? getFirstNameAndLastName(admin.name, admin.last_name) : "Usuario";
  const roleName = admin?.role?.role_name || "Rol desconocido";
  const usernameInitials = admin ? getInitials(admin.username) : "";

  // Funciones de notificación
  const showNotification = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Función para cargar eventos del usuario
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        showNotification("No se encontró token de autenticación", "error");
        return;
      }

      const response = await fetch(`${API}/api/calendar/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cargar eventos");
      }

      const data = await response.json();

      // Convertir los eventos del backend al formato del frontend
      const formattedEvents = data.events.map((event) => ({
        id: event._id,
        title: event.title,
        date: new Date(event.event_date),
        time: event.start_time,
        endTime: event.end_time,
        category: event.category,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      showNotification(error.message || "Error al cargar eventos", "error");
    } finally {
      setLoading(false);
    }
  };

  // Función para crear evento
  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        showNotification("No se encontró token de autenticación", "error");
        return false;
      }

      const requestBody = {
        title: eventData.title,
        event_date: formatDateForInput(eventData.date),
        start_time: eventData.time,
        end_time: eventData.endTime,
        category: eventData.category,
      };

      const response = await fetch(`${API}/api/calendar/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear evento");
      }
      showNotification("Evento creado exitosamente", "success");

      // Recargar eventos
      await fetchEvents();
      return true;
    } catch (error) {
      console.error("Error al crear evento:", error);
      showNotification(error.message || "Error al crear evento", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar evento
  const updateEvent = async (eventId, eventData) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        showNotification("No se encontró token de autenticación", "error");
        return false;
      }

      const requestBody = {
        title: eventData.title,
        event_date: eventData.date.toISOString().split("T")[0],
        start_time: eventData.time,
        end_time: eventData.endTime,
        category: eventData.category,
      };

      const response = await fetch(`${API}/api/calendar/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar evento");
      }

      showNotification("Evento actualizado exitosamente", "success");

      // Recargar eventos
      await fetchEvents();
      return true;
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      showNotification(error.message || "Error al actualizar evento", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar evento
  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        showNotification("No se encontró token de autenticación", "error");
        return false;
      }

      const response = await fetch(`${API}/api/calendar/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar evento");
      }

      showNotification("Evento eliminado exitosamente", "success");

      // Recargar eventos
      await fetchEvents();
      return true;
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      showNotification(error.message || "Error al eliminar evento", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (date) => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const formatFullDate = (date) => {
    const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // Días del próximo mes para completar la cuadrícula
    const totalCells = 42; // 6 semanas x 7 días
    const remaining = totalCells - days.length;
    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getWeekDays = (date) => {
    const week = [];
    const startOfWeek = new Date(date);

    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getEventsForDate = (date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const getEventsForSelectedDate = () => {
    return events.filter((event) => isSameDay(event.date, selectedDate));
  };

  const getCategoryLabel = (category) => {
    const labels = {
      sales: "Ventas",
      feedback: "Feedback",
      reports: "Reportes",
      evaluation: "Evaluación",
      maintenance: "Mantenimiento",
      training: "Capacitación",
      metrics: "Métricas",
      special: "Especial",
      meetings: "Reuniones",
    };
    return labels[category] || "General";
  };

  const getCategoryColor = (category) => {
    const colors = {
      sales: "#e74c3c",
      feedback: "#9b59b6",
      reports: "#880e4f",
      evaluation: "#2ecc7091",
      maintenance: "#e67d22e7",
      training: "#3477dbd5",
      metrics: "#e91e63",
      special: "#ccdc3975",
      meetings: "#00acc1",
    };
    return colors[category] || "#868E96";
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear(), newDate.getMonth() + direction, newDate.getDate());
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    if (newDate.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));
    } else {
      setCurrentDate(newDate);
    }
  };

  const navigateDay = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    if (newDate.getMonth() !== currentDate.getMonth() || newDate.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()));
    } else {
      setCurrentDate(newDate);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent((prev) => ({ ...prev, date: date }));
  };

  const toggleSidebar = () => {
    setShowEventsSidebar(!showEventsSidebar);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setNewEvent({
      title: "",
      date: selectedDate,
      time: "09:00",
      endTime: "10:00",
      category: "meetings",
    });
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      endTime: event.endTime,
      category: event.category,
    });
    setShowEventForm(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();

    let success = false;
    if (editingEvent) {
      success = await updateEvent(editingEvent.id, newEvent);
    } else {
      success = await createEvent(newEvent);
    }

    if (success) {
      setShowEventForm(false);
      setEditingEvent(null);
      setNewEvent({
        title: "",
        date: selectedDate,
        time: "09:00",
        endTime: "10:00",
        category: "meetings",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      await deleteEvent(eventId);
    }
  };

  const getEventPosition = (event) => {
    const startHour = parseInt(event.time.split(":")[0]);
    const startMinute = parseInt(event.time.split(":")[1]);
    const endHour = parseInt(event.endTime.split(":")[0]);
    const endMinute = parseInt(event.endTime.split(":")[1]);

    const startPosition = (startHour * 60 + startMinute) / 60;
    const duration = (endHour * 60 + endMinute - (startHour * 60 + startMinute)) / 60;

    return {
      top: `${startPosition * 50}px`,
      height: `${Math.max(duration * 50, 30)}px`,
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
              className={`month-day ${!day.isCurrentMonth ? "not-current-month" : ""} ${isSelected ? "selected" : ""} ${
                isToday ? "today" : ""
              }`}
              onClick={() => {
                handleDateClick(day.date);
                setShowEventsSidebar(true);
              }}
            >
              <div className="day-number">{day.date.getDate()}</div>
              <div className="day-events">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <div
                    key={event.id}
                    className="day-event"
                    style={{
                      backgroundColor: getCategoryColor(event.category),
                      marginTop: eventIndex > 0 ? "2px" : "0",
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
              className={`week-header-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="week-day-name">{daysOfWeekShort[index]}</div>
              <div className="week-day-number">{day.getDate()}</div>
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
                  ...getEventPosition(event),
                }}
                onClick={() => {
                  handleDateClick(day);
                  setShowEventsSidebar(true);
                }}
              >
                <div className="week-event-title">{event.title}</div>
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
                ...getEventPosition(event),
              }}
              onClick={() => {
                setSelectedDate(currentDate);
                setShowEventsSidebar(true);
              }}
            >
              <div className="day-event-title">{event.title}</div>
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
    if (view === "month") {
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (view === "week") {
      const weekStart = getWeekDays(currentDate)[0];
      const weekEnd = getWeekDays(currentDate)[6];
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `Semana del ${weekStart.getDate()} al ${weekEnd.getDate()} ${months[weekStart.getMonth()]}`;
      } else {
        return `Semana del ${weekStart.getDate()} ${months[weekStart.getMonth()]} al ${weekEnd.getDate()} ${
          months[weekEnd.getMonth()]
        }`;
      }
    } else {
      return `${daysOfWeek[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    }
  };

  const handleNavigation = (direction) => {
    if (view === "month") {
      navigateMonth(direction);
    } else if (view === "week") {
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
            <p className="header-subtitle">Organiza y gestiona tus actividades diarias dentro del gimnasio</p>
          </div>
        </div>
        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right", marginLeft: "15px" }}>
            <Typography sx={{ margin: 0, fontSize: "20px", color: "#F8820B", fontWeight: "bold" }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ margin: 0, fontSize: "15px", color: "#ccc" }}>
              {roleName}
            </Typography>
          </Box>
          <IconButton
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: "#fff" }}
          >
            {usernameInitials ? (
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: roleName === "Colaborador" ? getMappedColor(admin?.color) : "#ff4300",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {usernameInitials}
              </Avatar>
            ) : (
              <AccountCircle sx={{ fontSize: "60px" }} />
            )}
          </IconButton>
          {renderMenu}
        </Grid>
      </header>

      <div className="calendar-controls">
        <div className="view-buttons">
          {["month", "week", "day"].map((viewType) => (
            <button
              key={viewType}
              onClick={() => setView(viewType)}
              className={`view-button ${view === viewType ? "active" : ""}`}
              disabled={loading}
            >
              {viewType === "month" ? "Mes" : viewType === "week" ? "Semana" : "Día"}
            </button>
          ))}
        </div>

        <div className="navigation-controls">
          <div className="navigation-buttons">
            <button onClick={() => handleNavigation(-1)} className="nav-button" disabled={loading}>
              <ChevronLeft />
            </button>
            <div className="current-period">{getNavigationLabel()}</div>
            <button onClick={() => handleNavigation(1)} className="nav-button" disabled={loading}>
              <ChevronRight />
            </button>
          </div>

          <button
            onClick={toggleSidebar}
            className="sidebar-toggle"
            title={showEventsSidebar ? "Ocultar eventos" : "Mostrar eventos"}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <div className="calendar-main">
        <div className="calendar-views">
          {loading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              Cargando...
            </div>
          )}
          {view === "month" && renderMonthView()}
          {view === "week" && renderWeekView()}
          {view === "day" && renderDayView()}
        </div>

        <div className={`events-sidebar ${showEventsSidebar ? "visible" : ""}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">{formatDate(selectedDate)}</h2>
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
                  <div className="sidebar-event-title">{event.title}</div>
                  <div className="sidebar-event-category">{getCategoryLabel(event.category)}</div>
                  <div className="sidebar-event-actions">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="sidebar-event-edit"
                      style={{
                        marginRight: "8px",
                        backgroundColor: "#ff4300",
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      Editar
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="sidebar-event-delete">
                      <X />
                    </button>
                  </div>
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
            <button onClick={handleAddEvent} className="add-event-button" disabled={loading}>
              <Plus />
            </button>
          </div>
        </div>

        {showEventForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">{editingEvent ? "Editar evento" : "Agregar nuevo evento"}</h3>
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
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    name="date"
                    value={formatDateForInput(newEvent.date)}
                    onChange={(e) => {
                      const date = createLocalDate(e.target.value); // Usar la función utilitaria
                      setNewEvent((prev) => ({ ...prev, date }));
                    }}
                    required
                    className="form-input"
                    disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="form-button primary" disabled={loading}>
                    {loading ? "Guardando..." : editingEvent ? "Actualizar Evento" : "Guardar Evento"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEventsSidebar && <div className="sidebar-overlay" onClick={toggleSidebar} />}
      </div>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
