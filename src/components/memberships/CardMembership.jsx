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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import ModalMembership from "./ModalMembership";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';


const borderColors = [
  { name: "Verde", color: "#27ae60" },
  { name: "Rojo", color: "#e74c3c" },
  { name: "Azul", color: "#2980b9" },
  { name: "Naranja", color: "#f39c12" },
  { name: "Morado", color: "#8e44ad" },
  { name: "Rosado", color: "#e91e63" },
  { name: "Amarillo", color: "#f1c40f" },
  { name: "Durazno", color: "#ffb74d" },
  { name: "Turquesa", color: "#1abc9c" },
  { name: "Rojo Vino", color: "#880e4f" },
  { name: "Lima", color: "#cddc39" },
  { name: "Cian", color: "#00acc1" },
  { name: "Lavanda", color: "#9575cd" },
  { name: "Magenta", color: "#d81b60" },
  { name: "Coral", color: "#ff7043" },
];

const CardMembership = ({ collapsed, role, memberships, refreshMemberships }) => {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const handleEdit = (membership) => {
  setSelected(membership); 
  setModalOpen(true);          
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
  };

  const handleDeleteClick = (membership) => {
    setSelected(membership);
    setOpenDeleteDialog(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    refreshMemberships();
  };

  const columns = collapsed ? 3 : 4;

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
          <ReceiptLongIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
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
            {role === "Administrador"
            ? "Comience creando su primera membresía para gestionar los planes del gimnasio"
            : "No hay membresías disponibles por el momento. Contacte al administrador para más información."}
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
                  backgroundColor: "#ff4300",
                  color:"white",
                  boxShadow: "0 6px 16px rgba(248, 66, 11, 0.68)",
                },
                borderRadius: 2,
              }}
              onClick={() => setModalOpen(true)}
            >
              Registrar Su Primera Membresía
            </Button>
          )}
        </Box>

        <ModalMembership open={modalOpen} onClose={handleCloseModal} membershipId={null} role={role} />
      </>
    )
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
                  minheight: 380,
                  maxHeight: 580,
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
                          lineHeight: 1.3,
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                          overflowWrap: "break-word",
                          paddingTop: role === "Colaborador" ? "15px" : "10px",
                          paddingRight: role === "Administrador" ? "48px" : "0px",
                          minHeight: "3.6em",
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
                      lineHeight: 1.5,
                      minHeight: "60px",
                      maxHeight: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.description}
                  </Typography>

                  <Divider sx={{ borderColor: `${color}30`, mb: 2 }} />

                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoneyIcon sx={{ color: color, fontSize: 18 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                          Precio
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>
                          ${m.price} {m.currency}
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
                  <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
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

                {/* Iconos de editar y eliminar */}
                {role === "Administrador" && (
                  <Box
                    sx={{ position: "absolute", top: 22, right: 10, display: "flex", flexDirection: "row", gap: -1 }}
                  >
                    <IconButton
                      sx={{
                        color: color,
                        width: 30,
                        height: 30,
                        "&:hover": {
                          backgroundColor: color,
                          color: "#fff",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => handleEdit(m)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        color: color,
                        width: 30,
                        height: 30,
                        "&:hover": {
                          backgroundColor: color,
                          color: "#fff",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => handleDeleteClick(m)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

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
        <DialogTitle sx={{ color: "#F8820B", fontWeight: "bold" }}>
          ¿Eliminar membresía?
        </DialogTitle>
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