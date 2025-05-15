// Importing CSS styles
import './Collaborators.css';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  InputBase,
  IconButton,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';



const Collaborators = () => {
  const navigate = useNavigate();
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(''); // 'name' | 'role' | 'date'

  const collaborators = [
    { id: 1, name: 'DIEGO BALBUENA CABALLERO', email: '2302131@utrivieramaya.edu.mx', role: 'Empleado',     lastActive: 'dic 06' },
    { id: 2, name: 'ENRIQUE CASTILLO RODRIGUEZ', email: '2302045@utrivieramaya.edu.mx', role: 'Administrador', lastActive: 'oct 07' },
    { id: 3, name: 'YAIR GAMALIEL GUZMAN PEREZ', email: '2302133@utrivieramaya.edu.mx', role: 'Administrador', lastActive: 'oct 20' },
    { id: 4, name: 'CESAR DAVID SANCHEZ TREJO', email: '2302073@utrivieramaya.edu.mx', role: 'Administrador', lastActive: 'oct 10' },
    { id: 5, name: 'AARON SANTOS ABSALON',         email: '2302042@utrivieramaya.edu.mx', role: 'Administrador', lastActive: 'nov 17' },
    { id: 6, name: 'ALEJANDRO GARCIA GUTIERREZ',  email: 'alejandroGarcia@gmail.com',    role: 'Consultor',    lastActive: 'nov 25' },
    { id: 7, name: 'JESUS FERNANDO FERNANDEZ',   email: 'JesfernanFernandez@gmail.com', role: 'Consultor',    lastActive: 'sep 19' },
    { id: 8, name: 'ROBERTO RAMIREZ AGUILAR',    email: 'robertram1Aguilar@gmail.com',  role: 'Consultor',    lastActive: 'oct 10' }
  ];

  // Manejo menú de opciones de fila
  const handleMenuOpen = (event) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  // Manejo menú de filtro/orden
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

  // Búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Data filtrada + ordenada
  const displayed = useMemo(() => {
    let arr = collaborators.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortBy === 'name') {
      arr.sort((a,b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'role') {
      arr.sort((a,b) => a.role.localeCompare(b.role));
    }
    if (sortBy === 'date') {
      // asume formato "mes dd"
      const monthOrder = { ene:1,feb:2,mar:3,abr:4,may:5,jun:6,jul:7,ago:8,sep:9,oct:10,nov:11,dic:12 };
      arr.sort((a,b) => {
        const [ma,da] = a.lastActive.split(' ');
        const [mb,db] = b.lastActive.split(' ');
        if (monthOrder[ma] !== monthOrder[mb]) return monthOrder[ma] - monthOrder[mb];
        return parseInt(da) - parseInt(db);
      });
    }
    return arr;
  }, [searchTerm, sortBy]);

  return (
    <div className="collaborators-container">
      {/* Header */}
      <Box className="header">
        <Typography className="header-title" >Colaboradores</Typography>
        
        <Box className="search-bar">
          <InputBase
            placeholder="Buscar un colaborador"
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
          />
          <IconButton type="submit" size="small">
            <SearchIcon className="search-icon" />
          </IconButton>
        </Box>
        
        <Box className="header-actions">
          <IconButton className="icon-button"><ChatIcon /></IconButton>
          <IconButton className="icon-button"><NotificationsIcon /></IconButton>
          <Box className="user-info">
            <Box className="user-name">
              <Typography variant="body2" style={{color: "#F8820B", fontSize: 18, fontWeight:"bold"}}>Yair Guzman</Typography>
              <Typography variant="caption" style={{fontSize: 14}}>Administrador</Typography>
            </Box>
            <Avatar className="avatar">G</Avatar>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      <Box className="content-section">
        <Typography className="section-title">
          Selecciona la sección que deseas acceder:
        </Typography>
        <Typography className="section-description">
          Registra a los colaboradores o trabajadores de tu gym. Incluso modificando permisos o roles en TimeFit admin.
        </Typography>
        
        <Box className="actions-container">
          <Button className="register-button" startIcon={<AddIcon />}>
            REGISTRAR COLABORADOR
          </Button>
          
          <IconButton className="filter-button" onClick={handleFilterClick}>
            <FilterIcon /> 
            <h6>Filtrar</h6>
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
        </Box>
        
        {/* Tabla */}
        <Box className="collaborators-table">
          <Box className="table-header">
            <Box className="table-header-row">
              <Box className="table-cell">Nombre</Box>
              <Box className="table-cell">Correo electrónico</Box>
              <Box className="table-cell">Rol</Box>
              <Box className="table-cell">Activo por última vez</Box>
              <Box className="table-cell">Ajustes</Box>
            </Box>
          </Box>
          <div className="orange-line"></div>

          <Box className="table-body">
            {displayed.length === 0 ? (
              <Box className="no-data">
                No se encontraron colaboradores que coincidan con tu búsqueda.
              </Box>
            ) : (
              displayed.map(c => (
                <Box key={c.id} className="table-row">
                  <Box className="table-cell">{c.name}</Box>
                  <Box className="table-cell">{c.email}</Box>
                  <Box className="table-cell role">{c.role}</Box>
                  <Box className="table-cell last-active">{c.lastActive}</Box>
                  <Box className="table-cell">
                    <IconButton 
                      className="settings-button" 
                      onClick={handleMenuOpen}
                      size="small"
                    >
                      <MoreVertIcon/>
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>

        
        {/* Settings Menu */}
        <Menu
          anchorEl={anchorElMenu}
          open={Boolean(anchorElMenu)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top',    horizontal: 'right' }}
        >
          <MenuItem onClick={handleMenuClose}>Editar</MenuItem>
          <MenuItem onClick={handleMenuClose}>Eliminar</MenuItem>
          <MenuItem onClick={handleMenuClose}>Ver detalles</MenuItem>
        </Menu>
      </Box>
    </div>
  );
};

export default Collaborators;
