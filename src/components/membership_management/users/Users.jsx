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
  Pagination,
  Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RegistroMiembro from "./RegistroMiembro";

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
  backgroundColor: status === "Activo" ? "#a5d6a7" : status === "Inactivo" ? "#ffcdd2" : "#fff3e0",
  color: status === "Activo" ? "#2e7d32" : status === "Inactivo" ? "#c62828" : "#e65100",
  padding: "4px 12px",
  borderRadius: "16px",
  fontSize: "0.75rem",
  textAlign: "center",
}));

export default function Users() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const [usuarios, setUsuarios] = useState([
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
  ]);

  const messagesCount = 4;
  const notificationsCount = 17;
  
  // Datos del usuario logeado
  const displayName = localStorage.getItem("displayName") || "Usuario";
  const photoURL = localStorage.getItem("photoURL") || "";

  // Lógica de paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usuarios.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(usuarios.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const addUser = (newUser) => {
    setUsuarios([...usuarios, newUser]);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((usuario) => usuario.id));
    }
  };

  const isMenuOpen = Boolean(anchorEl);
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  return (
    <>
      {showModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RegistroMiembro isOpen={showModal} onClose={handleCloseModal} addUser={addUser} />
        </Box>
      )}

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ padding: "10px 20px", marginTop: "-12px" }}
        >
          <Grid item>
            <Typography variant="h4" sx={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
              Usuarios
            </Typography>
            <Typography variant="body2" sx={{ margin: 0, fontSize: "16px", color: "#ccc" }}>
              Gestiona la información de tus usuarios.
            </Typography>
          </Grid>

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
            <InputBase sx={{ ml: 2, flex: 1, fontSize: "18px", color: "#000" }} placeholder="Buscar un usuarios" />
          </Paper>
        </Grid>

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

          <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" sx={{ margin: 0, fontSize: "18px", color: "#F8820B" }}>
                {displayName}
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
              {photoURL ? (
                <Avatar alt={displayName} src={photoURL} sx={{ width: 40, height: 40 }} />
              ) : (
                <AccountCircle sx={{ fontSize: "40px" }} />
              )}
            </IconButton>
          </Grid>
        </Grid>

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

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
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

        <Box sx={{ padding: "0 20px 20px 20px" }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: "#333",
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeaderCell>
                    <Checkbox
                      indeterminate={
                        selectedUsers.length > 0 && selectedUsers.length < currentUsers.length
                      }
                      checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
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
                {currentUsers.map((usuario) => (
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

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#fff',
                  },
                  '& .MuiPaginationItem-page.Mui-selected': {
                    backgroundColor: '#f8820b',
                    color: '#1f2024',
                    fontWeight: 'bold',
                  },
                  '& .MuiPaginationItem-page:hover': {
                    backgroundColor: 'rgba(248, 130, 11, 0.3)',
                  },
                }}
              />
            </Box>
          )}
        </Box>

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