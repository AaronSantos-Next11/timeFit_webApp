import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  Paper,
  InputBase,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  QrCode as BarcodeIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as SalesIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import ModalProduct from "./ModalProduct";

// Colores que coinciden exactamente con la base de datos
const productColors = {
  Azul: "#2196F3",
  Verde: "#4CAF50",
  Naranja: "#FF9800",
  Rojo: "#F44336",
  Morado: "#9C27B0",
  Turquesa: "#1abc9c",
  Rosa: "#E91E63",
  Amarillo: "#f1c40f",
  Cian: "#00acc1",
  Lima: "#cddc39",
};

const CardProduct = ({ collapsed = false, role = "Administrador" }) => {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [fetchedSuppliers, setFetchedSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch productos from the backend
  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/products/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }

      const data = await response.json();
      setFetchedProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setFetchedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suppliers from the backend
  const fetchSuppliers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/suppliers/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching suppliers: ${response.status}`);
      }

      const data = await response.json();
      setFetchedSuppliers(Array.isArray(data.suppliers) ? data.suppliers : []);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      setFetchedSuppliers([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, [API_URL]);

  // --- Búsqueda y ordenamiento ---
  const filteredProducts = useMemo(() => {
    const list = Array.isArray(fetchedProducts) ? fetchedProducts : [];
    const term = searchTerm.toLowerCase();
    let result = list.filter(
      (product) =>
        product.name_product?.toLowerCase().includes(term) ||
        product.barcode?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
    );

    switch (sortBy) {
      case "name_asc":
        result.sort((a, b) => (a.name_product || "").localeCompare(b.name_product || ""));
        break;
      case "name_desc":
        result.sort((a, b) => (b.name_product || "").localeCompare(a.name_product || ""));
        break;
      case "category":
        result.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
      case "price_low":
        result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
        break;
      case "price_high":
        result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
        break;
      case "stock_low":
        result.sort((a, b) => (a.stock?.quantity || 0) - (b.stock?.quantity || 0));
        break;
      case "stock_high":
        result.sort((a, b) => (b.stock?.quantity || 0) - (a.stock?.quantity || 0));
        break;
      case "sales_low":
        result.sort((a, b) => (a.sales_obtained || 0) - (b.sales_obtained || 0));
        break;
      case "sales_high":
        result.sort((a, b) => (b.sales_obtained || 0) - (a.sales_obtained || 0));
        break;
      default:
        break;
    }
    return result;
  }, [searchTerm, sortBy, fetchedProducts]);

  // --- Handlers de modal ---
  const openCreateModal = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelected(product);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/products/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: selected._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error deleting product: ${errorData.message || response.statusText}`);
      }

      // Refrescar la lista después de eliminar
      await fetchProducts();
      setOpenDeleteDialog(false);
      setSelected(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto. Intenta de nuevo.");
    }
  };

  const handleDeleteClick = (product) => {
    setSelected(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelected(null);
    // Refrescar la lista al cerrar el modal
    fetchProducts();
  };

  // --- Filtrado UI ---
  const handleFilterClick = (e) => setAnchorElFilter(e.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleSort = (criterion) => {
    setSortBy(criterion);
    handleFilterClose();
  };

  // FUNCIÓN CORREGIDA: Obtener nombre del proveedor
  const getSupplierName = (supplierId) => {
    // Verificar que tenemos proveedores cargados
    if (!Array.isArray(fetchedSuppliers) || fetchedSuppliers.length === 0) {
      return "Cargando proveedores...";
    }

    // Si no hay supplierId, retornar mensaje apropiado
    if (!supplierId) {
      return "Sin proveedor asignado";
    }

    // Buscar el proveedor por ID
    const supplier = fetchedSuppliers.find((s) => s._id === supplierId);

    if (supplier) {
      return supplier.name || "Proveedor sin nombre";
    }

    // Si no se encontró el proveedor pero hay un ID
    return "Proveedor no encontrado";
  };

  // NUEVA FUNCIÓN: Determinar estado automático basado en stock
  const getAutomaticStatus = (quantity, currentStatus) => {
    // Si el producto está marcado como "Cancelado", mantener ese estado
    if (currentStatus === "Cancelado") {
      return "Cancelado";
    }

    // Lógica automática basada en stock
    if (quantity === 0) {
      return "Agotado";
    } else if (quantity <= 10) {
      return "Inactivo"; // Stock bajo = Inactivo
    } else {
      return "Activo"; // Stock suficiente = Activo
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0)
      return {
        label: "Sin stock",
        color: "#F44336",
        bgColor: "#ffebee",
      };
    if (quantity <= 10)
      return {
        label: "Stock bajo",
        color: "#FF9800",
        bgColor: "#fff3e0",
      };
    return {
      label: "En stock",
      color: "#4CAF50",
      bgColor: "#e8f5e8",
    };
  };

  // FUNCIÓN MODIFICADA: Obtener color de estado con lógica automática
  const getStatusColor = (originalStatus, quantity) => {
    // Determinar el estado automático basado en stock
    const automaticStatus = getAutomaticStatus(quantity, originalStatus);

    switch (automaticStatus) {
      case "Activo":
        return { label: "Activo", color: "#4CAF50" };
      case "Inactivo":
        return { label: "Inactivo", color: "#FF9800" };
      case "Agotado":
        return { label: "Sin stock", color: "#F44336" };
      case "Cancelado":
        return { label: "Cancelado", color: "#9E9E9E" };
      default:
        return { label: "Activo", color: "#4CAF50" };
    }
  };

  // Función para obtener el color del producto desde la BD
  const getProductColor = (cardColor) => {
    return productColors[cardColor] || productColors["Azul"]; // Default azul
  };

  // 🆕 NUEVA FUNCIÓN: Formatear número de ventas
  const formatSalesNumber = (sales) => {
    const number = Number(sales) || 0;
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`;
    }
    if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
  };

  return (
    <>
      {/* Barra de búsqueda y botones */}
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
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ ml: 2, flex: 1, fontSize: "18px" }}
            />
          </Paper>
        </Grid>

        <Grid item sx={{ display: "flex", gap: 2 }}>
          {(role === "Administrador" || role === "Colaborador") && (
            <Button
              onClick={openCreateModal}
              variant="contained"
              startIcon={<AddIcon />}
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
            >
              Nuevo Producto
            </Button>
          )}

          <Button
            onClick={handleFilterClick}
            startIcon={<FilterIcon />}
            sx={{
              color: "#F8820B",
              fontWeight: "Bold",
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

          <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
            <MenuItem onClick={() => handleSort("name_asc")}>Nombre (A-Z)</MenuItem>
            <MenuItem onClick={() => handleSort("name_desc")}>Nombre (Z-A)</MenuItem>
            <MenuItem onClick={() => handleSort("category")}>Categoría</MenuItem>
            <MenuItem onClick={() => handleSort("price_low")}>Precio (Menor)</MenuItem>
            <MenuItem onClick={() => handleSort("price_high")}>Precio (Mayor)</MenuItem>
            <MenuItem onClick={() => handleSort("stock_low")}>Stock (Menor)</MenuItem>
            <MenuItem onClick={() => handleSort("stock_high")}>Stock (Mayor)</MenuItem>
            <MenuItem onClick={() => handleSort("sales_low")}>Ventas (Menor)</MenuItem>
            <MenuItem onClick={() => handleSort("sales_high")}>Ventas (Mayor)</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      {/* Contador de resultados */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2" sx={{ color: "#ccc" }}>
          Mostrando {filteredProducts.length} de {fetchedProducts.length} productos
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

      {/* Cards de productos */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <Typography variant="h6" sx={{ color: "#ccc" }}>
            Cargando productos...
          </Typography>
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
            p: 4,
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
          <Typography
            variant="h5"
            sx={{
              color: "#ccc",
              mb: 2,
              fontWeight: "bold",
            }}
          >
            {fetchedProducts.length === 0 ? "No hay productos registrados" : "No se encontraron productos"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#999",
              mb: 3,
            }}
          >
            {fetchedProducts.length === 0
              ? role === "Administrador"
                ? "Comience agregando productos a su inventario para gestionar el stock del gimnasio"
                : "No hay productos disponibles por el momento. Contacte al administrador para más información."
              : "Intente ajustar los filtros de búsqueda para encontrar productos."}
          </Typography>
          {fetchedProducts.length === 0 && role === "Administrador" && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#F8820B",
                color: "#000",
                fontWeight: "bold",
                px: 3,
                py: 1.5,
                boxShadow: "0 4px 12px rgba(248, 130, 11, 0.4)",
                "&:hover": {
                  backgroundColor: "#ff4300",
                  color: "white",
                  boxShadow: "0 6px 16px rgba(248, 66, 11, 0.68)",
                },
                borderRadius: 2,
              }}
              onClick={openCreateModal}
            >
              Agregar Primer Producto
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => {
            // Usar el color específico del producto desde la BD
            const color = getProductColor(product.cardColor);
            const stockQuantity = product.stock?.quantity || 0;
            const stockStatus = getStockStatus(stockQuantity);

            // APLICAR NUEVA LÓGICA: Estado automático basado en stock
            const statusInfo = getStatusColor(product.status, stockQuantity);

            const stockUnit = product.stock?.unit || "pieza";
            const price = product.price?.amount || 0;
            const currency = product.price?.currency || "MXN";

            // 🆕 OBTENER VENTAS OBTENIDAS CON VALOR POR DEFECTO
            const salesObtained = Number(product.sales_obtained) || 0;

            // CORRECCIÓN: Obtener el supplier_id correctamente
            const supplierId = product.supplier_id?._id || product.supplier_id;
            const supplierName = getSupplierName(supplierId);

            return (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card
                  sx={{
                    minHeight: 520,
                    maxHeight: 650,
                    background: `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)`,
                    color: "#fff",
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${color}40`,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "5px",
                      background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
                    },
                  }}
                >
                  {/* Header con imagen del producto */}
                  <Box
                    sx={{
                      height: 300,
                      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                      borderBottom: `1px solid ${color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name_product}
                        style={{
                          width: "300px",
                          height: "210px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: `2px solid ${color}`,
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 70,
                          height: 70,
                          bgcolor: "transparent",
                          border: `3px solid ${color}`,
                          color: color,
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                    )}

                    {/* Badge de stock */}
                    <Chip
                      label={stockStatus.label}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        backgroundColor: stockStatus.color,
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                        boxShadow: `0 2px 8px ${stockStatus.color}40`,
                      }}
                    />

                    {/* Iconos de editar y eliminar */}
                    {role === "Administrador" && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          display: "flex",
                          gap: 0.5,
                        }}
                      >
                        <IconButton
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            width: 30,
                            height: 30,
                            "&:hover": {
                              backgroundColor: color,
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => handleEdit(product)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{
                            color: "#fff",
                            backgroundColor: "rgba(0,0,0,0.3)",
                            width: 30,
                            height: 30,
                            "&:hover": {
                              backgroundColor: "#F44336",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => handleDeleteClick(product)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    {/* Nombre del producto */}
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                        minHeight: "2.6em",
                        maxHeight: "2.6em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        mb: 1,
                      }}
                    >
                      {product.name_product}
                    </Typography>

                    {/* Información principal */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CategoryIcon sx={{ color: color, fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Categoría
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff", fontSize: "0.8rem" }}>
                            {product.category || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <BusinessIcon sx={{ color: color, fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Proveedor
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              color: "#fff",
                              fontSize: "0.8rem",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={supplierName}
                          >
                            {supplierName}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Código de barras */}
                    {product.barcode && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <BarcodeIcon sx={{ color: color, fontSize: 16 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Código de Barras
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              color: "#fff",
                              fontSize: "0.8rem",
                              fontFamily: "monospace",
                            }}
                          >
                            {product.barcode}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Divider sx={{ borderColor: `${color}30`, mb: 2 }} />

                    {/* Stock e inventario */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <InventoryIcon sx={{ color: color, fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Stock
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>
                            {stockQuantity} {stockUnit}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <MoneyIcon sx={{ color: color, fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Precio Unitario
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "bold", color: "White" }}>
                            ${price} {currency}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Fecha de compra y ventas */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarIcon sx={{ color: color, fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Fecha de Compra
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff", fontSize: "0.8rem" }}>
                            {product.purchase_date ? new Date(product.purchase_date).toLocaleDateString() : "N/A"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <SalesIcon sx={{ color: color, fontSize: 16 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Ventas Obtenidas
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              color: salesObtained > 0 ? "#fff" : "#fff",
                              fontSize: "0.9rem",
                            }}
                          >
                            {formatSalesNumber(salesObtained)} {stockUnit}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Estado del producto - AHORA CON LÓGICA AUTOMÁTICA */}
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                      <Chip
                        label={statusInfo.label}
                        sx={{
                          backgroundColor: statusInfo.color,
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          px: 1,
                          boxShadow: `0 2px 8px ${statusInfo.color}40`,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#F8820B", fontWeight: "bold" }}>¿Eliminar producto?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#ccc", mb: 2 }}>
            ¿Estás seguro de que deseas eliminar <strong>"{selected?.name_product}"</strong>?
          </Typography>
          <Typography sx={{ color: "#999", fontSize: "0.9rem" }}>
            Esta acción no se puede deshacer y se perderán todos los datos relacionados con este producto.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: "#ccc",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              boxShadow: "0 4px 12px rgba(231, 76, 60, 0.4)",
              "&:hover": { boxShadow: "0 6px 16px rgba(231, 76, 60, 0.6)" },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <ModalProduct
        open={modalOpen}
        onClose={handleCloseModal}
        productId={selected?._id}
        role={role}
        refreshProducts={fetchProducts}
      />
    </>
  );
};

CardProduct.propTypes = {
  collapsed: PropTypes.bool,
  role: PropTypes.string,
};

export default CardProduct;
