import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Paper,
  Box,
  InputBase,
  IconButton,
  Typography,
  Button,
  Avatar,
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
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ModalColaborador from "./ModalColaborador";

const Collaborators = ({ collapsed }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [colaboradorEditar, setColaboradorEditar] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [colabSeleccionado, setColabSeleccionado] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [collaborators, setCollaborators] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  const abrirModalRegistro = () => {
    setModoEdicion(false);
    setColaboradorEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEdicion = (colaborador) => {
    setModoEdicion(true);
    setColaboradorEditar(colaborador);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);
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

  const handleMenuOpen = (e, colaborador) => {
    setAnchorElMenu(e.currentTarget);
    setColabSeleccionado(colaborador);
  };
  const handleMenuClose = () => setAnchorElMenu(null);
  const handleFilterClick = (e) => setAnchorElFilter(e.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleSort = (criterion) => {
    setSortBy(criterion);
    handleFilterClose();
  };
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const fetchCollaborators = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API}/api/colaborators/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al obtener colaboradores");
      }

      const data = await res.json();
      setCollaborators(data);
    } catch (err) {
      console.error("Error al cargar colaboradores:", err.message || err);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const displayed = useMemo(() => {
let arr = collaborators.filter(
  (c) =>
    (c.name && c.last_name && `${c.name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.colaborator_code && (c.colaborator_code || "").toLowerCase().includes(searchTerm.toLowerCase()))
);

    if (sortBy === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "role") arr.sort((a, b) => a.colaborator_code.localeCompare(b.colaborator_code));
    if (sortBy === "date") arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return arr;
  }, [searchTerm, sortBy, collaborators]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await fetch(`${API}/api/colaborators/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: colabSeleccionado._id }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al eliminar colaborador");
      }

      setOpenDeleteDialog(false);
      fetchCollaborators();
      handleMenuClose();
    } catch (error) {
      console.error("Error al eliminar:", error.message || error);
    }
  };

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

const getMappedColor = (colorName) => {
  return colorMap[colorName] || "#888"; // color por defecto si no existe
};

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
        <Grid item sx={{ marginRight: "10px" }}>
          <Typography variant="h4" sx={{ fontSize: "30px", fontWeight: "bold" }}>
            Colaboradores
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "16px", color: "#ccc", mt: "10px" }}>
            Registra a tus empleados del gym
          </Typography>
        </Grid>

        <Grid item xs={12} sm={7} md={5} lg={6}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "30px", 
              boxShadow: 3,
              width: collapsed ? "420px" : "700px",
              maxWidth: "100%",
              height: "48px",
              backgroundColor: "#fff",
              border: "1px solid #444",
            }}
          >
            <IconButton type="submit" sx={{ p: "8px" }} disabled>
              <SearchIcon sx={{ fontSize: "26px", color: "#aaa" }} />
            </IconButton>
            <InputBase
              onChange={handleSearch}
              sx={{ ml: 2, flex: 1, fontSize: "18px", color: "#000" }}
              placeholder="Buscar un colaborador ..."
            />
          </Paper>
        </Grid>

        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right", ml: "15px" }}>
            <Typography sx={{ fontSize: "20px", color: "#F8820B", fontWeight: "bold" }}>{displayName}</Typography>
            <Typography variant="body2" sx={{ fontSize: "15px", color: "#ccc" }}>
              {roleName}
            </Typography>
          </Box>
          <IconButton sx={{ color: "#fff" }}>
            {usernameInitials ? (
              <Avatar sx={{ width: 50, height: 50, bgcolor: "#ff4300", color: "#fff", fontWeight: "bold" }}>
                {usernameInitials}
              </Avatar>
            ) : (
              <AccountCircle sx={{ fontSize: "60px" }} />
            )}
          </IconButton>
        </Grid>
      </Grid>

      <Grid container justifyContent="flex-end" spacing={2} sx={{ mb: 5, marginTop: "5px"}}>
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
            REGISTRAR COLABORADOR
            <AddIcon />
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
          <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
            <MenuItem onClick={() => handleSort("name")}>Ordenar por Nombre</MenuItem>
            <MenuItem onClick={() => handleSort("lastname")}>Ordenar por Apellido</MenuItem>
            <MenuItem onClick={() => handleSort("role")}>Ordenar por Código</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      {/* TABLA MEJORADA */}
      <Grid item xs={12}>
        <Card 
          sx={{ 
            backgroundColor: "#2A2D31", 
            borderRadius: "16px", 
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            border: "1px solid #404040"
          }}
        >
          {/* Header de la tabla */}
          <Box sx={{ 
            background: "#4d4a49ff",
            padding: "20px 24px",
            position: "relative",
            overflow: "hidden"
          }}>
            <Box sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)"
            }} />
            <Grid container spacing={2} sx={{ position: "relative", zIndex: 1 }}>
              <Grid item xs={1}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  ID
                </Typography>
              </Grid>
              <Grid item xs={2.4}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <PersonIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  COLABORADOR
                </Typography>
              </Grid>
              <Grid item xs={2.5}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <EmailIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  CORREO
                </Typography>
              </Grid>
              <Grid item xs={2.6}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <BadgeIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  MATRÍCULA
                </Typography>
              </Grid>
              <Grid item xs={2.5}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px" }}>
                  <ScheduleIcon sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }} />
                  HORARIO
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography sx={{ fontWeight: "700", color: "#fff", fontSize: "14px", letterSpacing: "0.5px", textAlign: "center" }}>
                  ACCIONES
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Contenido de la tabla */}
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
              {displayed.length === 0 ? (
                <Box sx={{ 
                  textAlign: "center", 
                  padding: "60px 20px", 
                  color: "#888", 
                  fontSize: "16px"
                }}>
                  <PersonIcon sx={{ fontSize: "48px", color: "#555", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "#ccc", mb: 1 }}>
                    No se encontraron colaboradores
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    Intenta con otros términos de búsqueda
                  </Typography>
                </Box>
              ) : (
                displayed.map((c, idx) => (
                  <Box key={c._id}>
                    <Box sx={{
                      padding: "20px 24px",
                      transition: "all 0.2s ease",
                      position: "relative",
                      "&:hover": {
                        backgroundColor: "#353842",
                        transform: "translateX(4px)",
                        boxShadow: "inset 4px 0 0 #F8820B"
                      }
                    }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={1}>
                          <Chip
                            label={`#${idx + 1}`}
                            size="small"
                            sx={{
                              backgroundColor: "#f0420dff",
                              color: "#fff",
                              fontWeight: "600",
                              fontSize: "12px",
                              height: "24px"
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={2}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar 
                              sx={{ 
                                width: 40, 
                                height: 40, 
                                bgcolor: getMappedColor(c.color),
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "14px"
                              }}
                            >
                              {c.name.charAt(0).toUpperCase()}{c.last_name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography sx={{ 
                                color: "#fff", 
                                fontSize: "14px", 
                                fontWeight: "600",
                                lineHeight: 1.2
                              }}>
                                {c.name}
                              </Typography>
                              <Typography sx={{ 
                                color: "#aaa", 
                                fontSize: "12px",
                                lineHeight: 1.2
                              }}>
                                {c.last_name}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={2.5}>
                          <Typography sx={{ 
                            color: "#ccc", 
                            fontSize: "14px",
                            wordBreak: "break-word"
                          }}>
                            {c.email}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={3}>
                          <Chip
                            label={c.colaborator_code}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: "#F8820B",
                              color: "#F8820B",
                              fontSize: "12px",
                              fontWeight: "500"
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={2.5}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <ScheduleIcon sx={{ fontSize: "16px", color: "#F8820B" }} />
                            <Typography sx={{ color: "#ccc", fontSize: "13px" }}>
                              {c.working_hour?.start_time} - {c.working_hour?.end_time}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={1}>
                          <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <IconButton 
                              onClick={(e) => handleMenuOpen(e, c)}
                              sx={{
                                color: "#F8820B",
                                backgroundColor: "rgba(248, 130, 11, 0.1)",
                                borderRadius: "8px",
                                padding: "8px",
                                "&:hover": {
                                  backgroundColor: "rgba(248, 130, 11, 0.2)",
                                  transform: "scale(1.1)"
                                }
                              }}
                            >
                              <MoreVertIcon sx={{ fontSize: "20px" }} />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    {idx < displayed.length - 1 && (
                      <Divider sx={{ borderColor: "#404040", mx: 3 }} />
                    )}
                  </Box>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

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
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
          }
        }}
      >
        <MenuItem
          onClick={() => {
            abrirModalEdicion(colabSeleccionado);
            handleMenuClose();
          }}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "#353842",
              color: "#F8820B"
            }
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDeleteDialog(true);
            handleMenuClose();
          }}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "#353842",
              color: "#FF3B30"
            }
          }}
        >
          Eliminar
        </MenuItem>
      </Menu>

      <ModalColaborador
        open={modalAbierto}
        onClose={cerrarModal}
        modoEdicion={modoEdicion}
        colaboradorEditar={colaboradorEditar}
        onGuardadoExitoso={() => {
          cerrarModal();
          fetchCollaborators();
        }}
      />
      
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#2A2D31",
            border: "1px solid #404040"
          }
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>¿Eliminar colaborador?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#ccc" }}>
            ¿Estás seguro de que deseas eliminar esta cuenta? Todos los datos relacionados serán eliminados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)} 
            sx={{ color: "#ccc" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: "#FF3B30",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#D32F2F",
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Collaborators;

Collaborators.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};