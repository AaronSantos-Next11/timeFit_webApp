import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Paper,
  InputBase,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Badge,
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
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import { styled } from "@mui/material/styles";
import "./Memberships.css"

// Slick Carousel
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

export default function Membership() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const messagesCount = 4;
  const notificationsCount = 17;
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);
  const isFilterMenuOpen = Boolean(filterAnchorEl);

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  // Sort function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to handle filter selection
  const handleFilterSelect = (filterType) => {
    // Apply filter logic based on filterType
    if (filterType === 'ascending') {
      requestSort('name');
    } else if (filterType === 'descending') {
      setSortConfig({ key: 'name', direction: 'descending' });
    } else if (filterType === 'priceHigh') {
      setSortConfig({ key: 'cost', direction: 'descending' });
    } else if (filterType === 'priceLow') {
      setSortConfig({ key: 'cost', direction: 'ascending' });
    } else if (filterType === 'category') {
      requestSort('category');
    }
    
    handleFilterMenuClose();
  };

  // Datos de membresías sin porcentajes (los calcularemos)
  const membershipsData = [
    {
      name: "Gym Rookie",
      color: "#e74c3c",
      clients: 240,
      description:
        "Para quienes están comenzando o entrenan de forma ocasional. Acceso a las áreas básicas del gimnasio.",
      users: "1",
      userType: "individual",
      monthly: "$300 MXN",
      quarterly: "$850 MXN",
      yearly: "$3,200 MXN",
    },
    {
      name: "Iron Warrior",
      color: "#3498db",
      clients: 108,
      description:
        "Diseñado para quienes entrenan con regularidad y buscan mejorar su rendimiento. Incluye acceso a clases grupales y equipos avanzados.",
      users: "Grupal (4 usuarios)",
      userType: "group",
      monthly: "$500 MXN",
      quarterly: "$1,400 MXN",
      yearly: "$5,000 MXN",
    },
    {
      name: "Titan Pro",
      color: "#e67e22",
      clients: 52,
      description:
        "Para los más comprometidos con su entrenamiento. Acceso completo, entrenamientos personalizados y servicios exclusivos.",
      users: "Grupal (6 personas)",
      userType: "group",
      monthly: "$750 MXN",
      quarterly: "$2,100 MXN",
      yearly: "$7,800 MXN",
    },
    {
      name: "Lord",
      color: "#9b59b6",
      clients: 28,
      description:
        "Experiencia premium con instructores dedicados, acceso prioritario a todas las instalaciones y servicios exclusivos.",
      users: "Familiar (5 personas)",
      userType: "group",
      monthly: "$950 MXN",
      quarterly: "$2,700 MXN",
      yearly: "$9,500 MXN",
    },
  ];

  // Calcula el total de clientes para determinar los porcentajes correctos
  const totalClients = membershipsData.reduce((sum, membership) => sum + membership.clients, 0);
  
  // Calcula los porcentajes basados en la proporción de clientes
  const [memberships, setMemberships] = useState(membershipsData.map(membership => ({
    ...membership,
    percentage: Math.round((membership.clients / totalClients) * 100)
  })));

  // Datos de servicios
  const servicesData = [
    {
      id: 1,
      name: "Clases de Yoga",
      description: "Sesiones grupales de Zumba para todos",
      category: "Entrenamiento",
      cost: "$100 MXN",
      duration: "1 hora",
      capacity: "10 personas",
      status: "Activo",
    },
    {
      id: 2,
      name: "Asesoría Nutricional",
      description: "Consulta personalizada con nutriólogo",
      category: "Nutrición",
      cost: "$300 MXN",
      duration: "1 sesión",
      capacity: "1 personas",
      status: "Activo",
    },
    {
      id: 3,
      name: "Entrenamiento Personal",
      description: "Consulta personalizada con nutriólogo",
      category: "Entrenamiento",
      cost: "$500 MXN",
      duration: "1 hora",
      capacity: "1 personas",
      status: "Activo",
    },
    {
      id: 4,
      name: "Acceso a Spa",
      description: "Uso de sauna y área de relajación",
      category: "Bienestar",
      cost: "$150 MXN",
      duration: "30 minutos",
      capacity: "1 personas",
      status: "Inactivo",
    },
    {
      id: 5,
      name: "Acceso a Spa",
      description: "Uso de sauna y área de relajación",
      category: "Bienestar",
      cost: "$150 MXN",
      duration: "30 minutos",
      capacity: "1 personas",
      status: "Inactivo",
    },
    {
      id: 6,
      name: "Acceso a Spa",
      description: "Uso de sauna y área de relajación",
      category: "Bienestar",
      cost: "$150 MXN",
      duration: "30 minutos",
      capacity: "1 personas",
      status: "Inactivo",
    },
    // Aquí se podrían agregar más servicios
  ];

  const [services, setServices] = useState(servicesData);

  // Function to get sorted services
  const getSortedServices = () => {
    const sortableServices = [...services];
    if (sortConfig.key) {
      sortableServices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableServices;
  };

  // Configuración de Slick Carousel
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

  // Contador de membresías y servicios (ahora es dinámico)
  const [membershipCount, setMembershipCount] = useState(memberships.length);
  const [serviceCount, setServiceCount] = useState(services.length);

  // Función para agregar una nueva membresía
  const handleAddMembership = () => {
    const newMembership = {
      name: "Nueva Membresía",
      color: "#2ecc71",
      clients: 10,
      description: "Descripción de la nueva membresía.",
      users: "1",
      userType: "individual",
      monthly: "$400 MXN",
      quarterly: "$1,100 MXN",
      yearly: "$4,000 MXN",
      percentage: 5 // Un valor por defecto
    };
    
    // Actualizar el estado
    setMemberships([...memberships, newMembership]);
    setMembershipCount(membershipCount + 1);
  };

  // Función para agregar un nuevo servicio
  const handleAddService = () => {
    const newService = {
      id: services.length + 1,
      name: "Nuevo Servicio",
      description: "Descripción del nuevo servicio",
      category: "General",
      cost: "$200 MXN",
      duration: "1 hora",
      capacity: "1 persona",
      status: "Activo",
    };
    
    // Actualizar el estado
    setServices([...services, newService]);
    setServiceCount(serviceCount + 1);
  };

  // Menu para el perfil
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

  // Menu para el filtro
  const filterMenu = (
    <Menu
      anchorEl={filterAnchorEl}
      open={isFilterMenuOpen}
      onClose={handleFilterMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        style: {
          backgroundColor: '#333',
          color: '#fff',
          border: '1px solid #444'
        }
      }}
    >
      <MenuItem onClick={() => handleFilterSelect('ascending')} sx={{ color: '#fff' }}>
        Ascendente
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect('descending')} sx={{ color: '#fff' }}>
        Descendente
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect('category')} sx={{ color: '#fff' }}>
        Por Categoría
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect('priceHigh')} sx={{ color: '#fff' }}>
        Precio Mayor
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect('priceLow')} sx={{ color: '#fff' }}>
        Precio Menor
      </MenuItem>
      <MenuItem onClick={() => handleFilterSelect('capacity')} sx={{ color: '#fff' }}>
        Por Capacidad
      </MenuItem>
    </Menu>
  );

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
            Membresías y Servicios
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: "16px", color: "#ccc" }}>
            Administra fácilmente las membresías y servicios <hr /> de tu gimnasio
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
            <Typography variant="h6" sx={{ margin: 0, fontSize: "18x", color: "#F8820B" }}>
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

      {/* Segundo nivel: Título de Membresías */}
      <Grid container justifyContent="space-between" sx={{ padding: "20px 20px" }}>
        <Grid item sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "#e67e22",
              fontWeight: "bold",
              marginRight: 2,
            }}
          >
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
            {membershipCount}
          </Box>
        </Grid>
        <Grid item>
          <Button
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
            onClick={handleAddMembership}
          >
            Crear membresía
          </Button>
        </Grid>
      </Grid>

      {/* Tercer nivel: Carrusel de Membresías */}
      <Box sx={{ padding: "20px 29px 30px 20px" }}>
        <Slider {...settings}>
          {memberships.map((membership, index) => (
            <Box key={index} sx={{ padding: "0 60px" }}>
              <Card
                sx={{
                  backgroundColor: "#333333",
                  color: "white",
                  borderRadius: "8px",
                  height: "400px",
                  width: "380px",
                }}
              >
                <CardContent sx={{ padding: "20px" }}>
                  {/* Header */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* Círculo de porcentaje aumentado de tamaño */}
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
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{ color: membership.color, fontWeight: "bold", fontSize: "26px" }}
                        >
                          {membership.name}
                        </Typography>
                        {/* Movida la información de clientes aquí debajo del nombre */}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            component="span"
                            sx={{ color: membership.color, marginRight: 1, display: "flex", alignItems: "center" }}
                          >
                            {membership.userType === "group" ? (
                              <GroupIcon fontSize="small" />
                            ) : (
                              <PersonIcon fontSize="small" />
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ color: "#aaa", fontSize: "16px" }}>
                            {membership.clients} Clientes
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton sx={{ color: membership.color, padding: "4px", marginLeft: "80px" }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" sx={{ color: "#ddd", fontSize: "16px", marginBottom: 2 }}>
                    {membership.description}
                  </Typography>

                  {/* Pricing Information */}
                  <Box sx={{ marginBottom: 2, marginTop: "18px" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 1.25 }}>
                      <Typography variant="body2" sx={{ color: membership.color, fontSize: "16px" }}>
                        Usuarios:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontSize: "16px" }}>
                        {membership.users}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 1.25 }}>
                      <Typography variant="body2" sx={{ color: membership.color, fontSize: "16px" }}>
                        Mensual:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontSize: "16px" }}>
                        {membership.monthly}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 1.25 }}>
                      <Typography variant="body2" sx={{ color: membership.color, fontSize: "16px" }}>
                        Trimestral:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontSize: "16px" }}>
                        {membership.quarterly}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: membership.color, fontSize: "16px" }}>
                        Anual:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#fff", fontSize: "16px" }}>
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

      {/* Cuarto nivel: Título de Servicios */}
      <Grid container justifyContent="space-between" sx={{ padding: "20px 20px" }}>
        <Grid item sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: "#e67e22",
              fontWeight: "bold",
              marginRight: 2,
            }}
          >
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
              marginBottom: "13px",
            }}
            onClick={handleAddService}
          >
            Crear servicio
          </Button>
        </Grid>
      </Grid>

      {/* Quinto nivel: Tabla de Servicios */}
      <Box sx={{ padding: "0 20px 30px 20px" }}>
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#333",
            borderRadius: "8px",
            maxHeight: 350, // Solo se visualizarán 5 servicios
            overflowY: "auto", // Permite desplazarse con scroll o usando la barra de navegación
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell>Nombre</StyledTableHeaderCell>
                <StyledTableHeaderCell>Categoría</StyledTableHeaderCell>
                <StyledTableHeaderCell>Costo</StyledTableHeaderCell>
                <StyledTableHeaderCell>Duración</StyledTableHeaderCell>
                <StyledTableHeaderCell>Capacidad</StyledTableHeaderCell>
                <StyledTableHeaderCell>Estado</StyledTableHeaderCell>
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
              {getSortedServices().map((service) => (
                <TableRow key={service.id}>
                  <StyledTableCell>{service.name}</StyledTableCell>
                  <StyledTableCell>{service.category}</StyledTableCell>
                  <StyledTableCell>{service.cost}</StyledTableCell>
                  <StyledTableCell>{service.duration}</StyledTableCell>
                  <StyledTableCell>{service.capacity}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip status={service.status}>{service.status}</StatusChip>
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
      {renderMenu}
      {filterMenu}
    </>
  );
}