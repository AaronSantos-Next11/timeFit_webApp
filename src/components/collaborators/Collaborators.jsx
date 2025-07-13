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
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
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

  let admin = null;
  try {
    const adminDataString = localStorage.getItem("admin") || sessionStorage.getItem("admin");
    admin = adminDataString ? JSON.parse(adminDataString) : null;
  } catch {
    admin = null;
  }

  const getInitials = (username) => (!username ? "" : username.slice(0, 2).toUpperCase());
  const getFirstNameAndLastName = (name, last_name) =>
    !name || !last_name ? "Usuario" : `${name.split(" ")[0]} ${last_name.split(" ")[0]}`;
  const displayName = admin ? getFirstNameAndLastName(admin.name, admin.last_name) : "Usuario";
  const roleName = admin?.role?.role_name || "Rol desconocido";
  const usernameInitials = admin ? getInitials(admin.username) : "";

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
        `${c.name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.colaborator_code || "").toLowerCase().includes(searchTerm.toLowerCase())
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

      <Grid item xs={12}>
        <Box sx={{ backgroundColor: "#45474B", borderRadius: "10px", overflow: "hidden" }}>
          <Box sx={{ backgroundColor: "#333", padding: "15px 20px" }}>
            <Grid container spacing={2} sx={{ fontWeight: "bold", color: "#ddd" }}>
              <Grid item xs={1}>
                ID
              </Grid>
              <Grid item xs={1.5}>
                Nombre
              </Grid>
              <Grid item xs={2.3}>
                Apellidos
              </Grid>
              <Grid item xs={2.2}>
                Correo
              </Grid>
              <Grid item xs={2}>
                Matricula
              </Grid>
              <Grid item xs={2}>
                Horario
              </Grid>
              <Grid item xs={1}>
                Ajustes
              </Grid>
            </Grid>
          </Box>
          <div style={{ height: "3px", backgroundColor: "#F8820B", width: "100%" }}></div>
          <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
            {displayed.length === 0 ? (
              <Box sx={{ textAlign: "center", padding: "40px 0", color: "#ccc", fontSize: "16px" }}>
                No se encontraron colaboradores que coincidan con tu búsqueda.
              </Box>
            ) : (
              displayed.map((c, idx) => (
                <Grid
                  container
                  key={c._id}
                  spacing={2}
                  sx={{ padding: "15px 20px", borderBottom: "1px solid #444", "&:hover": { backgroundColor: "#333" } }}
                >
                  <Grid item xs={1}>
                    {idx + 1}
                  </Grid>
                  <Grid item xs={1.5}>
                    {c.name}
                  </Grid>
                  <Grid item xs={1.5}>
                    {c.last_name}
                  </Grid>
                  <Grid item xs={3}>
                    {c.email}
                  </Grid>
                  <Grid item xs={2}>
                    {c.colaborator_code}
                  </Grid>
                  <Grid item xs={2}>
                    {c.working_hour?.start_time} - {c.working_hour?.end_time}
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={(e) => handleMenuOpen(e, c)}>
                      <MoreVertIcon sx={{ color: "#F8820B" }} />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            )}
          </Box>
        </Box>
      </Grid>

      <Menu
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            abrirModalEdicion(colabSeleccionado);
            handleMenuClose();
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDeleteDialog(true);
            handleMenuClose();
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
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>¿Eliminar colaborador?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar esta cuenta? Todos los datos relacionados serán eliminados.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
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
