import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Avatar,
  Badge,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "./InventoryControl.css";

const InventoryControl = () => {
  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState(2);

  // Datos de muestra
  const inventorySummary = {
    categories: {
      count: 14,
      period: "Últimos 7 días",
    },
    products: {
      count: 345,
      period: "Últimos 7 días",
      income: "$15,000 MXN",
    },
    topSelling: {
      count: 3,
      period: "Últimos 7 días",
      cost: "$2,450 MXN",
    },
    lowStock: {
      ordered: 7,
      insufficient: 2,
    },
  };

  const products = [
    {
      id: 1,
      name: "Proteína Whey",
      price: "$1,299.00 MXN",
      quantity: "43 Unidades",
      category: "Suplementos",
      code: "12334567777",
      purchaseDate: "11/09/24",
      status: "Disponible",
    },
    {
      id: 2,
      name: "Barras Proteicas",
      price: "$349.00 MXN",
      quantity: "22 Cajas",
      category: "Snacks",
      code: "98765432111",
      purchaseDate: "21/10/24",
      status: "Agotado",
    }
  ];

  // Manejo de cambio de página
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Obtener datos del usuario logeado (como en Home.jsx)
  let admin = null;
  try {
    const adminDataString =
      localStorage.getItem("admin") || sessionStorage.getItem("admin");
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

  return (
    <div className="inventory-control-container">
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0} className="app-bar">
        <Toolbar className="toolbar">
          <div className="header-left">
            <Typography variant="h5" component="h1" className="title">
              Control de Inventario
            </Typography>
            <Typography variant="body2" className="subtitle">
              Administrar el inventario de productos del gimnasio.
            </Typography>
          </div>

          <Box className="search-bar">
            
            <IconButton type="submit" size="small">
              <SearchIcon className="search-icon" />
              <InputBase placeholder="Buscar un producto..." fullWidth />
            </IconButton>
          </Box>

          {/* Notification and Profile */}
          <div className="header-right">
            <IconButton className="icon-button">
              <ChatIcon />
            </IconButton>
            <IconButton className="icon-button">
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <div className="user-profile">
              <div className="user-info">
                <Typography variant="subtitle1" className="user-name">
                  {displayName}
                </Typography>
                <Typography variant="body2" className="user-role">
                  {roleName}
                </Typography>
              </div>
              <Avatar className="avatar">{usernameInitials}</Avatar>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      {/* Summary Section */}
      <Paper className="summary-paper">
        <div className="summary-header">
          <Typography variant="h6" className="summary-title">
            Resumen de su inventario del gimnasio
          </Typography>
          <Button variant="outlined" startIcon={<FilterListIcon />} className="filter-button">
            Filtrar
          </Button>
        </div>

        <Grid container spacing={0} className="summary-container">
          {/* Categories */}
          <Grid item xs={3} className="summary-item">
            <Typography variant="h6" className="summary-item-title categories-title">
              Categorias
            </Typography>
            <Typography variant="h4" className="summary-item-value">
              {inventorySummary.categories.count}
            </Typography>
            <Typography variant="body2" className="summary-item-label">
              {inventorySummary.categories.period}
            </Typography>
          </Grid>

          {/* Total Products */}
          <Grid item xs={3} className="summary-item">
            <Typography variant="h6" className="summary-item-title products-title">
              Total de productos
            </Typography>
            <div className="low-stock-counts">
              <div className="low-stock-item">
                <Typography variant="h4" className="summary-item-value">
                  {inventorySummary.products.count}
                </Typography>
                <Typography variant="body2" className="summary-item-period">
                  {inventorySummary.products.period}
                </Typography>
              </div>
              <div className="low-stock-item">
                <Typography variant="h4" className="summary-item-income">
                  {inventorySummary.products.income}
                </Typography>
                <Typography variant="body2" className="summary-item-label">
                  Ingreso
                </Typography>
              </div>
            </div>
          </Grid>

          {/* Top Selling Products */}
          <Grid item xs={3} className="summary-item">
            <Typography variant="h6" className="summary-item-title top-selling-title">
              Productos mas vendidos
            </Typography>
            <div className="low-stock-counts">
              <div className="low-stock-item">
                <Typography variant="h4" className="summary-item-value">
                  {inventorySummary.topSelling.count}
                </Typography>
                <Typography variant="body2" className="summary-item-period">
                  {inventorySummary.topSelling.period}
                </Typography>
              </div>
              <div className="low-stock-item">
                <Typography variant="h" className="summary-item-income">
                  {inventorySummary.topSelling.cost}
                </Typography>
                <Typography variant="body2" className="summary-item-label">
                  Costo
                </Typography>
              </div>
            </div>
          </Grid>

          {/* Low Stock */}
          <Grid item xs={3} className="summary-item">
            <Typography variant="h6" className="summary-item-title low-stock-title">
              Bajo Stocks
            </Typography>
            <div className="low-stock-counts">
              <div className="low-stock-item">
                <Typography variant="h4" className="summary-item-value">
                  {inventorySummary.lowStock.ordered}
                </Typography>
                <Typography variant="body2" className="summary-item-label">
                  Ordenados
                </Typography>
              </div>
              <div className="low-stock-item">
                <Typography variant="h4" className="summary-item-value">
                  {inventorySummary.lowStock.insufficient}
                </Typography>
                <Typography variant="body2" className="summary-item-label">
                  Insuficientes
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Table */}
      <Paper className="products-paper">
        <div className="products-header">
          <Typography variant="h6" className="products-title">
            Productos
          </Typography>
          <div className="products-actions">
            <Button variant="contained" className="register-button">
              Registrar un producto
            </Button>
            <Button variant="outlined" startIcon={<FilterListIcon />} className="filter-button">
              Filtrar
            </Button>
            <Button variant="outlined" className="download-button">
              Descargar todo
            </Button>
          </div>
        </div>

        <TableContainer>
          <Table className="products-table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header">Nombre del Producto</TableCell>
                <TableCell className="table-header">Precio</TableCell>
                <TableCell className="table-header">Cantidad</TableCell>
                <TableCell className="table-header">Categoría</TableCell>
                <TableCell className="table-header">Código Producto</TableCell>
                <TableCell className="table-header">Fecha de Compra</TableCell>
                <TableCell className="table-header">Estatus</TableCell>
                <TableCell className="table-header actions-header"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="table-row">
                  <TableCell className="product-name">{product.name}</TableCell>
                  <TableCell className="product-price">{product.price}</TableCell>
                  <TableCell className="product-quantity">{product.quantity}</TableCell>
                  <TableCell className="product-category">{product.category}</TableCell>
                  <TableCell className="product-code">{product.code}</TableCell>
                  <TableCell className="product-date">{product.purchaseDate}</TableCell>
                  <TableCell className="product-status">
                    <span className={`status-badge ${product.status.toLowerCase()}`}>{product.status}</span>
                  </TableCell>
                  <TableCell className="product-actions">
                    <IconButton size="small" className="action-icon">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="pagination-wrapper">
          <div className="pagination-container">
            <Button
              className="pagination-nav-button"
              startIcon={<KeyboardArrowLeftIcon />}
              onClick={() => handlePageChange(null, Math.max(1, currentPage - 1))}
            >
              Anterior
            </Button>

            <Button
              className={currentPage === 1 ? "pagination-button active" : "pagination-button"}
              onClick={() => handlePageChange(null, 1)}
            >
              1
            </Button>

            <Button
              className={currentPage === 2 ? "pagination-button active" : "pagination-button"}
              onClick={() => handlePageChange(null, 2)}
            >
              2
            </Button>

            <Button
              className={currentPage === 3 ? "pagination-button active" : "pagination-button"}
              onClick={() => handlePageChange(null, 3)}
            >
              3
            </Button>

            <Button
              className={currentPage === 4 ? "pagination-button active" : "pagination-button"}
              onClick={() => handlePageChange(null, 4)}
            >
              4
            </Button>

            <Button
              className={currentPage === 5 ? "pagination-button active" : "pagination-button"}
              onClick={() => handlePageChange(null, 5)}
            >
              5
            </Button>

            <span className="pagination-ellipsis">...</span>

            <Button
              className={currentPage === 11 ? "pagination-button active" : "pagination-button"}
              onClick={() => handlePageChange(null, 11)}
            >
              11
            </Button>

            <Button
              className="pagination-nav-button"
              endIcon={<KeyboardArrowRightIcon />}
              onClick={() => handlePageChange(null, Math.min(11, currentPage + 1))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default InventoryControl;
