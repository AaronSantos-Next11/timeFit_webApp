import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import ModalMembership from "./ModalMembership";

const borderColors = [
  { name: "Verde", color: "#27ae60" },
  { name: "Rojo", color: "#e74c3c" },
  { name: "Azul", color: "#2980b9" },
  { name: "Naranja", color: "#f39c12" },
  { name: "Morado", color: "#8e44ad" },
  { name: "Rosado", color: "#e91e63" },
  { name: "Amarillo", color: "#f1c40f" },
];

const CardMembership = ({ collapsed, role, memberships, refreshMemberships }) => {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const API = import.meta.env.VITE_API_URL;


  const handleMenuOpen = (event, membership) => {
    setSelected(membership);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
handleMenuClose();
  setTimeout(() => setModalOpen(true), 100);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${API}/api/memberships/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: selected._id }),
    });
    setOpenDeleteDialog(false);
    refreshMemberships();
;
  };

  const handleDeleteClick = () => {
  handleMenuClose();
  setTimeout(() => setOpenDeleteDialog(true), 100);
};

  const handleCloseModal = () => {
    setModalOpen(false);
    refreshMemberships();
;
  };

  const columns = collapsed ? 3 : 4;

  // Mensaje cuando no hay membresías
  if (memberships.length === 0) {
    return (
      <>
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
          <Typography
            variant="h5"
            sx={{
              color: "#ccc",
              mb: 2,
              fontWeight: "bold",
            }}
          >
            No existe ningún registro de membresía
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#999",
              mb: 3,
            }}
          >
            Por favor, registre su primera membresía para comenzar
          </Typography>
          {role === "Administrador" && (
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
                  backgroundColor: "#d35400",
                  boxShadow: "0 6px 16px rgba(248, 130, 11, 0.6)",
                },
                borderRadius: 2,
              }}
              onClick={() => setModalOpen(true)}
            >
              Registrar Primera Membresía
            </Button>
          )}
        </Box>

        <ModalMembership open={modalOpen} onClose={handleCloseModal} membershipId={null} role={role} />
      </>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {memberships && memberships.map((m, i) => {
          const colorEntry = borderColors.find((c) => c.name === m.color) || borderColors[i % borderColors.length];
          const color = colorEntry.color;
          const percentage = m.porcentaje_uso ? `${m.porcentaje_uso}%` : "0%";
          const userCount = m.cantidad_usuarios || 0;

          return (
            <Grid item xs={12 / columns} key={m._id}>
              <Card
                sx={{
                  height: 320,
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
                {/* Header con icono y título */}
                <Box
                  sx={{
                    p: 2,
                    background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                    borderBottom: `1px solid ${color}30`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        bgcolor: "transparent",
                        border: `3px solid ${color}`,
                        color: color,
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      {percentage}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {m.name_membership}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ p: 2 }}>
                  {/* Descripción */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#ccc",
                      mb: 2,
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                      minHeight: "40px",
                    }}
                  >
                    {m.description}
                  </Typography>

                  <Divider sx={{ borderColor: `${color}30`, mb: 2 }} />

                  {/* Información en grid */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoneyIcon sx={{ color: color, fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                          Precio
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>
                          ${m.price}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarTodayIcon sx={{ color: color, fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                          Duración
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>
                          {m.duration_days} días
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon sx={{ color: color, fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                          Período
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>
                          {m.period}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PeopleIcon sx={{ color: color, fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                          Usuarios
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>
                          {userCount}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Status Badge */}
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <Chip
                      label={m.status}
                      sx={{
                        backgroundColor: m.status === "Activado" ? "#0e994cff" : "#d62e1bff",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                        px: 1,
                        boxShadow: `0 2px 8px ${m.status === "Activado" ? "#2ecc71" : "#e74c3c"}40`,
                      }}
                    />
                  </Box>
                </CardContent>

                {/* Botón de edición */}
                {role === "Administrador" && (
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 15,
                      right: 15,
                      backgroundColor: "#F8820B",
                      color: "#000",
                      width: 40,
                      height: 40,
                      boxShadow: "0 4px 12px rgba(248, 130, 11, 0.4)",
                      "&:hover": {
                        backgroundColor: "#FF6600",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={(e) => handleMenuOpen(e, m)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}

                {/* Decoración de esquina */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 60,
                    height: 60,
                    background: `linear-gradient(135deg, transparent 50%, ${color}20 50%)`,
                    borderTopLeftRadius: "50px",
                  }}
                />
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            backgroundColor: "#2d2d2d",
            color: "#fff",
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            "&:hover": { backgroundColor: "#F8820B20" },
            color: "#fff",
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            "&:hover": { backgroundColor: "#e74c3c20" },
            color: "#fff",
          }}
        >
          Eliminar
        </MenuItem>
      </Menu>

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
        <DialogTitle sx={{ color: "#F8820B", fontWeight: "bold" }}>¿Eliminar membresía?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#ccc" }}>
            ¿Estás seguro de eliminar esta membresía? Los registros relacionados podrían perderse.
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

      <ModalMembership open={modalOpen} onClose={handleCloseModal} membershipId={selected?._id} role={role} />
    </>
  );
};

CardMembership.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  role: PropTypes.string.isRequired,
  memberships: PropTypes.array.isRequired,
  refreshMemberships: PropTypes.func.isRequired,
};

export default CardMembership;
