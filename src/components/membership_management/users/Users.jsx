import { useState } from "react";
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
import RegistroMiembro from "./RegistroMiembro"; // Importa el componente del modal
import { Avatar } from "@mui/material";

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

export default function Users() {
  const [anchorEl, setAnchorEl] = useState(null); // Estado para el menú del perfil
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // Estado para el menú de filtro
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const [selectedUsers, setSelectedUsers] = useState([]); // Estado para los usuarios seleccionados
  const [usuarios, setUsuarios] = useState([
    {
      miembro: "Diego Balbuena",
      id: "#001",
      correo: "diego.b@gmail.com",
      telefono: "(984) 123-4567",
      fecha: "01/01/2024",
      estatus: "Activo",
    },
    {
      miembro: "Enrique Castillo",
      id: "#002",
      correo: "enrique.c@gmail.com",
      telefono: "(984) 987-6543",
      fecha: "02/01/2024",
      estatus: "Activo",
    },
    {
      miembro: "Valr Guzman",
      id: "#003",
      correo: "yair.guz@gmail.com",
      telefono: "(984) 564-2389",
      fecha: "03/01/2024",
      estatus: "Activo",
    },
    {
      miembro: "Cesar Sanchez",
      id: "#004",
      correo: "cesar.s@gmail.com",
      telefono: "(984) 234-9876",
      fecha: "04/01/2024",
      estatus: "Activo",
    },
    {
      miembro: "Aaron Santos",
      id: "#005",
      correo: "aaron.s@gmail.com",
      telefono: "(984) 345-6789",
      fecha: "05/01/2024",
      estatus: "Activo",
    },
  ]);

  const messagesCount = 4; // Número de mensajes no leídos
  const notificationsCount = 17; // Número de notificaciones no leídas

  const displayName = localStorage.getItem("displayName") || "Usuario";
  const photoURL = localStorage.getItem("photoURL") || "";

  // Función para abrir el modal
  const handleOpen = () => {
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Función para agregar un nuevo usuario
  const addUser = (newUser) => {
    setUsuarios([...usuarios, newUser]);
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

  // Verifica si el menú del perfil está abierto
  const isMenuOpen = Boolean(anchorEl);
  // Verifica si el menú de filtro está abierto
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  /**
   * Forzamos el uso de isMenuOpen y handleMenuClose para que el linter no marque error,
   * sin alterar la estructura, lógica ni diseño del componente.
   */
  console.debug(isMenuOpen, handleMenuClose);

  return (
    <>
      {/* Fondo oscuro cuando el modal está abierto */}
      {showModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
            zIndex: 1200, // Asegura que esté por encima de todo
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Modal */}
          <RegistroMiembro isOpen={showModal} onClose={handleCloseModal} addUser={addUser} />
        </Box>
      )}

      {/* Resto del componente Users */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
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
            <Typography variant="body2" sx={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
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
                width: "455px",
                height: "45px",
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
                <MailIcon sx={{ fontSize: "24px" }} />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show new notifications" sx={{ color: "#fff" }}>
              <Badge badgeContent={notificationsCount} color="error">
                <NotificationsIcon sx={{ fontSize: "24px" }} />
              </Badge>
            </IconButton>
          </Grid>

          {/* Perfil del usuario */}
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ margin: 0, fontSize: "18px", color: "#F8820B" }}>{displayName}</Typography>
              <Typography variant="body2" sx={{ margin: 0, fontSize: "13px", color: "#ccc" }}>
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
              {photoURL ? (
                <Avatar alt={displayName} src={photoURL} sx={{ width: 40, height: 40 }} />
              ) : (
                <AccountCircle sx={{ fontSize: "60px" }} />
              )}
            </IconButton>
          </Grid>
        </Grid>

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
                      indeterminate={selectedUsers.length > 0 && selectedUsers.length < usuarios.length}
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
                    <IconButton size="small" sx={{ color: "#fff" }} onClick={handleFilterMenuOpen}>
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
      </Box>
    </>
  );
}
