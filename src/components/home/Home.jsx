import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import dayjs from "dayjs";
import Typography from "@mui/material/Typography";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  IconButton,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

// Icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import FilterIcon from "@mui/icons-material/FilterList";
import PieChartIcon from "@mui/icons-material/PieChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotesIcon from "@mui/icons-material/Notes";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Avatar } from "@mui/material";

// Para las graficas
import { PieChart } from "@mui/x-charts/PieChart";

// Para el calendario
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Paper } from "@mui/material";
import "./style.scroll.css";

// Para las notas
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Para las ventas obtenidas
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function Home() {
  // Estados para datos de la API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [colaboratorsCount, setColaboratorsCount] = useState(0);
  const [membershipsCount, setMembershipsCount] = useState(0);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [notesData, setNotesData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Estados originales para filtrado independiente
  const [originalClientsData, setOriginalClientsData] = useState([]);
  const [originalSalesData, setOriginalSalesData] = useState([]);
  const [originalCalendarEvents, setOriginalCalendarEvents] = useState([]);
  const [originalNotesData, setOriginalNotesData] = useState([]);
  const [originalInventoryData, setOriginalInventoryData] = useState([]);

  // Para las notas
  // Estados separados para cada filtro
  const [membershipsFilter, setMembershipsFilter] = useState("Todo");
  const [notesFilter, setNotesFilter] = useState("Todo");
  const [salesFilter, setSalesFilter] = useState("Todo");
  const [calendarFilter, setCalendarFilter] = useState("Todo");
  const [originalColaboratorsData, setOriginalColaboratorsData] = useState([]);

  // Estados para menús independientes
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [membershipsMenuEl, setMembershipsMenuEl] = useState(null);
  const [notesMenuEl, setNotesMenuEl] = useState(null);
  const [salesMenuEl, setSalesMenuEl] = useState(null);
  const [calendarMenuEl, setCalendarMenuEl] = useState(null);

  const profileMenuOpen = Boolean(profileAnchorEl);
  const membershipsMenuOpen = Boolean(membershipsMenuEl);
  const notesMenuOpen = Boolean(notesMenuEl);
  const salesMenuOpen = Boolean(salesMenuEl);
  const calendarMenuOpen = Boolean(calendarMenuEl);

  const navigate = useNavigate();

  // Estados para filtro global
  const [globalTimeFilter, setGlobalTimeFilter] = useState("all");
  const [anchorElGlobalFilter, setAnchorElGlobalFilter] = useState(null);
  const [originalSalesDataGlobal, setOriginalSalesDataGlobal] = useState([]);

  // Manejadores para el menú del perfil
  const handleProfileMenuOpen = (e) => setProfileAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  // Manejadores para menús de filtros independientes
  const handleMembershipsMenuClose = () => setMembershipsMenuEl(null);

  const handleNotesMenuClose = () => setNotesMenuEl(null);

  const handleSalesMenuClose = () => setSalesMenuEl(null);

  const handleCalendarMenuClose = () => setCalendarMenuEl(null);

  // Función para navegar al perfil
  const handleProfileClick = () => {
    navigate("/user_profile");
    handleProfileMenuClose();
  };

  // Función para navegar al logout
  const handleLogoutClick = () => {
    navigate("/logout-confirm", { state: { from: location.pathname } });
    handleProfileMenuClose();
  };

  // Función para traducir categorías del inglés al español
  const translateCategory = (category) => {
    const translations = {
      meetings: "Reuniones",
      special: "Especial",
      training: "Entrenamiento",
      workshop: "Taller",
      maintenance: "Mantenimiento",
      event: "Evento",
      appointment: "Cita",
      class: "Clase",
      conference: "Conferencia",
      presentation: "Presentación",
      consultation: "Consulta",
      evaluation: "Evaluación",
      ceremony: "Ceremonia",
      celebration: "Celebración",
      break: "Descanso",
      lunch: "Almuerzo",
      dinner: "Cena",
      other: "Otro",
    };

    return translations[category?.toLowerCase()] || category || "General";
  };

  // Funciones para filtro global
  const getDateRange = (filter) => {
    switch (filter) {
      case "today": {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { start: today, end: tomorrow };
      }
      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return { start: yesterday, end: today };
      }
      case "week": {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return { start: startOfWeek, end: endOfWeek };
      }
      case "month": {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return { start: startOfMonth, end: endOfMonth };
      }
      case "year": {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
        return { start: startOfYear, end: endOfYear };
      }
      case "all": {
        return { start: null, end: null };
      }
      default: {
        return { start: null, end: null };
      }
    }
  };

  const filterDataByDateRange = (data, dateField, filter) => {
    if (filter === "all") return data;

    const { start, end } = getDateRange(filter);
    if (!start || !end) return data;

    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= start && itemDate < end;
    });
  };

  const handleGlobalFilterClick = (event) => {
    setAnchorElGlobalFilter(event.currentTarget);
  };

  const handleGlobalFilterClose = () => {
    setAnchorElGlobalFilter(null);
  };

  const handleGlobalTimeFilterChange = (filter) => {
    setGlobalTimeFilter(filter);
    handleGlobalFilterClose();
  };

  const getGlobalFilterLabel = (filter) => {
    switch (filter) {
      case "today":
        return "Hoy";
      case "yesterday":
        return "Ayer";
      case "week":
        return "Esta semana";
      case "month":
        return "Este mes";
      case "year":
        return "Este año";
      case "all":
        return "General";
      default:
        return "General";
    }
  };

  // Función para obtener token
  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Función mejorada para hacer peticiones a la API
  const apiRequest = async (endpoint) => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Token de autenticación no encontrado");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return {
        success: false,
        error: error.message || "Error desconocido",
      };
    }
  };

  // Función para calcular distribución de edades
  const calculateAgeDistribution = (clients) => {
    const ranges = {
      "14-17": 0,
      "18-25": 0,
      "26-35": 0,
      "36-45": 0,
      "46-55": 0,
      "56-65": 0,
      "65+": 0,
    };

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    clients.forEach((client) => {
      if (client.birth_date) {
        try {
          const birthDate = new Date(client.birth_date);
          if (isNaN(birthDate.getTime())) return;

          const birthYear = birthDate.getFullYear();
          const birthMonth = birthDate.getMonth();
          const birthDay = birthDate.getDate();

          let age = currentYear - birthYear;

          if (birthMonth > currentMonth || (birthMonth === currentMonth && birthDay > currentDay)) {
            age--;
          }

          if (age >= 14 && age <= 17) ranges["14-17"]++;
          else if (age >= 18 && age <= 25) ranges["18-25"]++;
          else if (age >= 26 && age <= 35) ranges["26-35"]++;
          else if (age >= 36 && age <= 45) ranges["36-45"]++;
          else if (age >= 46 && age <= 55) ranges["46-55"]++;
          else if (age >= 56 && age <= 65) ranges["56-65"]++;
          else if (age > 65) ranges["65+"]++;
        } catch (error) {
          console.error("Error procesando fecha de nacimiento:", error);
        }
      }
    });

    const total = Object.values(ranges).reduce((sum, count) => sum + count, 0);

    return [
      {
        id: 0,
        value: total > 0 ? Math.round((ranges["18-25"] / total) * 100) : 0,
        label: "18 - 25 años",
        color: "#36A2EB",
      },
      {
        id: 1,
        value: total > 0 ? Math.round((ranges["26-35"] / total) * 100) : 0,
        label: "26 - 35 años",
        color: "#FFCE56",
      },
      {
        id: 2,
        value: total > 0 ? Math.round((ranges["36-45"] / total) * 100) : 0,
        label: "36 - 45 años",
        color: "#4BC0C0",
      },
      {
        id: 3,
        value: total > 0 ? Math.round((ranges["46-55"] / total) * 100) : 0,
        label: "46 - 55 años",
        color: "#9966FF",
      },
      {
        id: 4,
        value: total > 0 ? Math.round((ranges["56-65"] / total) * 100) : 0,
        label: "56 - 65 años",
        color: "#FF9F40",
      },
      {
        id: 5,
        value: total > 0 ? Math.round((ranges["65+"] / total) * 100) : 0,
        label: "Más de 65 años",
        color: "#FF6384",
      },
    ];
  };

  // Función para procesar datos de ventas para el gráfico
  const processSalesData = (sales) => {
    const categories = {};
    let total = 0;

    sales.forEach((sale) => {
      if (sale.sale_status === "Exitosa") {
        total += sale.total_sale;

        const category = getProductCategory(sale.product_name);
        if (!categories[category]) {
          categories[category] = { total: 0, count: 0 };
        }
        categories[category].total += sale.total_sale;
        categories[category].count += 1;
      }
    });

    const chartData = Object.entries(categories).map(([category, data], index) => ({
      id: index,
      value: Math.round(data.total),
      label: category,
      color: getCategoryColor(category),
    }));

    return { chartData, total };
  };

  // Función auxiliar para determinar categoría del producto
  const getProductCategory = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes("membresía") || name.includes("membership")) return "Membresía";
    if (name.includes("entrenamiento") || name.includes("training")) return "Entrenamiento";
    if (name.includes("nutrición") || name.includes("suplemento")) return "Nutrición";
    if (name.includes("equipo") || name.includes("pesa") || name.includes("mancuerna")) return "Equipamiento";
    if (name.includes("clase") || name.includes("taller")) return "Taller/Clases";
    return "Evaluación Fitness";
  };

  // Función auxiliar para colores de categorías
  const getCategoryColor = (category) => {
    const colors = {
      Membresía: "#3498db",
      Entrenamiento: "#2ecc71",
      Nutrición: "#e74c3c",
      Equipamiento: "#f39c12",
      "Taller/Clases": "#27ae60",
      "Evaluación Fitness": "#9b59b6",
    };
    return colors[category] || "#3498db";
  };

  // Funciones para filtrar por fecha independientes
  const getStartDate = (filter) => {
    const now = new Date();
    switch (filter) {
      case "Hoy":
        return new Date(now.setHours(0, 0, 0, 0));
      case "Esta Semana":
        return new Date(now.setDate(now.getDate() - now.getDay()));
      case "Este Mes":
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case "Este Año":
        return new Date(now.getFullYear(), 0, 1);
      default:
        return null;
    }
  };

  const filterDataByDate = (data, dateField, filter) => {
    const startDate = getStartDate(filter);
    if (!startDate || filter === "Todo") return data;

    return data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate;
    });
  };

  // Replace the filterEventsByDate function with this corrected version:

  const filterEventsByDate = (events, filter, specificDate = null) => {
    // Si hay una fecha específica seleccionada, filtrar solo por esa fecha
    if (specificDate) {
      // Get the date in YYYY-MM-DD format without timezone issues
      const selectedYear = specificDate.getFullYear();
      const selectedMonth = String(specificDate.getMonth() + 1).padStart(2, "0");
      const selectedDay = String(specificDate.getDate()).padStart(2, "0");
      const selectedDateStr = `${selectedYear}-${selectedMonth}-${selectedDay}`;

      return events.filter((event) => {
        try {
          // Handle both string and object date formats from MongoDB
          let eventDate;
          if (typeof event.event_date === "string") {
            eventDate = new Date(event.event_date);
          } else if (event.event_date && event.event_date.$date) {
            // Handle MongoDB date object format
            eventDate = new Date(event.event_date.$date);
          } else {
            eventDate = new Date(event.event_date);
          }

          // Check if date is valid
          if (isNaN(eventDate.getTime())) {
            console.warn("Invalid event date:", event.event_date);
            return false;
          }

          // Get event date in YYYY-MM-DD format using UTC methods to avoid timezone issues
          const eventYear = eventDate.getUTCFullYear();
          const eventMonth = String(eventDate.getUTCMonth() + 1).padStart(2, "0");
          const eventDay = String(eventDate.getUTCDate()).padStart(2, "0");
          const eventDateStr = `${eventYear}-${eventMonth}-${eventDay}`;

          console.log("Comparing dates:", selectedDateStr, "vs", eventDateStr); // Debug log

          return eventDateStr === selectedDateStr;
        } catch (error) {
          console.error("Error processing event date:", error, event);
          return false;
        }
      });
    }

    // Si no hay fecha específica, usar el filtro original
    if (filter === "Todo") return events;

    const now = new Date();
    let endDate = new Date();

    switch (filter) {
      case "Hoy":
        endDate = new Date(now.setDate(now.getDate() + 1));
        break;
      case "Esta Semana":
        endDate = new Date(now.setDate(now.getDate() + 7));
        break;
      case "Este Mes":
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "Este Año":
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        return events;
    }

    return events.filter((event) => {
      try {
        let eventDate;
        if (typeof event.event_date === "string") {
          eventDate = new Date(event.event_date);
        } else if (event.event_date && event.event_date.$date) {
          eventDate = new Date(event.event_date.$date);
        } else {
          eventDate = new Date(event.event_date);
        }

        if (isNaN(eventDate.getTime())) {
          return false;
        }

        return eventDate >= now && eventDate <= endDate;
      } catch (error) {
        console.error("Error processing event date in filter:", error);
        return false;
      }
    });
  };
  const handleDateChange = (newDate) => {
    console.log("Selected date:", newDate.format("YYYY-MM-DD")); // Debug log
    setSelectedDate(newDate);

    // Create a date without timezone conversion issues
    const selectedYear = newDate.year();
    const selectedMonth = newDate.month(); // dayjs months are 0-indexed
    const selectedDay = newDate.date();

    // Create a new Date object in local timezone
    const jsDate = new Date(selectedYear, selectedMonth, selectedDay);
    console.log("JS Date for filtering:", jsDate.toISOString().split("T")[0]); // Debug log

    // Filtrar eventos por la fecha específica seleccionada
    const eventsForSelectedDate = filterEventsByDate(originalCalendarEvents, null, jsDate);
    console.log("Filtered events:", eventsForSelectedDate); // Debug log
    setCalendarEvents(eventsForSelectedDate.slice(0, 4));
  };
  // Función auxiliar para botones según categoría
  const getCategoryButtons = (category) => {
    const buttonMap = {
      // Categorías reales basadas en tus imágenes
      capacitacion: [{ text: "capacitacion", color: "#2c84beff" }],
      curso: [{ text: "curso", color: "#8873acff" }],
      productos: [{ text: "productos", color: "#5adc39a4" }],
      recordatorio: [{ text: "recordatorio", color: "#d81b60" }],
      reporte: [{ text: "reporte", color: "#f1c40fcb" }],
      nota: [{ text: "nota", color: "#e67d22ff" }],
      soporte: [{ text: "nota", color: "#15a084ff" }],
      quejas: [{ text: "nota", color: "#e74c3c" }],
      // Fallback para categorías no reconocidas
      default: [{ text: "General", color: "#666" }],
    };

    // Convertir categoría a minúsculas para comparación
    const categoryKey = category ? category.toLowerCase() : "default";
    return buttonMap[categoryKey] || buttonMap.default;
  };

  // Función memoizada para actualizar datos con filtro global
  const updateGlobalFilteredData = useCallback(() => {
    // 1. FILTRAR VENTAS (ya funciona)
    const globalFilteredSales = filterDataByDateRange(originalSalesDataGlobal, "sale_date", globalTimeFilter);
    const { chartData, total } = processSalesData(globalFilteredSales);
    setSalesData(chartData);
    setTotalSales(total);

    // 2. FILTRAR CLIENTES por fecha de registro o start_date
    const globalFilteredClients = filterDataByDateRange(originalClientsData, "start_date", globalTimeFilter);
    setUsersCount(globalFilteredClients.length);

    const globalFilteredProducts = filterDataByDateRange(originalInventoryData, "created_date", globalTimeFilter);
    const inventory = globalFilteredProducts.slice(0, 4).map((product, index) => ({
      id: index + 1,
      productos: product.name_product,
      stock: product.stock?.quantity || 0,
      precioTotal: `$${((product.price?.amount || 0) * (product.stock?.quantity || 0)).toFixed(2)}`,
    }));
    setInventoryData(inventory);

    // Recalcular distribución de edades con clientes filtrados
    const newAgeDistribution = calculateAgeDistribution(globalFilteredClients);
    setAgeDistribution(newAgeDistribution);

    // 3. FILTRAR MEMBRESÍAS ACTIVAS
    const activeMemberships = globalFilteredClients.filter((client) => client.status === "Activo");
    setMembershipsCount(activeMemberships.length);

    const globalFilteredColaborators = filterDataByDateRange(originalColaboratorsData, "created_at", globalTimeFilter);
    setColaboratorsCount(globalFilteredColaborators.length);

    // 4. FILTRAR NOTAS por fecha de creación
    const globalFilteredNotes = filterDataByDateRange(originalNotesData, "createdAt", globalTimeFilter);
    const formattedNotes = globalFilteredNotes.slice(0, 3).map((note) => ({
      ...note,
      buttons: getCategoryButtons(note.category),
    }));
    setNotesData(formattedNotes);

    // 5. FILTRAR EVENTOS DE CALENDARIO
    const globalFilteredEvents = filterDataByDateRange(originalCalendarEvents, "event_date", globalTimeFilter);
    // Si hay una fecha específica seleccionada, mantener ese filtro adicional
    const finalEvents = selectedDate
      ? filterEventsByDate(globalFilteredEvents, null, selectedDate.toDate())
      : globalFilteredEvents.slice(0, 4);
    setCalendarEvents(finalEvents);
  }, [
    globalTimeFilter,
    originalSalesDataGlobal,
    originalClientsData,
    originalNotesData,
    originalCalendarEvents,
    originalInventoryData,
    originalColaboratorsData,
    selectedDate,
  ]);

  // Función memoizada para cargar datos iniciales
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [productsRes, clientsRes, colaboratorsRes, calendarRes, notesRes, salesRes] = await Promise.all([
        apiRequest("/api/products/all"),
        apiRequest("/api/clients/all"),
        apiRequest("/api/colaborators/all"),
        apiRequest("/api/calendar/all"),
        apiRequest("/api/notes/all"),
        apiRequest("/api/products_sales/all"),
      ]);

      const criticalErrors = [productsRes, clientsRes, colaboratorsRes, salesRes]
        .filter((res) => !res.success)
        .map((res) => res.error);

      if (criticalErrors.length > 0) {
        console.warn("Algunos endpoints fallaron:", criticalErrors);
      }

      // Procesar inventario
      if (productsRes.success && productsRes.data?.products) {
        setOriginalInventoryData(productsRes.data.products); // ← Guardar originales
        // ✅ Solución:
        const inventory = productsRes.data.products.slice(0, 4).map((product, index) => ({
          id: index + 1,
          productos: product.name_product,
          stock: product.stock?.quantity || 0,
          precioTotal: `$${((product.price?.amount || 0) * (product.stock?.quantity || 0)).toFixed(2)}`,
        }));
        setInventoryData(inventory);
      }

      // Procesar y almacenar datos originales
      if (clientsRes.success && clientsRes.data && Array.isArray(clientsRes.data)) {
        setOriginalClientsData(clientsRes.data);
        setUsersCount(clientsRes.data.length);
        const ages = calculateAgeDistribution(clientsRes.data);
        setAgeDistribution(ages);
      }

      if (colaboratorsRes.success && colaboratorsRes.data && Array.isArray(colaboratorsRes.data)) {
        setOriginalColaboratorsData(colaboratorsRes.data); // ← NUEVO: Guardar datos originales
        setColaboratorsCount(colaboratorsRes.data.length);
      }

      // Procesar ventas
      if (salesRes.success && salesRes.data?.sales) {
        setOriginalSalesData(salesRes.data.sales);
        setOriginalSalesDataGlobal(salesRes.data.sales);
      }

      // Procesar calendario
      if (calendarRes.success && calendarRes.data?.events) {
        setOriginalCalendarEvents(calendarRes.data.events);
        const todayEvents = filterEventsByDate(calendarRes.data.events, null, dayjs().toDate());
        setCalendarEvents(todayEvents.slice(0, 4));
      }

      // Procesar notas
      if (notesRes.success && notesRes.data?.notes) {
        setOriginalNotesData(notesRes.data.notes);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(error.message || "Error desconocido al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Función memoizada para actualizar datos filtrados
  const updateFilteredData = useCallback(() => {
    // Actualizar membresías
    const filteredMemberships = filterDataByDate(
      originalClientsData.filter((client) => client.status === "Activo"),
      "start_date",
      membershipsFilter
    );
    setMembershipsCount(filteredMemberships.length);

    // Actualizar ventas
    const filteredSales = filterDataByDate(originalSalesData, "sale_date", salesFilter);
    const { chartData, total } = processSalesData(filteredSales);
    setSalesData(chartData);
    setTotalSales(total);

    // Actualizar calendario
    const filteredEvents = filterEventsByDate(originalCalendarEvents, calendarFilter, selectedDate.toDate());
    const formattedEvents = filteredEvents.slice(0, 4);
    setCalendarEvents(formattedEvents);

    // Actualizar notas
    const filteredNotes = filterDataByDate(originalNotesData, "createdAt", notesFilter);
    const formattedNotes = filteredNotes.slice(0, 3).map((note) => ({
      ...note,
      buttons: getCategoryButtons(note.category),
    }));
    setNotesData(formattedNotes);
  }, [
    membershipsFilter,
    salesFilter,
    calendarFilter,
    notesFilter,
    originalClientsData,
    originalSalesData,
    originalCalendarEvents,
    originalNotesData,
  ]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Actualizar datos con filtro global
  useEffect(() => {
    if (
      originalSalesDataGlobal.length > 0 ||
      originalClientsData.length > 0 ||
      originalNotesData.length > 0 ||
      originalCalendarEvents.length > 0 ||
      originalColaboratorsData.length > 0
    ) {
      updateGlobalFilteredData();
    }
  }, [updateGlobalFilteredData]);

  // Actualizar datos filtrados cuando cambien los filtros
  useEffect(() => {
    if (originalClientsData.length > 0) {
      updateFilteredData();
    }
  }, [updateFilteredData]);

  // Menús de filtros independientes
  const renderMembershipsMenu = (
    <Menu
      anchorEl={membershipsMenuEl}
      open={membershipsMenuOpen}
      onClose={handleMembershipsMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: "#f8820b",
          color: "Black",
          borderRadius: "20px",
        },
      }}
    >
      {["Hoy", "Esta Semana", "Este Mes", "Este Año", "Todo"].map((option) => (
        <MenuItem
          key={option}
          sx={{
            justifyContent: "center",
            textAlign: "center",
            backgroundColor: membershipsFilter === option ? "#272829" : "transparent",
            color: membershipsFilter === option ? "#f8820b" : "black",
            "&:hover": {
              backgroundColor: "#272829",
              color: "#f8820b",
            },
          }}
          onClick={() => {
            setMembershipsFilter(option);
            handleMembershipsMenuClose();
          }}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  );

  const renderNotesMenu = (
    <Menu
      anchorEl={notesMenuEl}
      open={notesMenuOpen}
      onClose={handleNotesMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: "#f8820b",
          color: "Black",
          borderRadius: "20px",
        },
      }}
    >
      {["Hoy", "Esta Semana", "Este Mes", "Este Año", "Todo"].map((option) => (
        <MenuItem
          key={option}
          sx={{
            justifyContent: "center",
            textAlign: "center",
            backgroundColor: notesFilter === option ? "#272829" : "transparent",
            color: notesFilter === option ? "#f8820b" : "black",
            "&:hover": {
              backgroundColor: "#272829",
              color: "#f8820b",
            },
          }}
          onClick={() => {
            setNotesFilter(option);
            handleNotesMenuClose();
          }}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  );

  const renderSalesMenu = (
    <Menu
      anchorEl={salesMenuEl}
      open={salesMenuOpen}
      onClose={handleSalesMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: "#f8820b",
          color: "Black",
          borderRadius: "20px",
        },
      }}
    >
      {["Hoy", "Esta Semana", "Este Mes", "Este Año", "Todo"].map((option) => (
        <MenuItem
          key={option}
          sx={{
            justifyContent: "center",
            textAlign: "center",
            backgroundColor: salesFilter === option ? "#272829" : "transparent",
            color: salesFilter === option ? "#f8820b" : "black",
            "&:hover": {
              backgroundColor: "#272829",
              color: "#f8820b",
            },
          }}
          onClick={() => {
            setSalesFilter(option);
            handleSalesMenuClose();
          }}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  );

  const renderCalendarMenu = (
    <Menu
      anchorEl={calendarMenuEl}
      open={calendarMenuOpen}
      onClose={handleCalendarMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: "#f8820b",
          color: "Black",
          borderRadius: "20px",
        },
      }}
    >
      {["Hoy", "Esta Semana", "Este Mes", "Este Año", "Todo"].map((option) => (
        <MenuItem
          key={option}
          sx={{
            justifyContent: "center",
            textAlign: "center",
            backgroundColor: calendarFilter === option ? "#272829" : "transparent",
            color: calendarFilter === option ? "#f8820b" : "black",
            "&:hover": {
              backgroundColor: "#272829",
              color: "#f8820b",
            },
          }}
          onClick={() => {
            setCalendarFilter(option);
            handleCalendarMenuClose();
          }}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  );

  // Menú del perfil
  const renderProfileMenu = (
    <Menu anchorEl={profileAnchorEl} open={profileMenuOpen} onClose={handleProfileMenuClose}>
      <MenuItem onClick={handleProfileClick}>Mi Perfil</MenuItem>
      <MenuItem onClick={handleLogoutClick}>Cerrar sesión</MenuItem>
    </Menu>
  );

  // Menú de filtro global
  const renderGlobalFilterMenu = (
    <Menu
      anchorEl={anchorElGlobalFilter}
      open={Boolean(anchorElGlobalFilter)}
      onClose={handleGlobalFilterClose}
      PaperProps={{
        sx: {
          backgroundColor: "#f8820b",
          color: "Black",
          borderRadius: "10px",
        },
      }}
    >
      <MenuItem onClick={() => handleGlobalTimeFilterChange("all")}>General</MenuItem>
      <MenuItem onClick={() => handleGlobalTimeFilterChange("today")}>Hoy</MenuItem>
      <MenuItem onClick={() => handleGlobalTimeFilterChange("yesterday")}>Ayer</MenuItem>
      <MenuItem onClick={() => handleGlobalTimeFilterChange("week")}>Esta semana</MenuItem>
      <MenuItem onClick={() => handleGlobalTimeFilterChange("month")}>Este mes</MenuItem>
      <MenuItem onClick={() => handleGlobalTimeFilterChange("year")}>Este año</MenuItem>
    </Menu>
  );

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

  // Buscar admin tanto en localStorage como en sessionStorage
  let admin = null;
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    admin = raw ? JSON.parse(raw) : null;
  } catch {
    admin = null;
  }

  // Función para obtener las iniciales del username (máximo 2 letras)
  const getInitials = (username) => {
    if (!username) return "";
    return username.slice(0, 2).toUpperCase();
  };

  // Función para obtener el primer nombre y primer apellido
  const getFirstNameAndLastName = (name, last_name) => {
    if (!name || !last_name) return "Usuario";

    const firstName = name.split(" ")[0];
    const firstLastName = last_name.split(" ")[0];

    return `${firstName} ${firstLastName}`;
  };

  const usernameInitials = admin ? getInitials(admin.username) : "";
  const displayName = admin ? getFirstNameAndLastName(admin.name, admin.last_name) : "Usuario";
  const roleName = admin?.role?.role_name || "Rol desconocido";

  // Mostrar loading si está cargando
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: "#f8820b" }} />
        <Typography variant="h6" sx={{ ml: 2, color: "#ffffff" }}>
          Cargando dashboard...
        </Typography>
      </Box>
    );
  }

  // Mostrar error si hay problemas
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al cargar los datos: {error}
        </Alert>
        <Typography variant="body2" color="textSecondary">
          Por favor, verifica tu conexión a internet y que el servidor backend esté funcionando correctamente.
        </Typography>
        <Button variant="contained" onClick={loadDashboardData} sx={{ mt: 2, backgroundColor: "#f8820b" }}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <div>
      {/* Primer nivel: Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
        {/* Título y descripción */}
        <Grid item>
          <Typography variant="h4" sx={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>
            Hola, {displayName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              margin: 0,
              fontSize: "16px",
              color: "#ccc",
              marginTop: "10px",
            }}
          >
            Bienvenido a sistema administrativo de Time Fit
          </Typography>
        </Grid>

        {/* Perfil del usuario */}
        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right", marginLeft: "15px" }}>
            <Typography
              sx={{
                margin: 0,
                fontSize: "20px",
                color: "#F8820B",
                fontWeight: "bold",
              }}
            >
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
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" sx={{ mb: 1, gap: 2, marginTop: "15px" }}>
        {/* Botón de filtro de tiempo */}
        <Grid item>
          <Button
            onClick={handleGlobalFilterClick}
            startIcon={<FilterIcon />}
            sx={{
              color: "#F8820B",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 20px",
              border: "1px solid #F8820B",
              marginRight: "20px",
              "&:hover": {
                backgroundColor: "#FF6600",
                border: "1px solid #FF6600",
                color: "white",
              },
            }}
          >
            {getGlobalFilterLabel(globalTimeFilter)}
          </Button>
        </Grid>
      </Grid>

      {/* Contenedor 1: Todos los widgets de home */}
      <Grid container marginTop={2} display="flex" flexDirection="row">
        <Grid container size={12} spacing={2} display="flex" flexDirection="column" justifyContent="center">
          <Grid container size={12} spacing={2} display="flex" flexDirection="row">
            <Grid size={{ lg: 3 }} sx={{ height: "23rem" }}>
              {/* Widget inventario */}
              <Card style={{ background: "#45474B", borderRadius: 30 }} sx={{ height: "100%" }}>
                <CardContent sx={{ padding: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box display="flex" alignItems="center">
                    <AssignmentIcon sx={{ fontSize: 40, color: "#FFFFFF", marginRight: 1 }} />
                    <Typography sx={{ fontWeight: "bold" }} variant="body1" color="#FFFFFF">
                      Inventario
                    </Typography>
                  </Box>

                  {inventoryData.length > 0 ? (
                    <TableContainer
                      sx={{
                        flexGrow: 1,
                        overflow: "auto",
                        maxHeight: "280px",
                        mt: 1,
                      }}
                      className="scroll-content"
                    >
                      <Table size="small" sx={{ width: "100%" }} aria-label="tabla de inventario">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                fontSize: "0.875rem",
                                padding: "8px 4px",
                                borderBottom: "5px solid #f8820b",
                                color: "white",
                                width: "10%",
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#45474B",
                                zIndex: 1,
                              }}
                            >
                              No
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.875rem",
                                padding: "8px 4px",
                                borderBottom: "5px solid #f8820b",
                                color: "white",
                                width: "40%",
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#45474B",
                                zIndex: 1,
                              }}
                            >
                              Productos
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.875rem",
                                padding: "8px 4px",
                                borderBottom: "5px solid #f8820b",
                                color: "white",
                                width: "15%",
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#45474B",
                                zIndex: 1,
                              }}
                            >
                              Stock
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.875rem",
                                padding: "8px 4px",
                                borderBottom: "5px solid #f8820b",
                                color: "white",
                                width: "35%",
                                textAlign: "center",
                                position: "sticky",
                                top: 0,
                                backgroundColor: "#45474B",
                                zIndex: 1,
                              }}
                            >
                              Precio Total
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {inventoryData.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell
                                sx={{
                                  borderBottomStyle: "none",
                                  padding: "6px 4px",
                                  color: "white",
                                  fontSize: "0.875rem",
                                }}
                                align="center"
                              >
                                {row.id}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottomStyle: "none",
                                  padding: "6px 4px",
                                  color: "white",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {row.productos}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottomStyle: "none",
                                  padding: "6px 4px",
                                  color: "white",
                                  fontSize: "0.875rem",
                                }}
                                align="center"
                              >
                                {row.stock}
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottomStyle: "none",
                                  padding: "6px 4px",
                                  color: "white",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {row.precioTotal}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    // Estado vacío con altura definida para mantener proporción
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexGrow: 1,
                        width: "100%",
                      }}
                    >
                      <Typography
                        color="white"
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        No hay productos disponibles
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Contenedor de la columna Usuarios, Colaboradores y Membresias vendidas */}
            <Grid container size={{ md: 9 }} spacing={2} display="flex" flexDirection="column">
              {/* Sub-contenedor-2, #2: de la columna usuarios, edades y ventas obtenidas */}
              <Grid display="flex" gap={2}>
                <Grid size={{ lg: 5 }} sx={{ height: "8.5rem" }}>
                  {/* Widget Cantidad de Usuarios */}
                  <Card
                    style={{
                      background: "#45474B",
                      borderRadius: 30,
                      padding: 0,
                    }}
                    sx={{ height: "100%" }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <GroupsIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography sx={{ fontWeight: "bold" }} variant="body1" color="#FFFFFF">
                          Cantidad Clientes
                        </Typography>
                      </Box>
                      <Typography
                        variant="h2"
                        textAlign={"center"}
                        color="initial"
                        sx={{ color: "#ffffff", fontWeight: 800 }}
                      >
                        {usersCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ lg: 5 }} sx={{ height: "8.5rem" }}>
                  {/* Widget Colaboradores */}
                  <Card style={{ background: "#45474B", borderRadius: 30 }} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <PersonIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography sx={{ fontWeight: "bold" }} variant="body1" color="#FFFFFF">
                          Cantidad Colaboradores
                        </Typography>
                      </Box>
                      <Typography
                        variant="h2"
                        textAlign="center"
                        color="initial"
                        sx={{ color: "#ffffff", fontWeight: 800 }}
                      >
                        {colaboratorsCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 5 }} sx={{ height: "8.5rem" }}>
                  {/* Widget Membs vendidas */}
                  <Card style={{ background: "#45474B", borderRadius: 30 }} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <BadgeIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography sx={{ fontWeight: "bold" }} variant="body1" color="#FFFFFF">
                          Membresias Vendidas
                        </Typography>
                      </Box>
                      <Typography
                        variant="h2"
                        textAlign="center"
                        color="initial"
                        sx={{ color: "#ffffff", fontWeight: 800 }}
                      >
                        {membershipsCount.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        textAlign="center"
                        color="#f8820b"
                        sx={{ display: "block", fontSize: "12px", mt: 1 }}
                      >
                        {membershipsFilter}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ md: 6.7 }} sx={{ height: "13.5rem" }}>
                  {/* Widget Edades de los usuarios*/}
                  <Card style={{ background: "#45474B", borderRadius: 30 }} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <PieChartIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography sx={{ fontWeight: "bold" }} variant="body1" color="#FFFFFF">
                          Edades de los usuarios
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          height: "80%",
                          alignItems: "center",
                        }}
                      >
                        {ageDistribution.length > 0 ? (
                          <PieChart
                            series={[
                              {
                                data: ageDistribution.map((item) => ({
                                  ...item,
                                  label: `${item.label} (${item.value}%)`,
                                })),
                                innerRadius: 20,
                                outerRadius: 60,
                                paddingAngle: 3,
                                cornerRadius: 3,
                                highlightScope: {
                                  faded: "global",
                                  highlighted: "item",
                                },
                                faded: {
                                  innerRadius: 20,
                                  additionalRadius: -20,
                                  color: "gray",
                                },
                                cx: 80,
                                cy: 70,
                                valueFormatter: () => "",
                              },
                            ]}
                            width={300}
                            height={160}
                            slotProps={{
                              legend: {
                                position: {
                                  vertical: "middle",
                                  horizontal: "right",
                                },
                                labelStyle: {
                                  fontSize: 10,
                                  fill: "#FFFFFF",
                                },
                                itemGap: 0,
                              },
                            }}
                            sx={{
                              "& .MuiChartsLegend-mark": {
                                width: "10px",
                                height: "10px",
                              },
                              "& .MuiChartsLegend-root": {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: "10px",
                                marginTop: "10px",
                              },
                            }}
                          />
                        ) : (
                          <Typography color="white" sx={{ fontSize: "14px", fontWeight: "bold" }}>
                            No hay datos de edades disponibles
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ md: 5.3 }} height={2} zIndex={1}>
                  {/* Widget Calendario */}
                  <Card
                    style={{
                      background: "#45474B",
                      height: "30.5rem",
                      borderRadius: 30,
                      minHeight: "580px",
                    }}
                  >
                    <CardContent sx={{ overflow: "auto", maxHeight: "38rem", padding: 2 }} className="scroll-content">
                      <Box display="flex" alignItems="center">
                        <CalendarTodayIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography sx={{ fontWeight: "bold" }} variant="body1" color="#FFFFFF">
                          Calendario
                        </Typography>
                      </Box>

                      {/* <Typography
                        variant="caption"
                        color="#f8820b"
                        sx={{ display: "block", fontSize: "12px", mb: 1, textAlign: "center" }}
                      >
                        Filtro: {calendarFilter}
                      </Typography> */}

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Paper
                          sx={{
                            padding: 1,
                            maxHeight: 300,
                            maxWidth: "100%",
                            margin: "auto",
                            marginTop: 0,
                            background: "transparent",
                            boxShadow: "none",
                            paddingBottom: 0,
                          }}
                        >
                          <DateCalendar
                            value={selectedDate}
                            onChange={handleDateChange}
                            sx={{
                              "& .MuiPickersCalendarHeader-root": {
                                justifyContent: "center",
                              },
                              "& .MuiPickersCalendarHeader-label": {
                                fontWeight: "bold",
                                color: "#f8820b",
                              },
                              "& .MuiPickersDay-root": {
                                color: "#fff",
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor: "#f8820b", // Cambio: hover naranja
                                  color: "#000",
                                },
                                "&.Mui-focusVisible, &:focus": {
                                  backgroundColor: "#f8820b", // Cambio: foco naranja
                                  color: "#000",
                                },
                              },
                              "& .Mui-selected": {
                                backgroundColor: "#f8820b !important", // Cambio: seleccionado naranja
                                color: "#000 !important",
                                "&:hover": {
                                  backgroundColor: "#e64a19 !important", // Cambio: hover seleccionado naranja más oscuro
                                  color: "#000 !important",
                                },
                                "&.Mui-focusVisible, &:focus": {
                                  backgroundColor: "#f8820b !important", // Cambio: foco seleccionado naranja
                                  color: "#000 !important",
                                },
                              },
                              "& .MuiPickersArrowSwitcher-button": {
                                color: "#f8820b",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "#f8820b",
                                border: "2px solid #f8820b",
                                borderRadius: "50%",
                              },
                              "& .MuiDayCalendar-weekDayLabel": {
                                color: "#fff",
                                fontWeight: "bold",
                              },
                            }}
                          />
                        </Paper>
                      </LocalizationProvider>
                      {/* Actividades Programadas */}
                      <Box sx={{ marginTop: 5, padding: 2, paddingBottom: 0 }}>
                        <Typography
                          color="#FFFFFF"
                          sx={{
                            fontWeight: "bold",
                            marginBottom: 0.5,
                            fontSize: "13px",
                          }}
                        >
                          Actividades Programadas
                        </Typography>
                        <Typography
                          color="#f8820b"
                          sx={{
                            fontWeight: "bold",
                            marginBottom: 1,
                            fontSize: "13px",
                          }}
                        >
                          {selectedDate.toDate().toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>

                        <Grid container display="flex" direction="row" sx={{ marginTop: 1 }}>
                          {calendarEvents.length > 0 ? (
                            calendarEvents.map((event, index) => (
                              <Grid container direction="row" alignItems="center" size={{ xs: 12 }} key={index}>
                                <Grid size={{ xs: 3 }}>
                                  <Typography sx={{ fontWeight: 800, fontSize: "30px" }} color="#FFFFFF">
                                    {event.start_time}
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 2 }}>
                                  <Typography
                                    color="#f8820b"
                                    sx={{
                                      fontSize: "50px",
                                      fontWeight: 800,
                                      textAlign: "center",
                                    }}
                                  >
                                    |
                                  </Typography>
                                </Grid>
                                <Grid size={{ xs: 7 }}>
                                  <Typography
                                    color="white"
                                    sx={{
                                      fontSize: "12px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {event.title}
                                  </Typography>
                                  <Typography
                                    color="#f8820b"
                                    sx={{
                                      fontSize: "13px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {translateCategory(event.category)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            ))
                          ) : (
                            <Grid container direction="row" alignItems="center" size={{ xs: 12 }}>
                              <Grid size={{ xs: 12 }}>
                                <Typography
                                  color="white"
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                >
                                  No hay eventos programados
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Sub-contenedor 2, #1: Notas, Ventas Obtenidas */}
          <Grid container spacing={2} sx={{ mt: 2, width: "100%" }}>
            {/* CARD DE NOTAS */}
            <Grid
              xs={12}
              md={7}
              sx={{
                minWidth: "350px",
                maxWidth: "600px", // FORZAR ancho máximo absoluto
                width: "100%",
                flexBasis: "20%", // Forzar el ancho del Grid
                flexGrow: 0, // NO permitir crecimiento
                flexShrink: 0, // NO permitir encogimiento
              }}
            >
              <Card
                style={{ background: "#45474B", borderRadius: 30 }}
                sx={{
                  height: "18rem",
                  width: "100%",
                  minHeight: "330px",
                  maxWidth: "100%",
                  display: "table", // CLAVE: Usar table layout
                  tableLayout: "fixed", // CLAVE: Layout fijo
                }}
              >
                <CardContent
                  sx={{
                    padding: 3,
                    height: "100%",
                    width: "100%",
                    display: "table-cell", // CLAVE: Comportamiento de celda
                    verticalAlign: "top",
                    overflow: "hidden",
                  }}
                >
                  <Box display="flex" alignItems="center" sx={{ mb: 2, width: "100%" }}>
                    <NotesIcon sx={{ fontSize: 40, color: "#FFFFFF", marginRight: 1, flexShrink: 0 }} />
                    <Typography
                      sx={{ fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      variant="body1"
                      color="#FFFFFF"
                    >
                      Notas
                    </Typography>
                  </Box>

                  {/* Contenedor con display table para forzar ancho */}
                  <Box
                    sx={{
                      minHeight: "200px",
                      width: "100%",
                      display: "table", // CLAVE: Table layout
                      tableLayout: "fixed", // CLAVE: Layout fijo
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        display: "table-cell", // CLAVE: Celda de tabla
                        verticalAlign: "top",
                        overflow: "auto",
                        maxHeight: "240px",
                        width: "100%",
                      }}
                      className="scroll-content"
                    >
                      {notesData.length > 0 ? (
                        <Box sx={{ width: "100%" }}>
                          {notesData.map((note, index) => (
                            <Box key={note._id || index} sx={{ mb: 2, width: "100%" }}>
                              {/* Fila de contenido usando flexbox con ancho fijo */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                  mb: 1,
                                }}
                              >
                                {/* Contenido del texto - flex grow */}
                                <Box sx={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
                                  <Typography
                                    color="#f8820b"
                                    sx={{
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      width: "100%",
                                    }}
                                    title={note.title}
                                  >
                                    {note.title}
                                  </Typography>
                                  <Typography
                                    color="white"
                                    sx={{
                                      fontSize: "13px",
                                      fontWeight: "bold",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      width: "100%",
                                    }}
                                    title={note.content}
                                  >
                                    {note.content.substring(0, 40)}...
                                  </Typography>
                                </Box>

                                {/* Fecha - ancho fijo */}
                                <Box sx={{ width: "80px", flexShrink: 0, textAlign: "right" }}>
                                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    <CalendarMonthIcon
                                      sx={{
                                        marginRight: 0.5,
                                        color: "#fff",
                                        fontSize: "14px",
                                      }}
                                    />
                                    <Typography
                                      color="white"
                                      sx={{
                                        fontWeight: "bold",
                                        fontSize: "10px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {new Date(note.createdAt).toLocaleDateString("es-MX", {
                                        day: "2-digit",
                                        month: "2-digit",
                                      })}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              {/* Botones con ancho controlado */}
                              <Box
                                sx={{
                                  ml: "30px", // Alinear con el contenido (ancho del checkbox)
                                  display: "flex",
                                  gap: 0.5,
                                  width: "calc(100% - 30px)", // Restar el margen
                                  overflow: "hidden",
                                }}
                              >
                                {note.buttons.slice(0, 2).map((button, btnIndex) => (
                                  <Button
                                    key={btnIndex}
                                    variant="contained"
                                    size="small"
                                    sx={{
                                      borderRadius: 3,
                                      backgroundColor: button.color,
                                      textTransform: "capitalize",
                                      fontSize: "10px",
                                      padding: "2px 8px",
                                      minWidth: "50px",
                                      maxWidth: "70px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      height: "24px",
                                    }}
                                    title={button.text}
                                  >
                                    {button.text}
                                  </Button>
                                ))}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "200px",
                            width: "100%",
                          }}
                        >
                          <Typography
                            color="white"
                            sx={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            No hay notas disponibles
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD DE VENTAS */}
            <Grid xs={2} md={5} sx={{ minWidth: "635px" }}>
              <Card
                style={{ background: "#45474B", borderRadius: 30 }}
                sx={{
                  height: "18rem",
                  width: "100%",
                  minHeight: "330px",
                  minWidth: "635px", // Ancho mínimo para mantener proporción
                }}
              >
                <CardContent
                  sx={{
                    overflow: "hidden",
                    height: "100%",
                    padding: 2,
                    minHeight: "16rem", // Altura mínima del contenido
                  }}
                >
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    <BarChartIcon sx={{ fontSize: 32, color: "#FFFFFF", marginRight: 1 }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }} variant="body1" color="#FFFFFF">
                      Ventas Obtenidas
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: "#FF8C00",
                      mb: 1,
                      fontSize: "16px",
                    }}
                  >
                    {new Date().toLocaleDateString("es-ES", {
                      month: "long",
                    })}
                  </Typography>

                  {/* Contenedor del gráfico con altura fija */}
                  <Box sx={{ height: "150px", width: "100%", mb: 2 }}>
                    {salesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={salesData}
                          margin={{
                            top: 5,
                            right: 5,
                            left: 5,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#fff" }} axisLine={{ stroke: "#555" }} />
                          <YAxis tick={{ fontSize: 10, fill: "#fff" }} axisLine={{ stroke: "#555" }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#45474B",
                              border: "1px solid #f8820b",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />
                          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                            {salesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      // Estado vacío con altura fija para mantener proporción
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "150px", // Misma altura que el gráfico
                          width: "100%",
                          border: "2px dashed #555", // Borde opcional para mostrar el área
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          color="white"
                          sx={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          No hay datos de ventas disponibles
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Total siempre visible */}
                  <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Typography variant="h5" color="#FFFFFF" sx={{ fontWeight: "bold", fontSize: "18px" }}>
                      ${" "}
                      {totalSales.toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography variant="body2" color="#FFFFFF" sx={{ fontSize: "12px" }}>
                      Total del período
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Renderizar todos los menús */}
      {renderProfileMenu}
      {renderGlobalFilterMenu}
      {renderMembershipsMenu}
      {renderNotesMenu}
      {renderSalesMenu}
      {renderCalendarMenu}
    </div>
  );
}
