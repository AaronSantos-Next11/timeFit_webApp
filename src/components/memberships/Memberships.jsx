import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import CardMembership from "./CardMembership";
import ModalMembership from "./ModalMembership"; // Asegúrate de importar tu modal
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

  const handleFilterClick = (e) => setAnchorElFilter(e.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);

  const handleSort = (criterion) => {
    setSortBy(criterion);
    handleFilterClose();
  };

  const API = import.meta.env.VITE_API_URL;

  const filteredMemberships = useMemo(() => {
    let result = [...memberships].filter((m) => {
      const term = searchTerm.toLowerCase();
      return (
        m.name_membership?.toLowerCase().includes(term) ||
        m.description?.toLowerCase().includes(term) ||
        m.duration_days?.toString().includes(term) ||
        m.cantidad_usuarios?.toString().includes(term) ||
        m.price?.toString().includes(term) ||
        m.period?.toLowerCase().includes(term)
      );
    });

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

  const token = localStorage.getItem("token");

  let admin = null;
  try {
    const adminDataString = localStorage.getItem("admin") || sessionStorage.getItem("admin");
    admin = adminDataString ? JSON.parse(adminDataString) : null;
  } catch {
    admin = null;
  }

  const roleName = admin?.role?.role_name || "Rol desconocido";

  const getInitials = (username) => username?.slice(0, 2).toUpperCase() || "";
  const usernameInitials = getInitials(admin?.username);
  const getFirstNameAndLastName = (n, l) => `${n?.split(" ")[0] || ""} ${l?.split(" ")[0] || ""}`.trim();
  const displayName = getFirstNameAndLastName(admin?.name, admin?.last_name);

  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const fetchMemberships = async () => {
    try {
      const res = await fetch(`${API}/api/memberships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMemberships(data); // Ya vienen filtradas por gym_id desde el backend
    } catch (err) {
      console.error("Error al obtener membresías:", err);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const openCreateModal = () => {
    setSelectedMembershipId(null);
    setModalOpen(true);
  };

  const openEditModal = (id) => {
    setSelectedMembershipId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMembershipId(null);
    fetchMemberships();
  };

  const renderMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
      <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
    </Menu>
  );

  return (
    <>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
        <Grid item>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Membresías
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mt: 1 }}>
            {roleName === "Administrador"
              ? "Crea y administra tus propias membresías"
              : "Consulta las membresías disponibles"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={5} lg={5.8}>
          <Box sx={{ width: "100%", maxWidth: collapsed ? "420px" : "700px" }}>
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "30px",
                boxShadow: 3,
                width: "100%",
                height: "48px",
                backgroundColor: "#fff",
                border: "1px solid #444",
              }}
            >
              <IconButton type="submit" sx={{ p: "8px" }} color="primary">
                <SearchIcon sx={{ fontSize: "26px", color: "#aaa" }} />
              </IconButton>
              <InputBase
                sx={{ ml: 2, flex: 1, fontSize: "18px", color: "#000" }}
                placeholder="Buscar una membresía..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Paper>
          </Box>
        </Grid>

        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: "20px", color: "#F8820B", fontWeight: "bold" }}>{displayName}</Typography>
            <Typography variant="body2" sx={{ fontSize: "15px", color: "#ccc" }}>
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
                  bgcolor: "#ff4300",
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
        {renderMenu}
      </Grid>

      {/* Contador y botón */}
      <Grid container justifyContent="space-between" sx={{ mb: 3, gap: 2 }}>
        {/* Contador y botón */}
        {roleName === "Administrador" && (
          <Grid container justifyContent="flex-end" sx={{ mb: 3, gap: 2 }}>
            <Button
              onClick={openCreateModal}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#e67e22",
                color: "black",
                "&:hover": { backgroundColor: "#d35400", color: "white" },
                borderRadius: "8px",
                fontWeight: "bold",
                textTransform: "none",
                px: 3,
                py: 1.5,
                fontSize: "16px",
              }}
            >
              Crear membresía
            </Button>
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
            <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
              <MenuItem onClick={() => handleSort("name_asc")}>Nombre (A-Z)</MenuItem>
              <MenuItem onClick={() => handleSort("name_desc")}>Nombre (Z-A)</MenuItem>
              <MenuItem onClick={() => handleSort("duration")}>Duración</MenuItem>
              <MenuItem onClick={() => handleSort("price")}>Precio</MenuItem>
              <MenuItem onClick={() => handleSort("period")}>Periodo</MenuItem>
              <MenuItem onClick={() => handleSort("users")}>Usuarios</MenuItem>
            </Menu>
          </Grid>
        )}
      </Grid>

      {/* Cards de membresía */}
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
