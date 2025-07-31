import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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
import Checkbox from "@mui/material/Checkbox";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Para las ventas obtenidas
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
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

  // Para las notas
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // Estados separados para cada menú
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const profileMenuOpen = Boolean(profileAnchorEl);
  const filterMenuOpen = Boolean(filterAnchorEl);

  const navigate = useNavigate();

  // Manejadores para el menú del perfil
  const handleProfileMenuOpen = (e) => setProfileAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  // Manejadores para los menús de filtros
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

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

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} - ${response.statusText}`
        );
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
  // Función mejorada para calcular distribución de edades
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
          // Validar que la fecha sea válida
          if (isNaN(birthDate.getTime())) return;

          const birthYear = birthDate.getFullYear();
          const birthMonth = birthDate.getMonth();
          const birthDay = birthDate.getDate();

          // Calcular edad exacta
          let age = currentYear - birthYear;

          // Ajustar si el cumpleaños aún no ha ocurrido este año
          if (
            birthMonth > currentMonth ||
            (birthMonth === currentMonth && birthDay > currentDay)
          ) {
            age--;
          }

          // Asignar al rango correspondiente
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
        value: total > 0 ? Math.round((ranges["14-17"] / total) * 100) : 0,
        label: "14 - 17 años",
        color: "#FF6384",
      },
      {
        id: 1,
        value: total > 0 ? Math.round((ranges["18-25"] / total) * 100) : 0,
        label: "18 - 25 años",
        color: "#36A2EB",
      },
      {
        id: 2,
        value: total > 0 ? Math.round((ranges["26-35"] / total) * 100) : 0,
        label: "26 - 35 años",
        color: "#FFCE56",
      },
      {
        id: 3,
        value: total > 0 ? Math.round((ranges["36-45"] / total) * 100) : 0,
        label: "36 - 45 años",
        color: "#4BC0C0",
      },
      {
        id: 4,
        value: total > 0 ? Math.round((ranges["46-55"] / total) * 100) : 0,
        label: "46 - 55 años",
        color: "#9966FF",
      },
      {
        id: 5,
        value: total > 0 ? Math.round((ranges["56-65"] / total) * 100) : 0,
        label: "56 - 65 años",
        color: "#FF9F40",
      },
      {
        id: 6,
        value: total > 0 ? Math.round((ranges["65+"] / total) * 100) : 0,
        label: "Más de 65 años",
        color: "#C9CBCF",
      },
    ];
  };

  // const calculateAgeDistribution = (clients) => {
  //   const ranges = {
  //     "14-17": 0,
  //     "18-25": 0,
  //     "26-35": 0,
  //     "36-45": 0,
  //     "46-55": 0,
  //     "56-65": 0,
  //     "65+": 0,
  //   };

  //   clients.forEach(client => {
  //     if (client.birth_date) {
  //       const age = new Date().getFullYear() - new Date(client.birth_date).getFullYear();

  //       if (age >= 14 && age <= 17) ranges["14-17"]++;
  //       else if (age >= 18 && age <= 25) ranges["18-25"]++;
  //       else if (age >= 26 && age <= 35) ranges["26-35"]++;
  //       else if (age >= 36 && age <= 45) ranges["36-45"]++;
  //       else if (age >= 46 && age <= 55) ranges["46-55"]++;
  //       else if (age >= 56 && age <= 65) ranges["56-65"]++;
  //       else if (age > 65) ranges["65+"]++;
  //     }
  //   });

  //   const total = Object.values(ranges).reduce((sum, count) => sum + count, 0);

  //   return [
  //     { id: 0, value: total > 0 ? Math.round((ranges["14-17"] / total) * 100) : 0, label: "14 - 17 años", color: "#FF6384" },
  //     { id: 1, value: total > 0 ? Math.round((ranges["18-25"] / total) * 100) : 0, label: "18 - 25 años", color: "#36A2EB" },
  //     { id: 2, value: total > 0 ? Math.round((ranges["26-35"] / total) * 100) : 0, label: "26 - 35 años", color: "#FFCE56" },
  //     { id: 3, value: total > 0 ? Math.round((ranges["36-45"] / total) * 100) : 0, label: "36 - 45 años", color: "#4BC0C0" },
  //     { id: 4, value: total > 0 ? Math.round((ranges["46-55"] / total) * 100) : 0, label: "46 - 55 años", color: "#9966FF" },
  //     { id: 5, value: total > 0 ? Math.round((ranges["56-65"] / total) * 100) : 0, label: "56 - 65 años", color: "#FF9F40" },
  //     { id: 6, value: total > 0 ? Math.round((ranges["65+"] / total) * 100) : 0, label: "Más de 65 años", color: "#C9CBCF" },
  //   ];
  // };

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

    const chartData = Object.entries(categories).map(
      ([category, data], index) => ({
        id: index,
        value: Math.round(data.total),
        label: category,
        color: getCategoryColor(category),
      })
    );

    return { chartData, total };
  };

  // Función auxiliar para determinar categoría del producto
  const getProductCategory = (productName) => {
    const name = productName.toLowerCase();
    if (name.includes("membresía") || name.includes("membership"))
      return "Membresía";
    if (name.includes("entrenamiento") || name.includes("training"))
      return "Entrenamiento";
    if (name.includes("nutrición") || name.includes("suplemento"))
      return "Nutrición";
    if (
      name.includes("equipo") ||
      name.includes("pesa") ||
      name.includes("mancuerna")
    )
      return "Equipamiento";
    if (name.includes("clase") || name.includes("taller"))
      return "Taller/Clases";
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

  // Función para formatear eventos del calendario
  const formatCalendarEvents = (events) => {
    const today = new Date();
    const todayEvents = events.filter((event) => {
      const eventDate = new Date(event.event_date);
      return eventDate.toDateString() === today.toDateString();
    });

    return todayEvents.slice(0, 4);
  };

  // Función para formatear notas
  const formatNotes = (notes) => {
    return notes.slice(0, 3).map((note) => ({
      ...note,
      buttons: getCategoryButtons(note.category),
    }));
  };

  // Función auxiliar para botones según categoría
  const getCategoryButtons = (category) => {
    const buttonMap = {
      reporte: [
        { text: "Reporte", color: "#c58f10" },
        { text: "Soporte", color: "#ec2525" },
      ],
      recordatorio: [
        { text: "Recordatorio", color: "#07aaa2" },
        { text: "Productos", color: "#499a0b" },
      ],
      curso: [
        { text: "Curso", color: "#c02279" },
        { text: "Instalación", color: "#1b72af" },
      ],
    };
    return (
      buttonMap[category] || [
        { text: "General", color: "#666" },
        { text: "Info", color: "#999" },
      ]
    );
  };

  // Función optimizada para cargar todos los datos
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Hacer todas las peticiones en paralelo
      const [
        productsRes,
        clientsRes,
        colaboratorsRes,
        membershipsRes,
        calendarRes,
        notesRes,
        salesRes,
      ] = await Promise.all([
        apiRequest("/api/products/all"),
        apiRequest("/api/clients/all"),
        apiRequest("/api/colaborators/all"),
        apiRequest("/api/memberships/all"),
        apiRequest("/api/calendar/all"),
        apiRequest("/api/notes/all"),
        apiRequest("/api/products_sales/all"),
      ]);

      // Verificar errores críticos
      const criticalErrors = [
        productsRes,
        clientsRes,
        colaboratorsRes,
        salesRes,
      ]
        .filter((res) => !res.success)
        .map((res) => res.error);

      if (criticalErrors.length > 0) {
        console.warn("Algunos endpoints fallaron:", criticalErrors);
        // No bloquear la carga si solo fallan endpoints no críticos
      }

      // Procesar inventario
      if (productsRes.success && productsRes.data?.products) {
        const inventory = productsRes.data.products
          .slice(0, 10)
          .map((product, index) => ({
            id: index + 1,
            productos: product.name_product,
            stock: product.stock?.quantity || 0,
            precioTotal: `$${(
              (product.price?.amount || 0) * (product.stock?.quantity || 0)
            ).toFixed(2)}`,
          }));
        setInventoryData(inventory);
      }

      // Procesar usuarios
      if (
        clientsRes.success &&
        clientsRes.data &&
        Array.isArray(clientsRes.data)
      ) {
        setUsersCount(clientsRes.data.length);
        const ages = calculateAgeDistribution(clientsRes.data);
        setAgeDistribution(ages);

        // Contar membresías activas
        const activeMemberships = clientsRes.data.filter(
          (client) => client.status === "Activo"
        ).length;
        setMembershipsCount(activeMemberships);
      }

      // Procesar colaboradores
      if (
        colaboratorsRes.success &&
        colaboratorsRes.data &&
        Array.isArray(colaboratorsRes.data)
      ) {
        setColaboratorsCount(colaboratorsRes.data.length);
      }

      // Procesar ventas
      if (salesRes.success && salesRes.data?.sales) {
        const { chartData, total } = processSalesData(salesRes.data.sales);
        setSalesData(chartData);
        setTotalSales(total);
      }

      // Procesar calendario
      if (calendarRes.success && calendarRes.data?.events) {
        const formattedEvents = formatCalendarEvents(calendarRes.data.events);
        setCalendarEvents(formattedEvents);
      }

      // Procesar notas
      if (notesRes.success && notesRes.data?.notes) {
        const formattedNotes = formatNotes(notesRes.data.notes);
        setNotesData(formattedNotes);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(error.message || "Error desconocido al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Menú del perfil
  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      open={profileMenuOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Mi Perfil</MenuItem>
      <MenuItem onClick={handleLogoutClick}>Cerrar sesión</MenuItem>
    </Menu>
  );

  // Menú de filtros (para reutilizar en todos los widgets)
  const renderFilterMenu = (
    <Menu
      id="menu-opciones"
      anchorEl={filterAnchorEl}
      open={filterMenuOpen}
      onClose={handleFilterClose}
      MenuListProps={{
        "aria-labelledby": "boton-menu",
        sx: {
          padding: 0,
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: "#f8820b",
          color: "Black",
          borderRadius: "20px",
        },
      }}
    >
      {["Hoy", "Esta Semana", "Este Mes", "Este Año"].map((option) => (
        <MenuItem
          key={option}
          sx={{
            justifyContent: "center",
            textAlign: "center",
            "&:hover": {
              backgroundColor: "#272829",
              color: "#f8820b",
            },
          }}
          onClick={handleFilterClose}
        >
          {option}
        </MenuItem>
      ))}
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
  const displayName = admin
    ? getFirstNameAndLastName(admin.name, admin.last_name)
    : "Usuario";
  const roleName = admin?.role?.role_name || "Rol desconocido";

  // Mostrar loading si está cargando
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
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
          Por favor, verifica tu conexión a internet y que el servidor backend
          esté funcionando correctamente.
        </Typography>
        <Button
          variant="contained"
          onClick={loadDashboardData}
          sx={{ mt: 2, backgroundColor: "#f8820b" }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <div>
      {/* Primer nivel: Header */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: "10px 0 20px 0" }}
      >
        {/* Título y descripción */}
        <Grid item>
          <Typography
            variant="h4"
            sx={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}
          >
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
            <Typography
              variant="body2"
              sx={{ margin: 0, fontSize: "15px", color: "#ccc" }}
            >
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
                  bgcolor:
                    roleName === "Colaborador"
                      ? getMappedColor(admin?.color)
                      : "#ff4300",
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

      {/* Contenedor 1: Todos los widgets de home */}
      <Grid container marginTop={2} display="flex" flexDirection="row">
        {/* Sub-Contenedor 1: Lado izquierdo, columna Inventario y Notas */}
        <Grid
          container
          size={12}
          spacing={2}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Grid
            container
            size={12}
            spacing={2}
            display="flex"
            flexDirection="row"
          >
            <Grid size={{ lg: 3 }} sx={{ height: "23rem" }}>
              {/* Widget inventario */}
              <Card
                style={{ background: "#45474B", borderRadius: 30 }}
                sx={{ height: "100%" }}
              >
                <CardContent sx={{ padding: 3 }}>
                  <Box display="flex" alignItems="center">
                    <AssignmentIcon
                      sx={{ fontSize: 40, color: "#FFFFFF", marginRight: 1 }}
                    />
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      variant="body1"
                      color="#FFFFFF"
                    >
                      Inventario
                    </Typography>
                  </Box>

                  <TableContainer>
                    <Table
                      size="small"
                      sx={{ width: "100%" }}
                      aria-label="tabla de inventario"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontSize: "0.875rem",
                              padding: "8px 4px",
                              borderBottom: "5px solid #f8820b",
                              color: "white",
                              width: "10%",
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
                </CardContent>
              </Card>
            </Grid>

            {/* Contenedor de la columna Usuarios, Colaboradores y Membresias vendidas */}
            <Grid
              container
              size={{ md: 9 }}
              spacing={2}
              display="flex"
              flexDirection="column"
            >
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
                        <Typography
                          sx={{ fontWeight: "bold" }}
                          variant="body1"
                          color="#FFFFFF"
                        >
                          Cantidad Usuarios
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
                  <Card
                    style={{ background: "#45474B", borderRadius: 30 }}
                    sx={{ height: "100%" }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <PersonIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography
                          sx={{ fontWeight: "bold" }}
                          variant="body1"
                          color="#FFFFFF"
                        >
                          Cantidad Colaboradores
                        </Typography>

                        <div style={{ marginLeft: "auto" }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={
                              filterMenuOpen ? "menu-opciones" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={filterMenuOpen ? "true" : undefined}
                            onClick={handleFilterClick}
                            sx={{
                              backgroundColor: "#FF8C00",
                              borderRadius: "15px",
                              width: "40px",
                              height: "24px",
                              padding: 0,
                              minWidth: "40px",
                              "&:hover": {
                                backgroundColor: "#e67e00",
                              },
                            }}
                          >
                            <KeyboardArrowDownIcon
                              sx={{ color: "black", fontSize: "20px" }}
                            />
                          </IconButton>
                        </div>
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
                  <Card
                    style={{ background: "#45474B", borderRadius: 30 }}
                    sx={{ height: "100%" }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <BadgeIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography
                          sx={{ fontWeight: "bold" }}
                          variant="body1"
                          color="#FFFFFF"
                        >
                          Membresias Vendidas
                        </Typography>

                        <div style={{ marginLeft: "auto" }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={
                              filterMenuOpen ? "menu-opciones" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={filterMenuOpen ? "true" : undefined}
                            onClick={handleFilterClick}
                            sx={{
                              backgroundColor: "#FF8C00",
                              borderRadius: "15px",
                              width: "40px",
                              height: "24px",
                              padding: 0,
                              minWidth: "40px",
                              "&:hover": {
                                backgroundColor: "#e67e00",
                              },
                            }}
                          >
                            <KeyboardArrowDownIcon
                              sx={{ color: "black", fontSize: "20px" }}
                            />
                          </IconButton>
                        </div>
                      </Box>
                      <Typography
                        variant="h2"
                        textAlign="center"
                        color="initial"
                        sx={{ color: "#ffffff", fontWeight: 800 }}
                      >
                        {membershipsCount.toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ md: 6.7 }} sx={{ height: "13.5rem" }}>
                  {/* Widget Edades de los usuarios*/}
                  <Card
                    style={{ background: "#45474B", borderRadius: 30 }}
                    sx={{ height: "100%" }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <PieChartIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography
                          sx={{ fontWeight: "bold" }}
                          variant="body1"
                          color="#FFFFFF"
                        >
                          Edades de los usuarios
                        </Typography>

                        <div style={{ marginLeft: "auto" }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={
                              filterMenuOpen ? "menu-opciones" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={filterMenuOpen ? "true" : undefined}
                            onClick={handleFilterClick}
                            sx={{
                              backgroundColor: "#FF8C00",
                              borderRadius: "15px",
                              width: "40px",
                              height: "24px",
                              padding: 0,
                              minWidth: "40px",
                              "&:hover": {
                                backgroundColor: "#e67e00",
                              },
                            }}
                          >
                            <KeyboardArrowDownIcon
                              sx={{ color: "black", fontSize: "20px" }}
                            />
                          </IconButton>
                        </div>
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
                                  label: `${item.label} (${item.value}%)`, // Muestra el % en la leyenda
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
                                valueFormatter: () => '',
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
                          <Typography
                            color="white"
                            sx={{ fontSize: "14px", fontWeight: "bold" }}
                          >
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
                    }}
                  >
                    <CardContent
                      sx={{ overflow: "auto", maxHeight: "28rem", padding: 2 }}
                      className="scroll-content"
                    >
                      <Box display="flex" alignItems="center">
                        <CalendarTodayIcon
                          sx={{
                            fontSize: 40,
                            color: "#FFFFFF",
                            marginRight: 1,
                          }}
                        />
                        <Typography
                          sx={{ fontWeight: "bold" }}
                          variant="body1"
                          color="#FFFFFF"
                        >
                          Calendario
                        </Typography>

                        <div style={{ marginLeft: "auto" }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={
                              filterMenuOpen ? "menu-opciones" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={filterMenuOpen ? "true" : undefined}
                            onClick={handleFilterClick}
                            sx={{
                              backgroundColor: "#FF8C00",
                              borderRadius: "15px",
                              width: "40px",
                              height: "24px",
                              padding: 0,
                              minWidth: "40px",
                              "&:hover": {
                                backgroundColor: "#e67e00",
                              },
                            }}
                          >
                            <KeyboardArrowDownIcon
                              sx={{ color: "black", fontSize: "20px" }}
                            />
                          </IconButton>
                        </div>
                      </Box>
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
                                  backgroundColor: "#e64a19",
                                },
                                "&.Mui-focusVisible, &:focus": {
                                  backgroundColor: "#f8820b",
                                  color: "#000",
                                },
                              },
                              "& .Mui-selected": {
                                backgroundColor: "#f8820b",
                                color: "#000",
                                "&:hover": {
                                  backgroundColor: "#e64a19",
                                },
                                "&.Mui-focusVisible, &:focus": {
                                  backgroundColor: "#f8820b",
                                  color: "#000",
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
                          {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Typography>

                        <Grid
                          container
                          display="flex"
                          direction="row"
                          sx={{ marginTop: 1 }}
                        >
                          {calendarEvents.length > 0 ? (
                            calendarEvents.map((event, index) => (
                              <Grid
                                container
                                direction="row"
                                alignItems="center"
                                size={{ xs: 12 }}
                                key={index}
                              >
                                <Grid size={{ xs: 3 }}>
                                  <Typography
                                    sx={{ fontWeight: 800, fontSize: "30px" }}
                                    color="#FFFFFF"
                                  >
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
                                    {event.category}
                                  </Typography>
                                </Grid>
                              </Grid>
                            ))
                          ) : (
                            <Grid
                              container
                              direction="row"
                              alignItems="center"
                              size={{ xs: 12 }}
                            >
                              <Grid size={{ xs: 12 }}>
                                <Typography
                                  color="white"
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                >
                                  No hay eventos programados para hoy
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
          <Grid container size={8} display="flex" flexDirection="row">
            <Grid display="flex" gap={2}>
              <Grid size={{ md: "grow" }} sx={{ height: "16rem" }}>
                {/* Widget Notas */}
                <Card
                  style={{ background: "#45474B", borderRadius: 30 }}
                  sx={{ height: "100%", width: "100%" }}
                >
                  <CardContent
                    sx={{ padding: 3, overflow: "auto", maxHeight: "100%" }}
                    className="scroll-content"
                  >
                    <Box display="flex" alignItems="center">
                      <NotesIcon
                        sx={{ fontSize: 40, color: "#FFFFFF", marginRight: 1 }}
                      />
                      <Typography
                        sx={{ fontWeight: "bold" }}
                        variant="body1"
                        color="#FFFFFF"
                      >
                        Notas
                      </Typography>

                      <div style={{ marginLeft: "auto" }}>
                        <IconButton
                          aria-label="más opciones"
                          aria-controls={
                            filterMenuOpen ? "menu-opciones" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={filterMenuOpen ? "true" : undefined}
                          onClick={handleFilterClick}
                          sx={{
                            backgroundColor: "#FF8C00",
                            borderRadius: "15px",
                            width: "40px",
                            height: "24px",
                            padding: 0,
                            minWidth: "40px",
                            "&:hover": {
                              backgroundColor: "#e67e00",
                            },
                          }}
                        >
                          <KeyboardArrowDownIcon
                            sx={{ color: "black", fontSize: "20px" }}
                          />
                        </IconButton>
                      </div>
                    </Box>
                    <Grid
                      container
                      display="flex"
                      direction="row"
                      sx={{ marginTop: 1 }}
                    >
                      {notesData.length > 0 ? (
                        notesData.map((note, index) => (
                          <React.Fragment key={note._id || index}>
                            <Grid
                              container
                              direction="row"
                              alignItems="center"
                              size={{ xs: 12 }}
                            >
                              <Grid size={{ xs: 1 }}>
                                <Checkbox
                                  {...label}
                                  sx={{
                                    borderRadius: "50%",
                                    color: "#f8820b",
                                    "&.Mui-checked": {
                                      color: "#f8820b",
                                    },
                                  }}
                                />
                              </Grid>
                              <Grid size={{ xs: 6 }}>
                                <Typography
                                  color="#f8820b"
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    ml: 1,
                                  }}
                                >
                                  {note.title}
                                </Typography>
                                <Typography
                                  color="white"
                                  sx={{
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                    ml: 1,
                                  }}
                                >
                                  {note.content.substring(0, 50)}...
                                </Typography>
                              </Grid>
                              <Grid size={{ xs: 5 }}>
                                <Box display="flex" alignItems="center">
                                  <CalendarMonthIcon
                                    sx={{
                                      marginRight: 1,
                                      color: "#fff",
                                      ml: "auto",
                                    }}
                                  ></CalendarMonthIcon>
                                  <Typography
                                    color="white"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {new Date(
                                      note.createdAt
                                    ).toLocaleDateString("es-MX")}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                            <Box sx={{ ml: 5, mt: 1, mb: 2 }}>
                              {note.buttons.map((button, btnIndex) => (
                                <Button
                                  key={btnIndex}
                                  variant="contained"
                                  sx={{
                                    borderRadius: 5,
                                    mr: 2,
                                    backgroundColor: button.color,
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {button.text}
                                </Button>
                              ))}
                            </Box>
                          </React.Fragment>
                        ))
                      ) : (
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          size={{ xs: 12 }}
                        >
                          <Grid size={{ xs: 12 }}>
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
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ md: "grow" }} sx={{ height: "16rem" }}>
                {/* Widget Ventas obtenidas */}
                <Card
                  style={{ background: "#45474B", borderRadius: 30 }}
                  sx={{ height: "100%" }}
                >
                  <CardContent
                    sx={{ overflow: "auto", maxHeight: "100%", padding: 3 }}
                    className="scroll-content"
                  >
                    <Box display="flex" alignItems="center">
                      <BarChartIcon
                        sx={{ fontSize: 40, color: "#FFFFFF", marginRight: 1 }}
                      />
                      <Typography
                        sx={{ fontWeight: "bold" }}
                        variant="body1"
                        color="#FFFFFF"
                      >
                        Ventas Obtenidas
                      </Typography>

                      <div style={{ marginLeft: "auto" }}>
                        <IconButton
                          aria-label="más opciones"
                          aria-controls={
                            filterMenuOpen ? "menu-opciones" : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={filterMenuOpen ? "true" : undefined}
                          onClick={handleFilterClick}
                          sx={{
                            backgroundColor: "#FF8C00",
                            borderRadius: "15px",
                            width: "40px",
                            height: "24px",
                            padding: 0,
                            minWidth: "40px",
                            "&:hover": {
                              backgroundColor: "#e67e00",
                            },
                          }}
                        >
                          <KeyboardArrowDownIcon
                            sx={{ color: "black", fontSize: "20px" }}
                          />
                        </IconButton>
                      </div>
                    </Box>

                    <Typography
                      variant="h5"
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: "#FF8C00",
                        my: 1,
                      }}
                    >
                      {new Date().toLocaleDateString("es-ES", {
                        month: "long",
                      })}
                    </Typography>

                    {salesData.length > 0 ? (
                      <BarChart
                        width={350}
                        height={200}
                        data={salesData}
                        margin={{
                          top: 5,
                          right: 0,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                          {salesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 200,
                        }}
                      >
                        <Typography
                          color="white"
                          sx={{ fontSize: "14px", fontWeight: "bold" }}
                        >
                          No hay datos de ventas disponibles
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Typography
                        variant="h4"
                        color="#FFFFFF"
                        sx={{ fontWeight: "bold" }}
                      >
                        ${" "}
                        {totalSales.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                      <Typography variant="body2" color="#FFFFFF">
                        En este mes.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {renderProfileMenu}
      {renderFilterMenu}
    </div>
  );
}
