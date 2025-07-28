import React, { useState, useMemo, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Paper,
  Box,
  InputBase,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Avatar,
  TablePagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Today as TodayIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Badge as BadgeIcon,
  Store as StoreIcon,
} from "@mui/icons-material";

import ModalVenta from "./ModalVenta";

const TablaVentas = ({ collapsed = false }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ventaEditar, setVentaEditar] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [ventaParaCancelar, setVentaParaCancelar] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Estados para paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // Usar la misma estructura que CardProduct
  const API_URL = import.meta.env.VITE_API_URL;

  // Obtener información del usuario del localStorage (igual que CardProduct)
  const getUserInfo = () => {
    try {
      const userFromLocal = localStorage.getItem("user");
      if (userFromLocal) {
        return JSON.parse(userFromLocal);
      }
      return null;
    } catch (err) {
      console.error("Error obteniendo usuario:", err);
      return null;
    }
  };

  const user = getUserInfo();
  
  const isAdmin = user?.role?.role_name === "Administrador";

  // Debug del usuario
  useEffect(() => {
    console.log("=== DEBUG USUARIO ===");
    console.log("Usuario completo:", user);
    console.log("¿Es admin?", isAdmin);
    console.log("Token presente:", !!localStorage.getItem("token"));
    console.log("API_URL:", API_URL);
    console.log("==================");
  }, [user, isAdmin, API_URL]);

  const abrirModalRegistro = () => {
    setModoEdicion(false);
    setVentaEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEdicion = (venta) => {
    setModoEdicion(true);
    setVentaEditar(venta);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setVentaEditar(null);
    setModoEdicion(false);
  };

  const handleMenuOpen = (e, venta) => {
    console.log("=== ABRIENDO MENÚ ===");
    console.log("Venta seleccionada:", venta);
    console.log("ID de venta:", venta?._id);
    console.log("==================");
    
    setAnchorElMenu(e.currentTarget);
    setVentaSeleccionada(venta);
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null);
    setVentaSeleccionada(null);
  };

  const handleFilterClick = (e) => setAnchorElFilter(e.currentTarget);

  const handleFilterClose = () => setAnchorElFilter(null);

  const handleSort = (criterion) => {
    setSortBy(criterion);
    setPage(0); // Reset a la primera página cuando se ordena
    handleFilterClose();
  };

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fetch ventas usando la misma estructura que CardProduct - MEJORADO
  const fetchVentas = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No se encontró token de autenticación");
      setVentas([]);
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching ventas from:", `${API_URL}/api/products_sales/all`);

      const response = await fetch(`${API_URL}/api/products_sales/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error fetching sales: ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos recibidos del backend:", data);

      // Manejar diferentes estructuras de respuesta
      let salesArray = [];
      if (data && Array.isArray(data.sales)) {
        salesArray = data.sales;
      } else if (data && Array.isArray(data.products_sales)) {
        salesArray = data.products_sales;
      } else if (Array.isArray(data)) {
        salesArray = data;
      } else {
        console.warn("Estructura de datos inesperada:", data);
        salesArray = [];
      }

      console.log("Ventas procesadas:", salesArray.length);
      setVentas(salesArray);
      
    } catch (err) {
      console.error("Error completo al obtener ventas:", err);
      setVentas([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  // Función para manejar el éxito del guardado
  const handleGuardadoExitoso = () => {
    console.log("Venta guardada exitosamente, actualizando tabla...");
    cerrarModal();
    // Recargar las ventas después de un breve delay
    setTimeout(() => {
      fetchVentas();
    }, 500);
  };

  // Filtrado y ordenamiento de ventas
  const filteredAndSorted = useMemo(() => {
    if (!Array.isArray(ventas)) {
      return [];
    }

    let arr = ventas.filter((v) => {
      if (!v) return false;

      const searchLower = searchTerm.toLowerCase();
      return (
        (v.product_name && v.product_name.toLowerCase().includes(searchLower)) ||
        (v.product_id?.name_product && v.product_id.name_product.toLowerCase().includes(searchLower)) ||
        (v.sale_code && v.sale_code.toLowerCase().includes(searchLower)) ||
        (v.client_name && v.client_name.toLowerCase().includes(searchLower)) ||
        (v.seller_name && v.seller_name.toLowerCase().includes(searchLower)) ||
        (v.seller_id?.name && v.seller_id.name.toLowerCase().includes(searchLower))
      );
    });

    // Ordenamiento
    switch (sortBy) {
      case "producto":
        arr.sort((a, b) => {
          const nameA = a.product_name || a.product_id?.name_product || "";
          const nameB = b.product_name || b.product_id?.name_product || "";
          return nameA.localeCompare(nameB);
        });
        break;
      case "fecha":
        arr.sort((a, b) => new Date(b.sale_date || 0) - new Date(a.sale_date || 0));
        break;
      case "total":
        arr.sort((a, b) => (b.total_sale || 0) - (a.total_sale || 0));
        break;
      case "cliente":
        arr.sort((a, b) => (a.client_name || "").localeCompare(b.client_name || ""));
        break;
      case "codigo":
        arr.sort((a, b) => (a.sale_code || "").localeCompare(b.sale_code || ""));
        break;
      default:
        // Ordenar por fecha descendente por defecto
        arr.sort((a, b) => new Date(b.sale_date || 0) - new Date(a.sale_date || 0));
        break;
    }

    return arr;
  }, [searchTerm, sortBy, ventas]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredAndSorted.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSorted, page, rowsPerPage]);

  // Reset página cuando cambia el filtro de búsqueda
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  // FUNCIÓN CORREGIDA PARA CANCELAR VENTA
  const handleCancelSale = async () => {
    if (!ventaParaCancelar) {
      console.error("No hay venta para cancelar");
      console.log("ventaParaCancelar:", ventaParaCancelar);
      return;
    }

    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("No se encontró token de autenticación");
      return;
    }

    try {
      setLoading(true);

      console.log("=== CANCELANDO VENTA ===");
      console.log("Venta a cancelar:", ventaParaCancelar);
      console.log("ID:", ventaParaCancelar._id);
      console.log("Código:", ventaParaCancelar.sale_code);
      console.log("========================");

      const response = await fetch(`${API_URL}/api/products_sales/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: ventaParaCancelar._id,
          reason: "Cancelada desde el panel de administración",
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        let errorMessage = `Error HTTP: ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.log("Error data:", errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("Respuesta del servidor:", responseData);

      // Cerrar diálogos y limpiar estados
      setOpenDeleteDialog(false);
      setVentaParaCancelar(null);
      setVentaSeleccionada(null);

      // Recargar ventas inmediatamente
      await fetchVentas();
      
      alert("Venta cancelada exitosamente");

    } catch (err) {
      console.error("Error completo cancelando venta:", err);
      
      let userMessage = "Error al cancelar la venta. ";
      
      if (err.message.includes("403")) {
        userMessage += "No tienes permisos para realizar esta acción.";
      } else if (err.message.includes("404")) {
        userMessage += "La venta no fue encontrada.";
      } else if (err.message.includes("400")) {
        userMessage += "La venta ya está cancelada o hay un error en los datos.";
      } else {
        userMessage += "Intenta de nuevo más tarde.";
      }
      
      alert(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";

      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.log(err)
      return "Fecha inválida";
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(numAmount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Exitosa":
      case "Completada":
        return "#4CAF50";
      case "Pendiente":
        return "#FF9800";
      case "Cancelada":
        return "#F44336";
      default:
        return "#95a5a6";
    }
  };

  // Función para obtener el nombre del producto
  const getProductName = (venta) => {
    return venta.product_name || venta.product_id?.name_product || "Producto sin nombre";
  };

  // Función para obtener el nombre del vendedor
  const getSellerName = (venta) => {
    return venta.seller_name || venta.seller_id?.name || "Vendedor";
  };
  
  if (loading && ventas.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <CircularProgress sx={{ color: "#F8820B" }} />
        <Typography sx={{ ml: 2, color: "#fff" }}>Cargando ventas...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Botones de acción */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={8}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "30px",
              boxShadow: 3,
              width: collapsed ? "420px" : "1200px",
              maxWidth: "100%",
              height: "48px",
              backgroundColor: "#fff",
              border: "1px solid #444",
            }}
          >
            <IconButton type="submit">
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Buscar alguna venta realizada.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ ml: 2, flex: 1, fontSize: "18px" }}
            />
          </Paper>
        </Grid>
        <Grid item>
          <Button
            sx={{
              backgroundColor: "#F8820B",
              color: "black",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              "&:hover": {
                backgroundColor: "#FF6600",
                color: "white",
              },
            }}
            onClick={abrirModalRegistro}
          >
            REALIZAR VENTA
            <ShoppingCartIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{
              color: "#F8820B",
              fontWeight: "500",
              borderRadius: "8px",
              padding: "10px 20px",
              border: "1px solid #F8820B",
              "&:hover": {
                backgroundColor: "#FF6600",
                border: "1px solid #FF6600",
                color: "white",
              },
            }}
          >
            Filtrar
          </Button>
        </Grid>
      </Grid>

      {/* Contador de resultados */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" sx={{ color: "#ccc" }}>
          Mostrando {Math.min(paginatedData.length, rowsPerPage)} de {filteredAndSorted.length} ventas
          {filteredAndSorted.length !== ventas.length && ` (${ventas.length} total)`}
        </Typography>
        {(searchTerm || sortBy) && (
          <Chip
            label="Filtros activos"
            size="small"
            sx={{
              bgcolor: "#F8820B",
              color: "#000",
              fontWeight: "bold",
            }}
          />
        )}
      </Box>

      {/* Menú de filtrado */}
      <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
        <MenuItem onClick={() => handleSort("fecha")}>Ordenar por Fecha</MenuItem>
        <MenuItem onClick={() => handleSort("producto")}>Ordenar por Producto</MenuItem>
        <MenuItem onClick={() => handleSort("total")}>Ordenar por Total</MenuItem>
        <MenuItem onClick={() => handleSort("cliente")}>Ordenar por Cliente</MenuItem>
        <MenuItem onClick={() => handleSort("codigo")}>Ordenar por Código</MenuItem>
      </Menu>

      {/* Loading overlay cuando se está procesando algo */}
      {loading && ventas.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Actualizando datos...
        </Alert>
      )}

      {/* TABLA DE VENTAS - CORREGIDA SIN BARRAS DUPLICADAS */}
      <Grid item xs={12}>
        <Card
          sx={{
            backgroundColor: "#2A2D31",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            border: "1px solid #404040",
          }}
        >
          {/* Contenedor con scroll horizontal único */}
          <Box
            sx={{
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            {/* Header de la tabla que se mueve con el scroll */}
            <Box
              sx={{
                background: "#4d4a49ff",
                padding: "20px 24px",
                position: "relative",
                minWidth: "1400px",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              />
              <Grid container spacing={1} sx={{ position: "relative", zIndex: 1, minWidth: "1400px" }}>
              <Grid item xs={0.6}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  ID
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <InventoryIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  PRODUCTO
                </Typography>
              </Grid>
              <Grid item xs={1.8}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <BadgeIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  CANTIDAD VENDIDA.
                </Typography>
              </Grid>
              <Grid item xs={1.5}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <PersonIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  CLIENTE
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <GroupIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  VENDEDOR
                </Typography>
              </Grid>
              <Grid item xs={1.3}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <TodayIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  FECHA
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  ESTADO
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <MoneyIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  TOTAL
                </Typography>
              </Grid>
              <Grid item xs={0.8}>
                <Typography
                  sx={{
                    fontWeight: "700",
                    color: "#fff",
                    fontSize: "14px",
                    letterSpacing: "0.5px",
                    textAlign: "center",
                  }}
                >
                  ACCIONES
                </Typography>
              </Grid>
            </Grid>
            </Box>

            {/* Contenido de la tabla que se mueve con el header */}
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  maxHeight: "400px", // Altura fija para la tabla
                  overflowY: "auto",
                  overflowX: "hidden", // Eliminar scroll horizontal aquí
                  minWidth: "1400px",
                }}
              >
              {paginatedData.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: "#888",
                    fontSize: "16px",
                    minWidth: "1400px",
                  }}
                >
                  <ReceiptIcon sx={{ fontSize: "48px", color: "#555", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#ccc", mb: 1 }}>
                    {filteredAndSorted.length === 0 ? "No hay ventas registradas" : "No se encontraron ventas"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    {filteredAndSorted.length === 0 ? "Realiza tu primera venta" : "Intenta con otros términos de búsqueda"}
                  </Typography>
                </Box>
              ) : (
                paginatedData.map((venta, idx) => (
                  <Box key={venta._id || idx}>
                    <Box
                      sx={{
                        padding: "20px 24px",
                        transition: "all 0.2s ease",
                        position: "relative",
                        minWidth: "1400px", // Ancho mínimo consistente
                        "&:hover": {
                          backgroundColor: "#353842",
                          transform: "translateX(4px)",
                          boxShadow: "inset 4px 0 0 #F8820B",
                        },
                      }}
                    >
                      <Grid container spacing={1} alignItems="center" sx={{ minWidth: "1400px" }}>
                        <Grid item xs={0.6}>
                          <Chip
                            label={`#${page * rowsPerPage + idx + 1}`}
                            size="small"
                            sx={{
                              backgroundColor: "#f0420dff",
                              color: "#fff",
                              fontWeight: "600",
                              fontSize: "11px",
                              height: "24px",
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.8}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 35,
                                height: 35,
                                bgcolor: "#2e53ccff",
                                color: "#fff",
                                fontWeight: "800",
                                fontSize: "16px",
                              }}
                            >
                              <StoreIcon sx={{ fontSize: "18px" }} />
                            </Avatar>
                            <Box>
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  lineHeight: 1.2,
                                }}
                              >
                                {getProductName(venta)}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#aaa",
                                  fontSize: "14px",
                                  lineHeight: 1.2,
                                }}
                              >
                                {formatCurrency(venta.unit_price)} c/u
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={1.5}>
                          <Chip
                            label={`${venta.quantity_sold || 0} ${venta.product_id?.stock?.unit || "pieza"}`}
                            size="small"
                            sx={{
                              color: "#fff",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.5}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box>
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontSize: "14px",
                                  fontWeight: "800",
                                  lineHeight: 1.2,
                                }}
                              >
                                {venta.client_name || "Cliente sin nombre"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={2}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box>
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontSize: "14px",
                                  fontWeight: "800",
                                  lineHeight: 1.2,
                                }}
                              >
                                {getSellerName(venta)}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={1.3}>
                          <Typography
                            sx={{
                              color: "#ccc",
                              fontSize: "14px",
                            }}
                          >
                            {formatDate(venta.sale_date)}
                          </Typography>
                        </Grid>

                        <Grid item xs={1}>
                          <Chip
                            label={venta.sale_status || "Sin estado"}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(venta.sale_status),
                              color: "#fff",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <Typography
                            sx={{
                              color: "#2ecc71",
                              fontSize: "14px",
                              fontWeight: "bold",
                            }}
                          >
                            {formatCurrency(venta.total_sale)}
                          </Typography>
                        </Grid>

                        <Grid item xs={0.8}>
                          <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, venta)}
                              sx={{
                                color: "#F8820B",
                                backgroundColor: "rgba(248, 130, 11, 0.1)",
                                borderRadius: "8px",
                                padding: "8px",
                                "&:hover": {
                                  backgroundColor: "rgba(248, 130, 11, 0.2)",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <MoreVertIcon sx={{ fontSize: "18px" }} />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {idx < paginatedData.length - 1 && <Divider sx={{ borderColor: "#404040", mx: 3 }} />}
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Box>

          {/* Paginación */}
          {filteredAndSorted.length > 0 && (
            <Box
              sx={{
                borderTop: "1px solid #404040",
                backgroundColor: "#2A2D31",
                px: 2,
              }}
            >
              <TablePagination
                component="div"
                count={filteredAndSorted.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[7, 14, 21, 50]}
                labelRowsPerPage="Filas por página:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                }
                sx={{
                  color: "#fff",
                  "& .MuiTablePagination-toolbar": {
                    color: "#fff",
                  },
                  "& .MuiTablePagination-select": {
                    color: "#fff",
                  },
                  "& .MuiTablePagination-selectIcon": {
                    color: "#fff",
                  },
                  "& .MuiTablePagination-actions button": {
                    color: "#F8820B",
                    "&:hover": {
                      backgroundColor: "rgba(248, 130, 11, 0.1)",
                    },
                    "&.Mui-disabled": {
                      color: "#666",
                    },
                  },
                  "& .MuiTablePagination-displayedRows": {
                    color: "#ccc",
                  },
                }}
              />
            </Box>
          )}
        </Card>
      </Grid>

      {/* Menú de acciones - CORREGIDO */}
      <Menu
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            backgroundColor: "#4d4a49ff",
            border: "1px solid #404040",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            abrirModalEdicion(ventaSeleccionada);
            handleMenuClose();
          }}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "#353842",
              color: "#F8820B",
            },
          }}
        >
          Ver Detalles
        </MenuItem>
        {isAdmin && ventaSeleccionada?.sale_status !== "Cancelada" && (
          <MenuItem
            onClick={() => {
              console.log("=== CLICK EN CANCELAR VENTA ===");
              console.log("ventaSeleccionada:", ventaSeleccionada);
              
              // Guardar la venta que queremos cancelar ANTES de cerrar el menú
              setVentaParaCancelar(ventaSeleccionada);
              setOpenDeleteDialog(true);
              handleMenuClose(); // Esto limpia ventaSeleccionada, pero ya guardamos la venta en ventaParaCancelar
              
              console.log("ventaParaCancelar guardada");
              console.log("=============================");
            }}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#353842",
                color: "#FF3B30",
              },
            }}
          >
            Cancelar Venta
          </MenuItem>
        )}
      </Menu>

      {/* Modal de venta */}
      <ModalVenta
        open={modalAbierto}
        onClose={cerrarModal}
        modoEdicion={modoEdicion}
        ventaEditar={ventaEditar}
        onGuardadoExitoso={handleGuardadoExitoso}
      />

      {/* Dialog de confirmación para cancelar - CORREGIDO */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
          setVentaParaCancelar(null);
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#2A2D31",
            border: "1px solid #404040",
            borderRadius: 3,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#F8820B", fontWeight: "bold" }}>¿Cancelar venta?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#ccc", mb: 2 }}>
            ¿Estás seguro de que deseas cancelar la venta <strong>"{ventaParaCancelar?.sale_code}"</strong>?
          </Typography>
          <Typography sx={{ color: "#999", fontSize: "0.9rem" }}>
            Esta acción restaurará el stock del producto y no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => {
              setOpenDeleteDialog(false);
              setVentaParaCancelar(null);
            }}
            sx={{
              color: "#ccc",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCancelSale}
            variant="contained"
            sx={{
              backgroundColor: "#FF3B30",
              color: "#fff",
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(231, 76, 60, 0.4)",
              "&:hover": {
                backgroundColor: "#D32F2F",
                boxShadow: "0 6px 16px rgba(231, 76, 60, 0.6)",
              },
            }}
          >
            Eliminar Venta
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

TablaVentas.propTypes = {
  collapsed: PropTypes.bool,
};

export default TablaVentas;