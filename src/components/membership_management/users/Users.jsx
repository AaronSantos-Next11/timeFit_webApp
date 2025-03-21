import React, { useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  IconButton,
  InputBase,
  Badge,
  Box,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RegistroMiembro from "./RegistroMiembro"; // Asegúrate de importar el componente del modal

// Estilos personalizados para la tabla
const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "transparent",
  color: "#fff",
  borderBottom: "1px solid #444",
  padding: "12px 16px",
  fontSize: "0.875rem",
}));

const StyledTableHeaderCell = styled(TableCell)(() => ({
  backgroundColor: "transparent",
  color: "#fff",
  borderBottom: "2px solid #e67e22",
  padding: "12px 16px",
  fontWeight: "bold",
  fontSize: "0.875rem",
}));

const StatusChip = styled(Box)(({ status }) => ({
  display: "inline-block",
  backgroundColor: status === "Activo" ? "#a5d6a7" : "#e0e0e0",
  color: status === "Activo" ? "#2e7d32" : "#757575",
  padding: "4px 12px",
  borderRadius: "16px",
  fontSize: "0.75rem",
  textAlign: "center",
}));

export default function FullComponent() {
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú del perfil
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // Estado para el menú de filtro
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para la animación del modal
  const [selectedUsers, setSelectedUsers] = useState([]); // Estado para los usuarios seleccionados
  const messagesCount = 4; // Número de mensajes no leídos
  const notificationsCount = 17; // Número de notificaciones no leídas

  // Función para abrir el modal
  const handleOpen = () => {
    setShowModal(true);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal con animación
  const handleCloseAnimacion = () => {
    setShowModal(false);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 500);
  };

  // Función para abrir el menú del perfil
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Función para cerrar el menú del perfil
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Función para abrir el menú de filtro
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  // Función para cerrar el menú de filtro
  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // Función para manejar la selección de usuarios
  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // Función para seleccionar/deseleccionar todos los usuarios
  const handleSelectAll = () => {
    if (selectedUsers.length === usuarios.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(usuarios.map((usuario) => usuario.id));
    }
  };

  const isMenuOpen = Boolean(anchorEl); // Verifica si el menú del perfil está abierto
  const isFilterMenuOpen = Boolean(filterAnchorEl); // Verifica si el menú de filtro está abierto

  // Datos de ejemplo de usuarios
  const usuarios = [
    { miembro: "Diego Balbuena", id: "#001", correo: "diego.b@gmail.com", telefono: "(984) 123-4567", fecha: "01/01/2024", estatus: "Activo" },
    { miembro: "Enrique Castillo", id: "#002", correo: "enrique.c@gmail.com", telefono: "(984) 987-6543", fecha: "02/01/2024", estatus: "Activo" },
    { miembro: "Valr Guzman", id: "#003", correo: "yair.guz@gmail.com", telefono: "(984) 564-2389", fecha: "03/01/2024", estatus: "Activo" },
    { miembro: "Cesar Sanchez", id: "#004", correo: "cesar.s@gmail.com", telefono: "(984) 234-9876", fecha: "04/01/2024", estatus: "Activo" },
    { miembro: "Aaron Santos", id: "#005", correo: "aaron.s@gmail.com", telefono: "(984) 345-6789", fecha: "05/01/2024", estatus: "Activo" },
    { miembro: "Paquito Porto", id: "#006", correo: "psq12@gmail.com", telefono: "(984) 456-7890", fecha: "06/01/2024", estatus: "Inactivo" },
    { miembro: "Pepe Portugal", id: "#007", correo: "pepe.p@gmail.com", telefono: "(984) 678-9012", fecha: "07/01/2024", estatus: "Inactivo" },
    { miembro: "Jane Foster", id: "#008", correo: "jane.fg@gmail.com", telefono: "(984) 789-0123", fecha: "08/01/2024", estatus: "Inactivo" },
    { miembro: "Thor Sauce", id: "#009", correo: "thor.s@gmail.com", telefono: "(984) 890-1234", fecha: "09/01/2024", estatus: "Pendiente" },
    { miembro: "Patroolo Estrella", id: "#010", correo: "patrick.e@gmail.com", telefono: "(984) 901-2345", fecha: "10/01/2024", estatus: "Pendiente" },
    { miembro: "Fernando Guzman", id: "#011", correo: "fer.e@gmail.com", telefono: "(984) 671-8049", fecha: "11/01/2024", estatus: "Pendiente" },
  ];

  return (
    <>
      {/* Primer nivel: Header */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: "10px 20px", marginTop: "-12px" }}
      >
        {/* Título y descripción */}
        <Grid item>
          <Typography variant="h4" sx={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
            Usuarios
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: "16px", color: "#ccc" }}>
            Gestiona la información de tus usuarios.
          </Typography>
        </Grid>

        {/* Barra de búsqueda */}
        <Grid item>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "30px",
              boxShadow: 3,
              width: "720px",
              height: "60px",
              marginTop: "-12px",
              backgroundColor: "#ffff",
              border: "1px solid #444",
            }}
          >
            <IconButton type="submit" sx={{ p: "8px" }} color="primary">
              <SearchIcon sx={{ fontSize: "26px", color: "#aaa" }} />
            </IconButton>
            <InputBase
              sx={{ ml: 2, flex: 1, fontSize: "18px", color: "#000" }}
              placeholder="Buscar un servicio, membresía..."
            />
          </Paper>
        </Grid>

        {/* Notificaciones y mensajes */}
        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="large" aria-label="show new mails" sx={{ color: "#fff" }}>
            <Badge badgeContent={messagesCount} color="error">
              <MailIcon sx={{ fontSize: "28px" }} />
            </Badge>
          </IconButton>
          <IconButton size="large" aria-label="show new notifications" sx={{ color: "#fff" }}>
            <Badge badgeContent={notificationsCount} color="error">
              <NotificationsIcon sx={{ fontSize: "28px" }} />
            </Badge>
          </IconButton>
        </Grid>

        {/* Perfil del usuario */}
        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" sx={{ margin: 0, fontSize: "18px", color: "#F8820B" }}>
              Yair Guzman
            </Typography>
            <Typography variant="body2" sx={{ margin: 0, fontSize: "15px", color: "#ccc" }}>
              Administrador
            </Typography>
          </Box>
          <IconButton
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: "#fff" }}
          >
            <AccountCircle sx={{ fontSize: "60px" }} />
          </IconButton>
        </Grid>
      </Grid>

      {/* Menú del perfil */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
        <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
        <MenuItem onClick={handleMenuClose}>Cerrar sesión</MenuItem>
      </Menu>

      {/* Texto y botón arriba de la tabla */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
        {/* Texto "Selecciona el usuario para ver los datos:" */}
        <Typography
          sx={{
            color: "#FFFAFA",
            fontSize: "23px",
            fontFamily: "Poppins",
            fontWeight: 600,
            wordWrap: "break-word",
          }}
        >
          Selecciona el usuario para ver los datos:
        </Typography>

        {/* Botón "Registrar Miembro" */}
        <Button
          variant="contained"
          color="warning"
          onClick={handleOpen}
          sx={{
            backgroundColor: "#f8820b",
            color: "#1f2024",
            fontWeight: "600",
            padding: "12px 24px",
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Registrar Miembro
        </Button>
      </Box>

      {/* Tabla de usuarios */}
      <Box sx={{ padding: "0 20px 30px 20px" }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#333",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell>
                  <Checkbox
                    indeterminate={
                      selectedUsers.length > 0 && selectedUsers.length < usuarios.length
                    }
                    checked={selectedUsers.length === usuarios.length}
                    onChange={handleSelectAll}
                    sx={{ color: "#fff" }}
                  />
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>Miembro</StyledTableHeaderCell>
                <StyledTableHeaderCell>ID</StyledTableHeaderCell>
                <StyledTableHeaderCell>Correo</StyledTableHeaderCell>
                <StyledTableHeaderCell>Teléfono</StyledTableHeaderCell>
                <StyledTableHeaderCell>Fecha de inscripción</StyledTableHeaderCell>
                <StyledTableHeaderCell>Estatus</StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  <IconButton
                    size="small"
                    sx={{ color: "#fff" }}
                    onClick={handleFilterMenuOpen}
                  >
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <StyledTableCell>
                    <Checkbox
                      checked={selectedUsers.includes(usuario.id)}
                      onChange={() => handleSelectUser(usuario.id)}
                      sx={{ color: "#fff" }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{usuario.miembro}</StyledTableCell>
                  <StyledTableCell>{usuario.id}</StyledTableCell>
                  <StyledTableCell>{usuario.correo}</StyledTableCell>
                  <StyledTableCell>{usuario.telefono}</StyledTableCell>
                  <StyledTableCell>{usuario.fecha}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip status={usuario.estatus}>{usuario.estatus}</StatusChip>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton size="small" sx={{ color: "#fff" }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal para registrar miembro */}
      <RegistroMiembro isOpen={showModal} onClose={handleCloseAnimacion} />

      {/* Menú de filtro */}
      <Menu
        anchorEl={filterAnchorEl}
        open={isFilterMenuOpen}
        onClose={handleFilterMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleFilterMenuClose}>Filtrar por nombre</MenuItem>
        <MenuItem onClick={handleFilterMenuClose}>Filtrar por estatus</MenuItem>
        <MenuItem onClick={handleFilterMenuClose}>Filtrar por fecha</MenuItem>
      </Menu>
    </>
  );
}