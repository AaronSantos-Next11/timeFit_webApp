import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import CardMembership from "./CardMembership";
import ModalMembership from "./ModalMembership";
import { Grid, Paper, InputBase, IconButton, Typography, Box, Button, Avatar, Menu, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import FilterIcon from "@mui/icons-material/FilterList";

export default function Membership({ collapsed }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMembershipId, setSelectedMembershipId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [sortBy, setSortBy] = useState("");

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
  Durazno: "#ffb74d" ,
  Turquesa: "#1abc9c",
  RojoVino: "#880e4f" ,
  Lima:"#cddc39",
  Cian: "#00acc1",
  Lavanda:"#9575cd",
  Magenta: "#d81b60",
  Coral: "#ff7043",
};

const getMappedColor = (colorName) => colorMap[colorName] || "#ff4300";

  // --- Fetch memberships con fallback a [] ---
  const fetchMemberships = async () => {
    try {
      const res = await fetch(`${API}/api/memberships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn("No se pudieron cargar las memberships:", res.status);
        setMemberships([]);
        return;
      }
      const data = await res.json();
      setMemberships(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener membresías:", err);
      setMemberships([]);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  // --- Búsqueda y ordenamiento ---
  const filteredMemberships = useMemo(() => {
    const list = Array.isArray(memberships) ? memberships : [];
    const term = searchTerm.toLowerCase();
    let result = list.filter(
      (m) =>
        m.name_membership?.toLowerCase().includes(term) ||
        m.description?.toLowerCase().includes(term) ||
        m.duration_days?.toString().includes(term) ||
        m.cantidad_usuarios?.toString().includes(term) ||
        m.price?.toString().includes(term) ||
        m.period?.toLowerCase().includes(term)
    );
    switch (sortBy) {
      case "name_asc":
        result.sort((a, b) => a.name_membership.localeCompare(b.name_membership));
        break;
      case "name_desc":
        result.sort((a, b) => b.name_membership.localeCompare(a.name_membership));
        break;
      case "duration":
        result.sort((a, b) => a.duration_days - b.duration_days);
        break;
      case "price":
        result.sort((a, b) => a.price - b.price);
        break;
      case "period":
        result.sort((a, b) => a.period.localeCompare(b.period));
        break;
      case "users":
        result.sort((a, b) => a.cantidad_usuarios - b.cantidad_usuarios);
        break;
      default:
        break;
    }
    return result;
  }, [searchTerm, sortBy, memberships]);

  // --- Handlers de modal (alertas si no hay gym_id en user.gym) ---
  const openCreateModal = () => {
    if (!user?.gym) {
      alert("Primero registra tu gimnasio");
      return;
    }

    setSelectedMembershipId(null);
    setModalOpen(true);
  };
  const openEditModal = (id) => {
    if (!user?.gym) {
      alert("Primero registra tu gimnasio");
      return;
    }
    setSelectedMembershipId(id);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedMembershipId(null);
    fetchMemberships();
  };

  // --- Menú de perfil ---
  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const renderMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
    </Menu>
  );

  // --- Filtrado UI ---
  const handleFilterClick = (e) => setAnchorElFilter(e.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleSort = (criterion) => {
    setSortBy(criterion);
    handleFilterClose();
  };

  return (
    <>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
        <Grid item sx={{ marginRight: "10px" }}>
          <Typography variant="h4" fontWeight="bold">
            Membresías
          </Typography>
          <Typography variant="body2" color="#aaa" mt={1}>
            {roleName === "Administrador"
              ? "Crea y administra tus propias membresías"
              : "Consulta las membresías disponibles"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={5.8}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "30px",
              boxShadow: 3,
              width: collapsed ? "420px" : "800px",
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
              placeholder="Buscar una membresía..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ ml: 2, flex: 1, fontSize: "18px" }}
            />
          </Paper>
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
          <IconButton onClick={handleProfileMenuOpen} sx={{ color: "#fff" }}>
            {usernameInitials ? (
              <Avatar sx={{ width: 50, height: 50, bgcolor: roleName === "Colaborador" ? getMappedColor(user?.color) : "#ff4300", }}>{usernameInitials}</Avatar>
            ) : (
              <AccountCircle sx={{ width: 50, height: 50, fontSize: 60 }} />
            )}
          </IconButton>
        </Grid>
        {renderMenu}
      </Grid>

      {/* Acciones */}
      <Grid container justifyContent="flex-end" sx={{ mb: 5, gap: 2, marginTop: "15px" }}>
        {roleName === "Administrador" && (
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
            Crear membresía
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
          <MenuItem onClick={() => handleSort("duration")}>Duración</MenuItem>
          <MenuItem onClick={() => handleSort("price")}>Precio</MenuItem>
          <MenuItem onClick={() => handleSort("period")}>Periodo</MenuItem>
          <MenuItem onClick={() => handleSort("users")}>Usuarios</MenuItem>
        </Menu>
      </Grid>

      {/* Listado de tarjetas */}
      <CardMembership
        collapsed={collapsed}
        role={roleName}
        memberships={filteredMemberships}
        onOpenModal={openEditModal}
        refreshMemberships={fetchMemberships}
      />

      {/* Modal */}
      <ModalMembership
        open={modalOpen}
        onClose={closeModal}
        membershipId={selectedMembershipId}
        role={roleName}
        refreshMemberships={fetchMemberships}
      />
    </>
  );
}

Membership.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};
