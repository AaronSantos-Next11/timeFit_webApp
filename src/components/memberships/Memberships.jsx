import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import {
  Paper,
  InputBase,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./Memberships.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StyledTableCell = styled(TableCell)(() => ({
  backgroundColor: "transparent",
  color: "#fff",
  borderBottom: "1px solid ##e67e22",
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

export default function Membership() {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

// Obtener datos del usuario logeado (como en Home.jsx)
  let admin = null;
  try {
    const adminDataString =
      localStorage.getItem("admin") || sessionStorage.getItem("admin");
    admin = adminDataString ? JSON.parse(adminDataString) : null;
  } catch {
    admin = null;
  }

  const getInitials = (username) => {
    if (!username) return "";
    return username.slice(0, 2).toUpperCase();
  };

  const getFirstNameAndLastName = (name, last_name) => {
    if (!name || !last_name) return "Usuario";
    const firstName = name.split(" ")[0];
    const firstLastName = last_name.split(" ")[0];
    return `${firstName} ${firstLastName}`;
  };

  const displayName = admin ? getFirstNameAndLastName(admin.name, admin.last_name) : "Usuario";
  const roleName = admin?.role?.role_name || "Rol desconocido";
  const usernameInitials = admin ? getInitials(admin.username) : "";
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Estados para el menú de opciones de cada servicio
  const [serviceMenuAnchorEl, setServiceMenuAnchorEl] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const isServiceMenuOpen = Boolean(serviceMenuAnchorEl);

  // Estados para el menú de opciones de cada membresía
  const [membershipMenuAnchorEl, setMembershipMenuAnchorEl] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const isMembershipMenuOpen = Boolean(membershipMenuAnchorEl);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const isMenuOpen = Boolean(anchorEl);
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  const handleFilterMenuOpen = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterMenuClose = () => setFilterAnchorEl(null);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterSelect = (filterType) => {
    if (filterType === "ascending") {
      requestSort("name");
    } else if (filterType === "descending") {
      setSortConfig({ key: "name", direction: "descending" });
    } else if (filterType === "priceHigh") {
      setSortConfig({ key: "cost", direction: "descending" });
    } else if (filterType === "priceLow") {
      setSortConfig({ key: "cost", direction: "ascending" });
    } else if (filterType === "category") {
      requestSort("category");
    }
    handleFilterMenuClose();
  };

  // Manejo del menú de membresías
  const handleMembershipMenuOpen = (event, membership) => {
    setMembershipMenuAnchorEl(event.currentTarget);
    setSelectedMembership(membership);
  };

  const handleMembershipMenuClose = () => {
    setMembershipMenuAnchorEl(null);
    setSelectedMembership(null);
  };

  const handleDeleteMembership = () => {
    if (selectedMembership) {
      const updated = memberships.filter((m) => m.id !== selectedMembership.id);
      setMemberships(updated);
    }
    handleMembershipMenuClose();
  };

  // Datos de membresías (sin cambios)
  const membershipsData = [
    {
      id: 1,
      name: "Asignar nombre",
      color: "#e74c3c",
      clients: 0,
      description: "Añadir descripcion",
      users: "0",
      userType: "individual",
      monthly: "$0 MXN",
      quarterly: "$0 MXN",
      yearly: "$0 MXN",
    },
    {
      id: 2,
      name: "Asignar nombre",
      color: "#279CFC",
      clients: 0,
      description: "Añadir descripcion",
      users: "0",
      userType: "individual",
      monthly: "$0 MXN",
      quarterly: "$0 MXN",
      yearly: "$0 MXN",
    },
    {
      id: 3,
      name: "Asignar nombre",
      color: "#F8820B",
      clients: 0,
      description: "Añadir descripcion",
      users: "0",
      userType: "individual",
      monthly: "$0 MXN",
      quarterly: "$0 MXN",
      yearly: "$0 MXN",
    },
  ];

  const nuevaMembresia = location.state?.nuevaMembresia;
  const modifiedMembership = location.state?.modifiedMembership;
  let initialMemberships = [...membershipsData];
  if (nuevaMembresia) {
    initialMemberships.push(nuevaMembresia);
  }
  if (modifiedMembership) {
    initialMemberships = initialMemberships.map((membership) =>
      membership.id === modifiedMembership.id ? modifiedMembership : membership
    );
  }

  const totalClients = initialMemberships.reduce(
    (sum, membership) => sum + membership.clients,
    0
  );
  const [memberships, setMemberships] = useState(
    initialMemberships.map((membership) => ({
      ...membership,
      percentage: totalClients ? Math.round((membership.clients / totalClients) * 100) : 0,
    }))
  );

  // Datos de servicios: se reinicia a partir de defaultServices con id 1
  const defaultServices = [
    {
      id: 1,
      name: "Servicio inicial",
      description: "descripcion del servicio",
      category: "General",
      cost: "$100 MXN",
      duration: "1 hora",
      capacity: "10 personas",
      status: "Activo",
    },
  ];

  let initialServices = [...defaultServices];
  if (location.state?.nuevoServicio) {
    initialServices.push(location.state.nuevoServicio);
  }
  const [services, setServices] = useState(initialServices);

  // Efecto para nuevos servicios
  useEffect(() => {
    if (location.state?.nuevoServicio) {
      setServices((prevServices) => {
        if (!prevServices.find((s) => s.id === location.state.nuevoServicio.id)) {
          return [...prevServices, location.state.nuevoServicio];
        }
        return prevServices;
      });
    }
  }, [location.state?.nuevoServicio]);

  // Efecto para actualizar un servicio modificado
  useEffect(() => {
    if (location.state?.modifiedService) {
      setServices((prevServices) =>
        prevServices.map((s) =>
          s.id === location.state.modifiedService.id ? location.state.modifiedService : s
        )
      );
    }
  }, [location.state?.modifiedService]);

  // Actualiza el contador de servicios cada vez que el array cambia
  const [serviceCount, setServiceCount] = useState(services.length);
  useEffect(() => {
    setServiceCount(services.length);
  }, [services]);

  const getSortedServices = () => {
    const sortable = [...services];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleServiceMenuOpen = (event, service) => {
    setServiceMenuAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleServiceMenuClose = () => {
    setServiceMenuAnchorEl(null);
    setSelectedService(null);
  };

  const handleDeleteService = () => {
    if (selectedService) {
      const updated = services.filter((s) => s.id !== selectedService.id);
      setServices(updated);
      setServiceCount(updated.length);
    }
    handleServiceMenuClose();
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const filterMenu = (
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
      PaperProps={{
        style: {
          backgroundColor: "#333",
          color: "#fff",
          border: "1px solid #444",
        },
      }}
    >
      <MenuItem onClick={() => handleFilterSelect("ascending")} sx={{ color: "#fff" }}>
        Ascendente
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect("descending")} sx={{ color: "#fff" }}>
        Descendente
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect("category")} sx={{ color: "#fff" }}>
        Por Categoría
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect("priceHigh")} sx={{ color: "#fff" }}>
        Precio Mayor
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect("priceLow")} sx={{ color: "#fff" }}>
        Precio Menor
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect("capacity")} sx={{ color: "#fff" }}>
        Por Capacidad
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: "10px 0 20px 0" }}>

        <Grid item>
          <Typography variant="h4" sx={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>
          Membresías
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: "16px", color: "#ccc", marginTop: "10px" }}>
            {roleName === "Administrador" 
              ? "Crea y administra tus propias membresías" 
              : "Consulta las membresías disponibles"}
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
              width: "480px",
              height: "48px",
              marginTop: "0px",
              backgroundColor: "#ffff",
              border: "1px solid #444",
            }}
          >
            <IconButton type="submit" sx={{ p: "8px" }} color="primary">
              <SearchIcon sx={{ fontSize: "26px", color: "#aaa" }} />
            </IconButton>
            <InputBase sx={{ ml: 2, flex: 1, fontSize: "18px", color: "#000" }} placeholder="Buscar una membresía..." />
          </Paper>
        </Grid>

        {/* Perfil del usuario */}
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ textAlign: "right", marginLeft:"15px" }}>
              <Typography sx={{ margin: 0, fontSize: "20px", color: "#F8820B", fontWeight: "bold" }}>{displayName}</Typography>
              <Typography variant="body2" sx={{ margin: 0, fontSize: "15px", color: "#ccc" }}>
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
                <Avatar sx={{ width: 50, height: 50, bgcolor: "#ff4300", color: "#fff", fontWeight: "bold"  }}>{usernameInitials}</Avatar>
              ) : (
                <AccountCircle sx={{ fontSize: "60px" }} />
              )}
            </IconButton>
          </Grid>
      </Grid> 

      <Grid container justifyContent="space-between" sx={{ padding: "20px 20px" }}>
        <Grid item sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" component="h1" sx={{ color: "#e67e22", fontWeight: "bold", marginRight: 2 }}>
            Membresía
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid #e67e22",
              color: "#e67e22",
              fontWeight: "bold",
            }}
          >
            {memberships.length}
          </Box>
        </Grid>
        <Grid item>
          <Button
            component={Link}
            to="/membership_management/crearmembresia"
            variant="contained"
            sx={{
              backgroundColor: "#e67e22",
              color: "black",
              "&:hover": { backgroundColor: "#d35400", color: "white" },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              padding: "8px 16px",
              width: "193px",
              height: "48px",
              fontSize: "16px",
            }}
          >
            Crear membresía
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ padding: "20px 40px 30px 40px" }}>
        <Slider {...settings}>
          {memberships.map((membership, index) => (
            <Box key={index} sx={{ padding: "0 35px" }}>
              <Card
                sx={{
                  backgroundColor: "#333333",
                  color: "white",
                  borderRadius: "8px",
                  height: "400px",
                  width: "300px",
                }}
              >
                <CardContent sx={{ padding: "16px" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ position: "relative", display: "inline-flex", marginRight: 2 }}>
                        <svg width="70" height="70" viewBox="0 0 70 70">
                          <circle cx="35" cy="35" r="30" fill="none" stroke="#444" strokeWidth="5" />
                          <circle
                            cx="35"
                            cy="35"
                            r="30"
                            fill="none"
                            stroke={membership.color}
                            strokeWidth="5"
                            strokeDasharray={`${membership.percentage * 1.884} 200`}
                            transform="rotate(-90 35 35)"
                            strokeLinecap="round"
                          />
                          <text
                            x="50%"
                            y="50%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fill={membership.color}
                            fontSize="14"
                            fontWeight="bold"
                          >
                            {`${membership.percentage}%`}
                          </text>
                        </svg>
                      </Box>
                      <Box>
                        <Typography variant="h5" component="h2" sx={{ color: membership.color, fontWeight: "bold", fontSize: "18px" }}>
                          {membership.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box component="span" sx={{ color: membership.color, marginRight: 1, display: "flex", alignItems: "center" }}>
                            {membership.userType === "group" ? <GroupIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                          </Box>
                          <Typography variant="body2" sx={{ color: "#aaa", fontSize: "16px" }}>
                            {membership.clients} Clientes
                          </Typography>
                        </Box>
                      </Box>
                      {/* ICONO DE MENÚ (Modificar / Eliminar) */}
                      <IconButton
                        sx={{ color: membership.color, padding: "4px", marginLeft: "35px" }}
                        onClick={(event) => handleMembershipMenuOpen(event, membership)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ color: "#ddd", fontSize: "14px", marginBottom: 4, marginTop: 3 }}>
                    {membership.description}
                  </Typography>

                  <Box sx={{ marginBottom: 2, marginTop: "20px" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <Typography variant="body2" sx={{ color: membership.color, fontSize: "14px" }}>
                        Usuarios:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontSize: "14px" }}>
                        {membership.users}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <Typography variant="body2" sx={{ color: membership.color, fontSize: "14px" }}>
                        Mensual:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontSize: "14px" }}>
                        {membership.monthly}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <Typography variant="body2" sx={{ color: membership.color, fontSize: "14px" }}>
                        Trimestral:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontSize: "14px" }}>
                        {membership.quarterly}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: membership.color, fontSize: "14px" }}>
                        Anual:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontSize: "14px" }}>
                        {membership.yearly}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      <Grid container justifyContent="space-between" sx={{ padding: "20px 20px" }}>
        <Grid item sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" component="h1" sx={{ color: "#e67e22", fontWeight: "bold", marginRight: 2 }}>
            Servicios
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid #e67e22",
              color: "#e67e22",
              fontWeight: "bold",
            }}
          >
            {serviceCount}
          </Box>
        </Grid>
        <Grid item>
          <Button
            component={Link}
            to="/membership_management/registrarservicio"
            state={{ nextID: services.length ? services[services.length - 1].id + 1 : 2 }}
            variant="contained"
            sx={{
              backgroundColor: "#e67e22",
              color: "black",
              "&:hover": { backgroundColor: "#d35400", color: "white" },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: "bold",
              padding: "8px 16px",
              width: "193px",
              height: "48px",
              fontSize: "16px",
            }}
          >
            Crear servicio
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ padding: "0 20px 30px 20px" }}>
        <TableContainer
          component={Paper}
          sx={{ backgroundColor: "#333", borderRadius: "8px", maxHeight: 350, overflowY: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell>ID</StyledTableHeaderCell>
                <StyledTableHeaderCell>Nombre</StyledTableHeaderCell>
                <StyledTableHeaderCell>Categoría</StyledTableHeaderCell>
                <StyledTableHeaderCell>Costo</StyledTableHeaderCell>
                <StyledTableHeaderCell>Duración</StyledTableHeaderCell>
                <StyledTableHeaderCell>Capacidad</StyledTableHeaderCell>
                <StyledTableHeaderCell>Estado</StyledTableHeaderCell>
                <StyledTableHeaderCell align="center">
                  <IconButton size="small" sx={{ color: "#fff" }} onClick={handleFilterMenuOpen}>
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getSortedServices().map((service) => (
                <TableRow key={service.id}>
                  <StyledTableCell sx={{ borderBottom: "none" }}>{service.id}</StyledTableCell>
                  <StyledTableCell sx={{ borderBottom: "none" }}>{service.name}</StyledTableCell>
                  <StyledTableHeaderCell sx={{ borderBottom: "none" }}>{service.category}</StyledTableHeaderCell>
                  <StyledTableCell sx={{ borderBottom: "none" }}>{service.cost}</StyledTableCell>
                  <StyledTableHeaderCell sx={{ borderBottom: "none" }}>{service.duration}</StyledTableHeaderCell>
                  <StyledTableHeaderCell sx={{ borderBottom: "none" }}>{service.capacity}</StyledTableHeaderCell>
                  <StyledTableHeaderCell sx={{ borderBottom: "none" }}>
                    <StatusChip status={service.status}>{service.status}</StatusChip>
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell align="center" sx={{ borderBottom: "none" }}>
                    <IconButton
                      size="small"
                      sx={{ color: "#fff" }}
                      onClick={(event) => {
                        setSelectedService(service);
                        handleServiceMenuOpen(event, service);
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </StyledTableHeaderCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Menú de opciones para el servicio seleccionado */}
      <Menu
        anchorEl={serviceMenuAnchorEl}
        open={isServiceMenuOpen}
        onClose={handleServiceMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          component={Link}
          to="/membership_management/editarservicio"
          state={{ service: selectedService }}
          onClick={handleServiceMenuClose}
        >
          Modificar
        </MenuItem>
        <MenuItem onClick={handleDeleteService}>Eliminar</MenuItem>
      </Menu>

      {/* Menú de opciones para la membresía seleccionada */}
      <Menu
        anchorEl={membershipMenuAnchorEl}
        open={isMembershipMenuOpen}
        onClose={handleMembershipMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          component={Link}
          to="/membership_management/editarmembresia"
          state={{ membership: selectedMembership }}
          onClick={handleMembershipMenuClose}
        >
          Modificar
        </MenuItem>
        <MenuItem onClick={handleDeleteMembership}>Eliminar</MenuItem>
      </Menu>

      {renderMenu}
      {filterMenu}
    </>
  );
}
