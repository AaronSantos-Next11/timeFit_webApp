import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import CardProduct from "./CardProduct";
import ModalProduct from "./ModalProduct";
import TableVentas from "./TableVentas";
import CardProveedores from "./CardProveedores";
import { Grid, Typography, Box, Avatar, ButtonGroup, Button, Menu, MenuItem, IconButton } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BusinessIcon from "@mui/icons-material/Business";

export default function InventoryControl({ collapsed }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeTab, setActiveTab] = useState("productos"); // productos, ventas, proveedores

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

  // --- Lectura segura del usuario (admin o colaborador) ---
  let user = null;
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  const roleName = user?.role?.role_name || "Rol desconocido";
  const displayName = `${user?.name?.split(" ")[0] || ""} ${user?.last_name?.split(" ")[0] || ""}`.trim();
  const usernameInitials = user?.username?.slice(0, 2).toUpperCase() || "";

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

  // --- Fetch productos con fallback a [] ---
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn("No se pudieron cargar los productos:", res.status);
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setProducts([]);
    }
  };

  // --- Fetch proveedores con fallback a [] ---
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API}/api/suppliers/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn("No se pudieron cargar los proveedores:", res.status);
        setSuppliers([]);
        return;
      }
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
      setSuppliers([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  // --- Handlers de modal ---
  const openCreateModal = () => {
    if (!user?.gym) {
      alert("Primero registra tu gimnasio");
      return;
    }
    setSelectedProductId(null);
    setModalOpen(true);
  };

  const openEditModal = (id) => {
    if (!user?.gym) {
      alert("Primero registra tu gimnasio");
      return;
    }
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProductId(null);
    fetchProducts();
  };

  return (
    <>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
        <Grid item sx={{ marginRight: "2px" }}>
          <Typography variant="h4" fontWeight="bold">
            Control de Inventario
          </Typography>
          <Typography sx={{ fontSize: "16px" }} color="#aaa" mt={1} mr={1}>
            {roleName === "Administrador"
              ? "Administra productos, controla el inventario y gestiona proveedores de tu gimnasio"
              : "Consulta los productos disponibles en el inventario"}
          </Typography>
        </Grid>

        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box textAlign="right">
            <Typography fontSize={20} color="#F8820B" fontWeight="bold">
              {displayName}
            </Typography>
            <Typography variant="body2" fontSize={15} color="#ccc">
              {roleName}
            </Typography>
          </Box>
          <IconButton onClick={handleProfileMenuOpen} sx={{ color: "#fff", fontWeight: "bold" }}>
            {usernameInitials ? (
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: roleName === "Colaborador" ? getMappedColor(user?.color) : "#ff4300",
                }}
              >
                {usernameInitials}
              </Avatar>
            ) : (
              <AccountCircle sx={{ width: 50, height: 50, fontSize: 60, color: "#fff" }} />
            )}
          </IconButton>
          {renderMenu}
        </Grid>
      </Grid>

      {/* Navigation ButtonGroup - Ocupa todo el ancho horizontal */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <ButtonGroup
          variant="outlined"
          fullWidth
          sx={{
            "& .MuiButton-root": {
              borderColor: "#F8820B",
              color: "#F8820B",
              fontWeight: "bold",
              fontSize: "16px",
              padding: "15px 24px",
              backgroundColor: "transparent",
              textTransform: "none",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(248, 130, 11, 0.1)",
                color: "#F8820B",
                borderColor: "#F8820B",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(248, 130, 11, 0.3)",
              },
              "&.active": {
                backgroundColor: "#ff4300",
                color: "white",
                borderColor: "#ff4300",
                boxShadow: "0 2px 12px rgba(248, 130, 11, 0.4)",
              },
              "&.active:hover": {
                backgroundColor: "#e6740a", // Un tono más oscuro del naranja
                borderColor: "#e6740a",
                transform: "none",
              },
            },
          }}
        >
          <Button
            startIcon={<InventoryIcon />}
            onClick={() => setActiveTab("productos")}
            className={activeTab === "productos" ? "active" : ""}
          >
            Productos
          </Button>
          <Button
            startIcon={<ReceiptIcon />}
            onClick={() => setActiveTab("ventas")}
            className={activeTab === "ventas" ? "active" : ""}
          >
            Historial de Ventas
          </Button>
          <Button
            startIcon={<BusinessIcon />}
            onClick={() => setActiveTab("proveedores")}
            className={activeTab === "proveedores" ? "active" : ""}
          >
            Proveedores
          </Button>
        </ButtonGroup>
      </Box>

      {/* Contenido según la pestaña activa */}
      {activeTab === "productos" && (
        <CardProduct
          collapsed={collapsed}
          role={roleName}
          products={products}
          suppliers={suppliers}
          onOpenModal={openEditModal}
          onCreateModal={openCreateModal}
          refreshProducts={fetchProducts}
        />
      )}

      {activeTab === "ventas" && <TableVentas collapsed={collapsed} role={roleName} />}

      {activeTab === "proveedores" && (
        <CardProveedores
          collapsed={collapsed}
          role={roleName}
          suppliers={suppliers}
          refreshSuppliers={fetchSuppliers}
        />
      )}

      {/* Modal de Producto */}
      <ModalProduct
        open={modalOpen}
        onClose={closeModal}
        productId={selectedProductId}
        role={roleName}
        suppliers={suppliers}
        refreshProducts={fetchProducts}
      />
    </>
  );
}

InventoryControl.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};
