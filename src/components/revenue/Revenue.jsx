import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FilterIcon from "@mui/icons-material/FilterList";

const Revenue = () => {
  const navigate = useNavigate();
  // Estados para datos del backend
  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [membershipsData, setMembershipsData] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [timeFilter, setTimeFilter] = useState("today");
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Función para navegar al perfil
  const handleProfileClick = () => {
    navigate("/user_profile");
    handleMenuClose();
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

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Obtener datos del usuario logeado (como en Home.jsx)
  let admin = null;
  try {
    const adminDataString = localStorage.getItem("user") || sessionStorage.getItem("user");
    admin = adminDataString ? JSON.parse(adminDataString) : null;
  } catch {
    admin = null;
  }

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

  const [expandedWidgets] = useState({
    earnings: true,
    products: true,
    memberships: true,
    newClients: true,
    expenses: true,
    topProducts: true,
  });

  // Función para obtener fechas según el filtro - CORREGIDA
  const getDateRange = (filter) => {
    switch (filter) {
      case "today": {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { start: today.toISOString(), end: tomorrow.toISOString() };
      }
      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return { start: yesterday.toISOString(), end: today.toISOString() };
      }
      case "week": {
        const today = new Date();
        const dayOfWeek = today.getDay();
        // Ajustar para que lunes sea el primer día de la semana
        const startOfWeek = new Date(today);
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return { start: startOfWeek.toISOString(), end: endOfWeek.toISOString() };
      }
      case "month": {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return { start: startOfMonth.toISOString(), end: endOfMonth.toISOString() };
      }
      case "year": {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear() + 1, 0, 1);
        return { start: startOfYear.toISOString(), end: endOfYear.toISOString() };
      }
      case "all": {
        // Para mostrar todos los datos sin filtro de fecha
        return { start: null, end: null };
      }
      default: {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { start: today.toISOString(), end: tomorrow.toISOString() };
      }
    }
  };

  // Fetch ventas de productos
  const fetchSalesData = useCallback(async () => {
    try {
      const { start, end } = getDateRange(timeFilter);
      let url = `${API}/api/products_sales/all?limit=1000`;

      // Solo agregar filtros de fecha si no es 'all'
      if (timeFilter !== "all" && start && end) {
        url += `&start_date=${start}&end_date=${end}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setSalesData(data.sales || []);
      }
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setSalesData([]);
    }
  }, [API, token, timeFilter]);

  // Fetch productos
  const fetchProductsData = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/products/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProductsData(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products data:", error);
      setProductsData([]);
    }
  }, [API, token]);

  // Fetch membresías
  const fetchMembershipsData = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/memberships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMembershipsData(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching memberships data:", error);
      setMembershipsData([]);
    }
  }, [API, token]);

  // Fetch clientes
  const fetchClientsData = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/clients/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setClientsData(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching clients data:", error);
      setClientsData([]);
    }
  }, [API, token]);

  // Cargar todos los datos
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSalesData(), fetchProductsData(), fetchMembershipsData(), fetchClientsData()]);
    setLoading(false);
  }, [fetchSalesData, fetchProductsData, fetchMembershipsData, fetchClientsData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Calcular datos del gráfico - MEJORADO
  const chartData = useMemo(() => {
    if (!salesData.length) {
      return [];
    }

    // Agrupar ventas por día usando el mismo formato que el calendario
    const salesByDay = {};
    salesData.forEach((sale) => {
      const date = new Date(sale.sale_date);
      // Formato consistente con el calendario: día abreviado + número
      const dayKey = date.toLocaleDateString("es-MX", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

      if (!salesByDay[dayKey]) {
        salesByDay[dayKey] = 0;
      }
      salesByDay[dayKey] += sale.total_sale || 0;
    });

    // Convertir a formato del gráfico y ordenar por fecha
    return Object.entries(salesByDay)
      .map(([day, income]) => ({
        day,
        income: Math.round(income),
        increase: Math.round(income * 0.1), // Simular incremento del 10%
      }))
      .sort((a, b) => {
        // Ordenar por fecha para mantener consistencia temporal
        const dateA = new Date(a.day);
        const dateB = new Date(b.day);
        return dateA - dateB;
      });
  }, [salesData]);

  // Calcular ganancias totales
  const totalEarnings = useMemo(() => {
    const productSales = salesData.reduce((sum, sale) => sum + (sale.total_sale || 0), 0);
    const membershipSales = membershipsData.reduce(
      (sum, membership) => sum + (membership.price || 0) * (membership.cantidad_usuarios || 0),
      0
    );
    return Math.round(productSales + membershipSales);
  }, [salesData, membershipsData]);

  // Calcular productos vendidos
  const totalProductsSold = useMemo(() => {
    return salesData.reduce((sum, sale) => sum + (sale.quantity_sold || 0), 0);
  }, [salesData]);

  // Calcular membresías vendidas
  const totalMembershipsSold = useMemo(() => {
    return membershipsData.reduce((sum, membership) => sum + (membership.cantidad_usuarios || 0), 0);
  }, [membershipsData]);

  // Calcular nuevos clientes (del período seleccionado)
  const newClients = useMemo(() => {
    if (timeFilter === "all") {
      return clientsData.length;
    }

    const { start, end } = getDateRange(timeFilter);
    const startDate = new Date(start);
    const endDate = new Date(end);

    return clientsData.filter((client) => {
      const clientDate = new Date(client.createdAt || client.start_date);
      return clientDate >= startDate && clientDate <= endDate;
    }).length;
  }, [clientsData, timeFilter]);

  // Top productos más vendidos - CORREGIDO EL PORCENTAJE
  const topProducts = useMemo(() => {
    if (!salesData.length || !productsData.length) {
      return [];
    }

    // Agrupar ventas por producto
    const productSales = {};
    salesData.forEach((sale) => {
      const productId = sale.product_id?._id || sale.product_id;
      if (!productSales[productId]) {
        productSales[productId] = {
          name: sale.product_name || "Producto desconocido",
          quantity: 0,
          earnings: 0,
        };
      }
      productSales[productId].quantity += sale.quantity_sold || 0;
      productSales[productId].earnings += sale.total_sale || 0;
    });

    // Convertir a array y ordenar por ganancias
    const sortedProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.earnings - a.earnings)
      .slice(0, 3);

    // Calcular porcentajes entre los 3 productos (100% total)
    const totalEarningsTop3 = sortedProducts.reduce((sum, product) => sum + product.earnings, 0);

    return sortedProducts.map((product, index) => ({
      id: String(index + 1).padStart(2, "0"),
      name: product.name,
      quantity: `${product.quantity} Unidades`,
      earnings: `$${Math.round(product.earnings)} MXN`,
      percentage: totalEarningsTop3 > 0 ? `${Math.round((product.earnings / totalEarningsTop3) * 100)}%` : "0%",
    }));
  }, [salesData, productsData]);

  // Handlers para filtros
  const handleFilterClick = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorElFilter(null);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
    handleFilterClose();
  };

  const getFilterLabel = (filter) => {
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
        return "Hoy";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <Typography sx={{ color: "white", fontSize: "18px" }}>Cargando datos...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
        <Grid item>
          <Typography variant="h4" sx={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>
            Ingresos
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: "16px", color: "#ccc", marginTop: "10px" }}>
            Esta sesión muestra las ganancias generadas por servicios, productos y membresías del gimnasio.
          </Typography>
        </Grid>

        {/* Perfil del usuario, notificacion y mensaje */}
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
            onClick={handleProfileMenuOpen}
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            sx={{ color: "#fff" }}
          >
            {usernameInitials ? (
              <Avatar sx={{ width: 50, height: 50, bgcolor: "#ff4300", color: "#fff", fontWeight: "bold" }}>
                {usernameInitials}
              </Avatar>
            ) : (
              <AccountCircle sx={{ fontSize: "60px" }} />
            )}
          </IconButton>
          {renderMenu}
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" sx={{ mb: 1, gap: 2, marginTop: "15px" }}>
        {/* Botón de filtro de tiempo */}
        <Grid item>
          <Button
            onClick={handleFilterClick}
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
            {getFilterLabel(timeFilter)}
          </Button>

          <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
            <MenuItem onClick={() => handleTimeFilterChange("all")}>General</MenuItem>
            <MenuItem onClick={() => handleTimeFilterChange("today")}>Hoy</MenuItem>
            <MenuItem onClick={() => handleTimeFilterChange("yesterday")}>Ayer</MenuItem>
            <MenuItem onClick={() => handleTimeFilterChange("week")}>Esta semana</MenuItem>
            <MenuItem onClick={() => handleTimeFilterChange("month")}>Este mes</MenuItem>
            <MenuItem onClick={() => handleTimeFilterChange("year")}>Este año</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: "5px" }}>
        {/* Columna izquierda */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ backgroundColor: "#45474B", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <Typography sx={{ color: "#F8820B", fontSize: "20px", fontWeight: "bold" }}>
                Ganancias Obtenidas
              </Typography>
            </Box>

            {expandedWidgets.earnings && (
              <>
                <Typography
                  variant="h3"
                  sx={{ fontSize: "38px", fontWeight: "bold", marginBottom: "10px", color: "white" }}
                >
                  ${totalEarnings.toLocaleString()}
                  <Box component="span" sx={{ fontSize: "16px", marginLeft: "10px", color: "#B1D690" }}>
                    (+9.65%)
                  </Box>
                  <Box component="span" sx={{ fontSize: "16px", marginLeft: "10px", color: "#E94560" }}>
                    (-2.35%)
                  </Box>
                </Typography>

                <Box sx={{ display: "flex", gap: "20px", marginBottom: "20px", marginTop: "20px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ width: "15px", height: "15px", borderRadius: "3px", backgroundColor: "#F8820B" }}></Box>
                    <Typography sx={{ fontSize: "14px", color: "white" }}>Ingresos Actual</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ width: "15px", height: "15px", borderRadius: "3px", backgroundColor: "#B1D690" }}></Box>
                    <Typography sx={{ fontSize: "14px", color: "white" }}>Incremento</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ width: "15px", height: "15px", borderRadius: "3px", backgroundColor: "#E94560" }}></Box>
                    <Typography sx={{ fontSize: "14px", color: "white" }}>Decremento</Typography>
                  </Box>
                </Box>

                <Box sx={{ height: "300px" }}>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barGap={0} barSize={30}>
                        <XAxis
                          dataKey="day"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#ffff", fontWeight: "bold" }}
                        />
                        <YAxis
                          tickFormatter={(tick) => `${tick}k`}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#ffff", fontWeight: "bold" }}
                        />
                        <Bar dataKey="income" stackId="a" fill="#F8820B" />
                        <Bar dataKey="increase" stackId="a" fill="#B1D690" />
                        <Bar dataKey="decrease" stackId="b" fill="#E94560" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        backgroundColor: "#3A3C3F",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#ccc",
                          fontSize: "18px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        NO HAY REGISTRO DE GANANCIAS
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Paper>

          <Paper sx={{ backgroundColor: "#45474B", borderRadius: "10px", padding: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <Typography sx={{ color: "#F8820B", fontSize: "20px", fontWeight: "bold" }}>
                Top de los productos más vendidos
              </Typography>
            </Box>

            {expandedWidgets.topProducts && (
              <TableContainer component={Box} sx={{ overflowX: "auto" }}>
                {topProducts.length > 0 ? (
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: "#fff",
                            borderBottom: "1px solid #F8820B",
                            padding: "15px 10px",
                            fontWeight: "bold",
                          }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            borderBottom: "1px solid #F8820B",
                            padding: "15px 10px",
                            fontWeight: "bold",
                          }}
                        >
                          Nombre del Producto
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            borderBottom: "1px solid #F8820B",
                            padding: "15px 10px",
                            fontWeight: "bold",
                          }}
                        >
                          Cantidad Vendida
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            borderBottom: "1px solid #F8820B",
                            padding: "15px 10px",
                            fontWeight: "bold",
                          }}
                        >
                          Ganancia Obtenida
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#fff",
                            borderBottom: "1px solid #F8820B",
                            padding: "15px 10px",
                            fontWeight: "bold",
                          }}
                        >
                          Porcentaje
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>
                            {product.id}
                          </TableCell>
                          <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>
                            {product.name}
                          </TableCell>
                          <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>
                            {product.quantity}
                          </TableCell>
                          <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>
                            {product.earnings}
                          </TableCell>
                          <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>
                            <Box
                              sx={{
                                backgroundColor: "#F8820B",
                                color: "black",
                                fontWeight: "bold",
                                padding: "5px 10px",
                                borderRadius: "20px",
                                display: "inline-block",
                                fontSize: "14px",
                              }}
                            >
                              {product.percentage}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      backgroundColor: "#3A3C3F",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#ccc",
                        fontSize: "18px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      NO HAY REGISTRO DE PRODUCTOS
                    </Typography>
                  </Box>
                )}
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Columna derecha */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ backgroundColor: "#45474B", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <Typography sx={{ color: "#F8820B", fontSize: "20px", fontWeight: "bold" }}>
                Productos Vendidos
              </Typography>
            </Box>

            {expandedWidgets.products && (
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px", color: "white" }}
                >
                  {totalProductsSold.toLocaleString()}
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px", fontSize: "16px" }}
                >
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px", fontWeight: "bold" }}>
                    +9.65%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px", color: "white" }}>
                    respecto al periodo anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ backgroundColor: "#45474B", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <Typography sx={{ color: "#F8820B", fontSize: "20px", fontWeight: "bold" }}>
                Membresías Vendidas
              </Typography>
            </Box>

            {expandedWidgets.memberships && (
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px", color: "white" }}
                >
                  {totalMembershipsSold}
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px", fontSize: "16px" }}
                >
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px", fontWeight: "bold" }}>
                    +10.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px", color: "white" }}>
                    respecto al periodo anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ backgroundColor: "#45474B", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <Typography sx={{ color: "#F8820B", fontSize: "20px", fontWeight: "bold" }}>Nuevos clientes</Typography>
            </Box>

            {expandedWidgets.newClients && (
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px", color: "white" }}
                >
                  {newClients}
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px", fontSize: "16px" }}
                >
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px", fontWeight: "bold" }}>
                    +2.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px", color: "white" }}>
                    respecto al periodo anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ backgroundColor: "#45474B", borderRadius: "10px", padding: "20px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <Typography sx={{ color: "#F8820B", fontSize: "20px", fontWeight: "bold" }}>Gastos totales</Typography>
            </Box>

            {expandedWidgets.expenses && (
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h2"
                  sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px", color: "white" }}
                >
                  ${Math.round(totalEarnings * 0.5).toLocaleString()}
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px", fontSize: "16px" }}
                >
                  <Typography component="span" sx={{ color: "#E94560", fontSize: "16px", fontWeight: "bold" }}>
                    -7.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px", color: "white" }}>
                    respecto al periodo anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Revenue;
