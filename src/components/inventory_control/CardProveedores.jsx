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
  Divider,
  Paper,
  InputBase,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterIcon from "@mui/icons-material/FilterList";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EditIcon from "@mui/icons-material/Edit";
import ModalProveedor from "./ModalProveedor";

const borderColors = [
  { name: "Verde", color: "#4CAF50" },
  { name: "Rojo", color: "#F44336" },
  { name: "Azul", color: "#2196F3" },
  { name: "Naranja", color: "#FF9800" },
  { name: "Amarillo", color: "#f1c40f" },
  { name: "Morado", color: "#9C27B0" },
  { name: "Rosa", color: "#E91E63" },
  { name: "Durazno", color: "#ffb74d" },
  { name: "Turquesa", color: "#1abc9c" },
  { name: "Rojo Vino", color: "#880e4f" },
  { name: "Lima", color: "#cddc39" },
  { name: "Cian", color: "#00acc1" },
  { name: "Lavanda", color: "#9575cd" },
  { name: "Magenta", color: "#d81b60" },
  { name: "Coral", color: "#ff7043" },
];

const CardProveedores = ({ collapsed = false, role = "Administrador" }) => {
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [fetchedProveedores, setFetchedProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch proveedores from the backend
  const fetchProveedores = async () => {
    setLoading(true);
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
        throw new Error(`Error fetching proveedores: ${response.status}`);
      }

      const data = await response.json();
      setFetchedProveedores(Array.isArray(data.suppliers) ? data.suppliers : []);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      setFetchedProveedores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, [API_URL]);

  // --- Búsqueda y ordenamiento ---
  const filteredProveedores = useMemo(() => {
    const list = Array.isArray(fetchedProveedores) ? fetchedProveedores : [];
    const term = searchTerm.toLowerCase();
    let result = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.phone?.toLowerCase().includes(term) ||
        p.email?.toLowerCase().includes(term)
    );
    switch (sortBy) {
      case "name_asc":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name_desc":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "email":
        result.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
        break;
      case "phone":
        result.sort((a, b) => (a.phone || "").localeCompare(b.phone || ""));
        break;
      default:
        break;
    }
    return result;
  }, [searchTerm, sortBy, fetchedProveedores]);

  // --- Handlers de modal ---
  const openCreateModal = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleEdit = (proveedor) => {
    setSelected(proveedor);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/suppliers/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: selected._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error deleting proveedor: ${errorData.message || response.statusText}`);
      }

      // Refrescar la lista después de eliminar
      await fetchProveedores();
      setOpenDeleteDialog(false);
      setSelected(null);
    } catch (error) {
      console.error("Error deleting proveedor:", error);
      alert("Error al eliminar el proveedor. Intenta de nuevo.");
    }
  };

  const handleDeleteClick = (proveedor) => {
    setSelected(proveedor);
    setOpenDeleteDialog(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelected(null);
    // Refrescar la lista al cerrar el modal
    fetchProveedores();
  };

  // --- Filtrado UI ---
  const handleFilterClick = (e) => setAnchorElFilter(e.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleSort = (criterion) => {
    setSortBy(criterion);
    handleFilterClose();
  };

  const columns = collapsed ? 3 : 4;

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
              placeholder="Buscar un proveedor..."
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
              Crear proveedor
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
            <MenuItem onClick={() => handleSort("email")}>Email</MenuItem>
            <MenuItem onClick={() => handleSort("phone")}>Teléfono</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      {/* Contenido de las tarjetas */}
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
            Cargando proveedores...
          </Typography>
        </Box>
      ) : filteredProveedores.length === 0 ? (
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
          <StorefrontIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
          <Typography
            variant="h5"
            sx={{
              color: "#ccc",
              mb: 2,
              fontWeight: "bold",
            }}
          >
            No existe ningún registro de proveedor
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#999",
              mb: 3,
            }}
          >
            {role === "Administrador"
              ? "Comience creando su primer proveedor para gestionar los proveedores del gimnasio"
              : "No hay proveedores disponibles por el momento. Contacte al administrador para más información."}
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
                  color: "white",
                  boxShadow: "0 6px 16px rgba(248, 66, 11, 0.68)",
                },
                borderRadius: 2,
              }}
              onClick={openCreateModal}
            >
              Registrar Su Primer Proveedor
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProveedores.map((p, i) => {
            const colorEntry = borderColors.find((c) => c.name === p.color) || borderColors[i % borderColors.length];
            const color = colorEntry.color;
            return (
              <Grid item xs={12 / columns} key={p._id}>
                <Card
                  sx={{
                    mt: 3,
                    minHeight: 280,
                    maxHeight: 380,
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
                        <BusinessIcon />
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
                            minHeight: "2.6em",
                          }}
                        >
                          {p.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Divider sx={{ borderColor: `${color}30`, mb: 2 }} />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <PhoneIcon sx={{ color: color, fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Teléfono
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: "bold", color: "#fff" }}>
                            {p.phone || "No disponible"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <EmailIcon sx={{ color: color, fontSize: 20 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "bold",
                              color: "#fff",
                              wordBreak: "break-word",
                              fontSize: "0.9rem",
                            }}
                          >
                            {p.email || "No disponible"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Status Badge */}
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                      <Box
                        sx={{
                          backgroundColor: `#0e994cff`,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          px: 2,
                          py: 0.5,
                          borderRadius: "16px",
                          border: `1px solid ${color}40`,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <BusinessIcon sx={{ fontSize: 16 }} />
                        Activo
                      </Box>
                    </Box>
                  </CardContent>

                  {role === "Administrador" && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 22,
                        right: 10,
                        display: "flex",
                        flexDirection: "row",
                        gap: -1,
                      }}
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
                        onClick={() => handleEdit(p)}
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
                        onClick={() => handleDeleteClick(p)}
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
      )}

      {/* Dialogo de confirmación de eliminación */}
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
        <DialogTitle sx={{ color: "#F8820B", fontWeight: "bold" }}>¿Eliminar proveedor?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#ccc" }}>
            ¿Estás seguro de eliminar este proveedor? Los registros relacionados podrían perderse.
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
      
      <ModalProveedor 
        open={modalOpen} 
        onClose={handleCloseModal} 
        proveedor={selected} 
        role={role}
        refreshProveedores={fetchProveedores}
      />
    </>
  );
};

CardProveedores.propTypes = {
  collapsed: PropTypes.bool,
  role: PropTypes.string,
};

export default CardProveedores;