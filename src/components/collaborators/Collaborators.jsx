import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Paper,
  Box,
  Badge,
  InputBase,
  IconButton,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const Collaborators = () => {
  const navigate = useNavigate();
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const messagesCount = 4;
  const notificationsCount = 17;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(''); // 'name' | 'role' | 'date'

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

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);

  const collaborators = [
    { id: 1, name: 'DIEGO BALBUENA CABALLERO', email: '2302131@utrivieramaya.edu.mx', role: 'Empleado', lastActive: 'dic 06' },
    { id: 2, name: 'ENRIQUE CASTILLO RODRIGUEZ', email: '2302045@utrivieramaya.edu.mx', role: 'Administrador', lastActive: 'oct 07' },
    { id: 3, name: 'YAIR GAMALIEL GUZMAN PEREZ', email: '2302133@utrivieramaya.edu.mx', role: 'Administrador', lastActive: 'oct 20' },
    { id: 4, name: 'CESAR DAVID SANCHEZ TREJO', email: '2302073@utrivieramaya.edu.mx', role: 'Administrador', lastActive: 'oct 10' },
    { id: 5, name: 'AARON SANTOS ABSALON', email: '2302042@utrivieramaya.edu.mx', role: 'Administrador', lastActive: 'nov 17' },
    { id: 6, name: 'ALEJANDRO GARCIA GUTIERREZ', email: 'alejandroGarcia@gmail.com', role: 'Consultor', lastActive: 'nov 25' },
    { id: 7, name: 'JESUS FERNANDO FERNANDEZ', email: 'JesfernanFernandez@gmail.com', role: 'Consultor', lastActive: 'sep 19' },
    { id: 8, name: 'ROBERTO RAMIREZ AGUILAR', email: 'robertram1Aguilar@gmail.com', role: 'Consultor', lastActive: 'oct 10' }
  ];

  const handleMenuOpen = (event) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  const handleFilterClick = (e) => {
    setAnchorElFilter(e.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorElFilter(null);
  };
  const handleSort = (criterion) => {
    setSortBy(criterion);
    handleFilterClose();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const displayed = useMemo(() => {
    let arr = collaborators.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === 'name') {
      arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'role') {
      arr.sort((a, b) => a.role.localeCompare(b.role));
    }
    if (sortBy === 'date') {
      const monthOrder = { ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, sep: 9, oct: 10, nov: 11, dic: 12 };
      arr.sort((a, b) => {
        const [ma, da] = a.lastActive.split(' ');
        const [mb, db] = b.lastActive.split(' ');
        if (monthOrder[ma] !== monthOrder[mb]) return monthOrder[ma] - monthOrder[mb];
        return parseInt(da) - parseInt(db);
      });
    }
    return arr;
  }, [searchTerm, sortBy]);

  return (
    <>
      {/* Header */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: "10px 0 20px 0" }}>

        <Grid item>
          <Typography variant="h4" sx={{ margin: 0, fontSize: "30px", fontWeight: "bold" }}>
          Colaboradores
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: "16px", color: "#ccc", marginTop: "10px" }}>
            Registra a tus empleados del gym
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
              width: "420px",
              height: "48px",
              marginTop: "0px",
              backgroundColor: "#ffff",
              border: "1px solid #444",
            }}
          >
            <IconButton type="submit" sx={{ p: "8px" }} color="primary">
              <SearchIcon sx={{ fontSize: "26px", color: "#aaa" }} />
            </IconButton>
            <InputBase
            onChange={handleSearch}
            sx={{ ml: 2, flex: 1, fontSize: "18px", color: "#000" }} 
            placeholder="Buscar un colaborador ..." 
            />
          </Paper>
        </Grid>

        {/* Perfil del usuario */}
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton size="large" aria-label="show new mails" sx={{ color: "#fff" }}>
              <Badge badgeContent={messagesCount} color="error">
                <MailIcon sx={{ fontSize: "30px" }} />
              </Badge>
            </IconButton>
            <IconButton size="large" aria-label="show new notifications" sx={{ color: "#fff" }}>
              <Badge badgeContent={notificationsCount} color="error">
                <NotificationsIcon sx={{ fontSize: "30px" }} />
              </Badge>
            </IconButton>
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

      {/* Content Section */}
      <Grid container spacing={3}>

        <Grid item xs={12} sm={6}>
          <Button sx={{
            backgroundColor: '#F8820B',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontSize: '14px',
            marginTop: '10px',
            '&:hover': {
              backgroundColor: '#FF6600',
              color: 'white'
            }
          }}>
            REGISTRAR COLABORADOR
            <AddIcon />
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <IconButton sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            color: '#F8820B',
            fontWeight: '500',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#FF6600',
              color: 'white'
            }
          }} onClick={handleFilterClick}>
            <FilterIcon />
            <Typography variant="h6">Filtrar</Typography>
          </IconButton>
          <Menu
            anchorEl={anchorElFilter}
            open={Boolean(anchorElFilter)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={() => handleSort('name')}>Ordenar por Nombre</MenuItem>
            <MenuItem onClick={() => handleSort('role')}>Ordenar por Rol</MenuItem>
            <MenuItem onClick={() => handleSort('date')}>Ordenar por Fecha</MenuItem>
          </Menu>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ backgroundColor: '#45474B', borderRadius: '10px', overflow: 'hidden', marginTop: '40px' }}>
            <Box sx={{ backgroundColor: '#333', padding: '15px 20px' }}>
              <Grid container spacing={3} sx={{ fontWeight: 'bold', color: '#ddd' }}>
                <Grid item xs={3}>Nombre</Grid>
                <Grid item xs={3}>Correo electrónico</Grid>
                <Grid item xs={2}>Rol</Grid>
                <Grid item xs={2}>Activo por última vez</Grid>
                <Grid item xs={2}>Ajustes</Grid>
              </Grid>
            </Box>
            <div style={{ height: '3px', backgroundColor: '#F8820B', width: '100%' }}></div>
            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              {displayed.length === 0 ? (
                <Box sx={{ textAlign: 'center', padding: '40px 0', color: '#ccc', fontSize: '16px' }}>No se encontraron colaboradores que coincidan con tu búsqueda.</Box>
              ) : (
                displayed.map(c => (
                  <Grid container key={c.id} spacing={3} sx={{ padding: '15px 20px', borderBottom: '1px solid #444', '&:hover': { backgroundColor: '#333' } }}>
                    <Grid item xs={3}>{c.name}</Grid>
                    <Grid item xs={3}>{c.email}</Grid>
                    <Grid item xs={2} sx={{ fontWeight: '500' }}>{c.role}</Grid>
                    <Grid item xs={2} sx={{ color: '#aaa' }}>{c.lastActive}</Grid>
                    <Grid item xs={2}>
                      <IconButton sx={{ background: 'none', border: 'none', color: '#888' }} onClick={handleMenuOpen} size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
        <MenuItem onClick={handleMenuClose}>Eliminar</MenuItem>
        <MenuItem onClick={handleMenuClose}>Ver detalles</MenuItem>
      </Menu>
    </>
  );
};

export default Collaborators;
