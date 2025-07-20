// src/components/clients/Users.jsx

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
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  Group as GroupIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ModalClient from "./ModalClient";

export default function Users({ collapsed }) {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clientEditar, setClientEditar] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [clientSeleccionado, setClientSeleccionado] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // Estados para filtros
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const roleName = user?.role?.role_name || "Rol desconocido";
  const displayName = `${user?.name?.split(" ")[0] || ""} ${user?.last_name?.split(" ")[0] || ""}`.trim();
  const usernameInitials = user?.username?.slice(0, 2).toUpperCase() || "";

  // Función para verificar si un cliente está vencido
  const isClientExpired = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    const expirationDate = new Date(endDate);
    return today > expirationDate;
  };

  // Función para actualizar el estado de un cliente vencido
  const updateExpiredClientStatus = async (clientId) => {
    try {
      const res = await fetch(`${API}/api/clients/updated`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          id: clientId, 
          status: "Vencido" 
        }),
      });
      if (!res.ok) throw await res.json();
    } catch (err) {
      console.error("Error actualizando estado del cliente:", err);
    }
  };

  // Función para recalcular fecha de vencimiento basada en la membresía
  const recalculateEndDate = async (clientId, membershipType, startDate) => {
    try {
      // Obtener información de la membresía usando la nueva ruta
      const membershipRes = await fetch(`${API}/api/memberships/${membershipType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!membershipRes.ok) return;
      
      const membershipData = await membershipRes.json();
      const durationDays = membershipData.duration_days || 30; // Por defecto 30 días
      
      // Calcular nueva fecha de vencimiento
      const start = new Date(startDate);
      const newEndDate = new Date(start);
      newEndDate.setDate(start.getDate() + durationDays);
      
      // Actualizar fecha de vencimiento en la base de datos
      const updateRes = await fetch(`${API}/api/clients/updated`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          id: clientId, 
          end_date: newEndDate.toISOString() 
        }),
      });
      
      if (!updateRes.ok) throw await updateRes.json();
      
      // Refrescar la lista de clientes después de la actualización
      fetchClients();
      
    } catch (err) {
      console.error("Error recalculando fecha de vencimiento:", err);
    }
  };

  // Nueva función para actualizar fechas de vencimiento cuando se modifica una membresía
  const updateClientEndDatesForMembership = async (membershipId, newDurationDays) => {
    try {
      // Obtener todos los clientes que tienen esta membresía
      const clientsWithMembership = clients.filter(client => {
        const clientMembershipId = typeof client.membership_id === 'object' 
          ? client.membership_id._id 
          : client.membership_id;
        return clientMembershipId === membershipId;
      });

      // Actualizar la fecha de vencimiento para cada cliente
      const updatePromises = clientsWithMembership.map(async (client) => {
        if (client.start_date) {
          const startDate = new Date(client.start_date);
          const newEndDate = new Date(startDate);
          newEndDate.setDate(startDate.getDate() + newDurationDays);

          return fetch(`${API}/api/clients/updated`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              id: client._id, 
              end_date: newEndDate.toISOString() 
            }),
          });
        }
      });

      await Promise.all(updatePromises.filter(Boolean));
      
      // Refrescar la lista de clientes
      fetchClients();
      
      alert(`Actualizadas las fechas de vencimiento de ${clientsWithMembership.length} clientes para la membresía modificada`);
      
    } catch (err) {
      console.error("Error actualizando fechas de clientes para membresía modificada:", err);
    }
  };

  // Función para escuchar cambios en las membresías (polling simple)
  const checkMembershipUpdates = async () => {
    try {
      // Obtener todas las membresías actuales
      const membershipRes = await fetch(`${API}/api/memberships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!membershipRes.ok) return;
      
      const currentMemberships = await membershipRes.json();
      
      // Verificar si hay clientes y membresías cargadas
      if (clients.length > 0 && currentMemberships.length > 0) {
        // Obtener las membresías únicas de los clientes actuales
        const uniqueMembershipIds = [...new Set(clients.map(client => {
          return typeof client.membership_id === 'object' 
            ? client.membership_id._id 
            : client.membership_id;
        }).filter(Boolean))];

        // Para cada membresía única, verificar si necesita actualización de fechas
        for (const membershipId of uniqueMembershipIds) {
          const membership = currentMemberships.find(m => m._id === membershipId);
          if (membership) {
            // Verificar si algún cliente tiene una fecha de vencimiento incorrecta
            const clientsWithThisMembership = clients.filter(client => {
              const clientMembershipId = typeof client.membership_id === 'object' 
                ? client.membership_id._id 
                : client.membership_id;
              return clientMembershipId === membershipId;
            });

            for (const client of clientsWithThisMembership) {
              if (client.start_date && client.end_date) {
                const startDate = new Date(client.start_date);
                const currentEndDate = new Date(client.end_date);
                const calculatedEndDate = new Date(startDate);
                calculatedEndDate.setDate(startDate.getDate() + membership.duration_days);

                // Comparar fechas (ignorando diferencias de milisegundos)
                const daysDifference = Math.abs(currentEndDate.getTime() - calculatedEndDate.getTime()) / (1000 * 60 * 60 * 24);
                
                if (daysDifference > 1) { // Si hay más de 1 día de diferencia
                  console.log(`Detectado cambio en membresía ${membership.name_membership}, actualizando fechas de clientes...`);
                  await updateClientEndDatesForMembership(membershipId, membership.duration_days);
                  break; // Solo necesitamos detectar un cliente con fecha incorrecta para actualizar todos
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Error verificando actualizaciones de membresías:", err);
    }
  };

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const res = await fetch(`${API}/api/clients/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw await res.json();
      const clientsData = await res.json();
      
      // Filtrar elementos nulos o inválidos y asegurarse de que tengan estructura válida
      const validClients = clientsData.filter(client => 
        client && 
        typeof client === 'object' && 
        client._id
      );

      // Verificar clientes vencidos y actualizar su estado
      const updatedClients = await Promise.all(
        validClients.map(async (client) => {
          if (client.end_date && isClientExpired(client.end_date) && client.status !== "Vencido") {
            await updateExpiredClientStatus(client._id);
            return { ...client, status: "Vencido" };
          }
          return client;
        })
      );

      setClients(updatedClients);
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setClients([]); // Establecer array vacío en caso de error
    }
  };

  useEffect(() => {
    fetchClients();
    
    // Verificar clientes vencidos cada hora
    const expiredClientsInterval = setInterval(() => {
      fetchClients();
    }, 3600000); // 1 hora en milisegundos
    
    // Verificar cambios en membresías cada 5 minutos
    const membershipChangesInterval = setInterval(() => {
      checkMembershipUpdates();
    }, 300000); // 5 minutos en milisegundos
    
    return () => {
      clearInterval(expiredClientsInterval);
      clearInterval(membershipChangesInterval);
    };
  }, []);

  // Verificar cambios de membresía después de que se carguen los clientes
  useEffect(() => {
    if (clients.length > 0) {
      const timeoutId = setTimeout(() => {
        checkMembershipUpdates();
      }, 2000); // Esperar 2 segundos después de cargar los clientes

      return () => clearTimeout(timeoutId);
    }
  }, [clients.length]);

  // Helper function to get full name with null safety
  const getFullName = (client) => {
    if (!client || !client.full_name || typeof client.full_name !== 'object') {
      return "N/A";
    }
    
    const { first = "", last_father = "", last_mother = "" } = client.full_name;
    
    // Asegurarse de que todos los valores sean strings
    const firstName = typeof first === 'string' ? first : "";
    const lastFather = typeof last_father === 'string' ? last_father : "";
    const lastMother = typeof last_mother === 'string' ? last_mother : "";
    
    const fullName = `${firstName} ${lastFather} ${lastMother}`.trim();
    return fullName || "N/A";
  };

  // Filtered and sorted clients with null safety
  const displayed = useMemo(
    () => {
      let filtered = clients.filter((c) => {
        // Verificación completa de seguridad antes de acceder a propiedades
        if (!c || typeof c !== 'object') return false;
        
        const nombre = getFullName(c).toLowerCase();
        const email = c.email || "";
        const phone = c.phone || "";
        
        return (
          nombre.includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          phone.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });

      // Aplicar ordenamiento con verificaciones de seguridad
      if (sortBy === "name-asc") {
        filtered.sort((a, b) => {
          const nameA = getFullName(a);
          const nameB = getFullName(b);
          return nameA.localeCompare(nameB);
        });
      } else if (sortBy === "name-desc") {
        filtered.sort((a, b) => {
          const nameA = getFullName(a);
          const nameB = getFullName(b);
          return nameB.localeCompare(nameA);
        });
      } else if (sortBy === "email") {
        filtered.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
      } else if (sortBy === "membership") {
        filtered.sort((a, b) => (a.membership_type || "").localeCompare(b.membership_type || ""));
      } else if (sortBy === "start-date") {
        filtered.sort((a, b) => new Date(a.start_date || 0) - new Date(b.start_date || 0));
      } else if (sortBy === "end-date") {
        filtered.sort((a, b) => new Date(a.end_date || 0) - new Date(b.end_date || 0));
      } else if (sortBy === "payment") {
        filtered.sort((a, b) => (a.payment?.amount || 0) - (b.payment?.amount || 0));
      } else if (sortBy === "status") {
        filtered.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
      }

      return filtered;
    },
    [searchTerm, clients, sortBy]
  );

  // Handlers
  const abrirRegistro = () => {
    setModoEdicion(false);
    setClientEditar(null);
    setModalOpen(true);
  };
  
  const abrirEdicion = (c) => {
    setModoEdicion(true);
    setClientEditar(c);
    setModalOpen(true);
    setAnchorElMenu(null);
  };
  
  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/api/clients/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: clientSeleccionado._id }),
      });
      if (!res.ok) throw await res.json();
      fetchClients(); // Refresh the client list after deletion
    } catch (err) {
      console.error("Error eliminando cliente:", err);
    } finally {
      setOpenDeleteDialog(false);
      setAnchorElMenu(null);
    }
  };

  const onModalClose = () => {
    setModalOpen(false);
    fetchClients();
  };

  // Función para manejar la actualización de membresía y recalcular fecha de vencimiento
  const handleRecalculateMembership = async (client) => {
    if (client.membership_id && client.start_date) {
      const membershipId = typeof client.membership_id === 'object' 
        ? client.membership_id._id 
        : client.membership_id;
      
      await recalculateEndDate(client._id, membershipId, client.start_date);
    }
  };

  // Handlers para filtros
  const handleFilterClick = (e) => setAnchorElFilter(e.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleSort = (criterion) => {
    setSortBy(criterion);
    handleFilterClose();
  };
  // Helper function to safely format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  // Helper function to format payment amount
  const formatPayment = (client) => {
    if (!client.payment || !client.payment.amount) return "N/A";
    const amount = client.payment.amount;
    const currency = client.payment.currency || "MXN";
    return `$${amount} ${currency}`;
  };

  // Helper function to get status color and format
  const getStatusDisplay = (status) => {
    const statusMap = {
      "Activo": { color: "#4caf50", icon: "🟢" },
      "Inactivo": { color: "#f44336", icon: "🔴" },
      "Pendiente": { color: "#ff9800", icon: "🟡" },
      "Vencido": { color: "#ff5722", icon: "🟠" },
      "Cancelado": { color: "#9e9e9e", icon: "⚫" },
      "Debe": { color: "#2196f3", icon: "🔵" },
    };

    const statusInfo = statusMap[status] || { color: "#9e9e9e", icon: "⚫" };
    
    return (
      <Chip
        label={`${statusInfo.icon} ${status || "N/A"}`}
        size="small"
        sx={{
          bgcolor: statusInfo.color,
          color: "#fff",
          fontWeight: 600,
          fontSize: "11px",
          height: "24px",
          "& .MuiChip-label": {
            padding: "0 8px",
          }
        }}
      />
    );
  };

  const colorMap = {
    Rojo: "#e74c3c",
    Azul: "#3498db",
    Verde: "#2ecc71",
    Amarillo: "#f1c40f",
    Morado: "#9b59b6",
    Naranja: "#e67e22",
    Rosa: "#e91e63",
    Durazno: "#ffb74d",
    Turquesa: "#1abc9c",
    RojoVino: "#880e4f",
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
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ py: 2 }}>
        <Grid item sx={{ mr: 2 }}>
          <Typography variant="h4" sx={{ fontSize: 30, fontWeight: "bold" }}>
            Clientes
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 16, color: "#ccc", mt: 1 }}>
            Registra y gestiona tus clientes
          </Typography>
        </Grid>
        <Grid item xs={12} sm={7} md={5} lg={6}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: "30px",
              boxShadow: 3,
              width: collapsed ? "420px" : "700px",
              maxWidth: "100%",
              height: 48,
              bgcolor: "#fff",
              border: "1px solid #444",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <IconButton disabled sx={{ p: 1 }}>
              <SearchIcon sx={{ fontSize: 26, color: "#aaa" }} />
            </IconButton>
            <InputBase
              placeholder="Buscar un cliente..."
              sx={{ ml: 2, flex: 1, fontSize: 18, color: "#000" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Paper>
        </Grid>
        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right", ml: 2 }}>
            <Typography sx={{ fontSize: 20, color: "#F8820B", fontWeight: "bold" }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 15, color: "#ccc" }}>
              {roleName}
            </Typography>
          </Box>
          <IconButton sx={{ color: "#fff" }}>
            {usernameInitials ? (
              <Avatar sx={{ width: 50, height: 50, bgcolor: roleName === "Colaborador" ? getMappedColor(user?.color) : "#ff4300", fontWeight: "bold" }}>
                {usernameInitials}
              </Avatar>
            ) : (
              <AccountCircle sx={{ fontSize: 60 }} />
            )}
          </IconButton>
        </Grid>
      </Grid>

      {/* Botones de acción */}
      <Grid container justifyContent="flex-end" spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#F8820B",
              color: "black",
              borderRadius: 2,
              fontWeight: 800,
              px: 2,
              "&:hover": { bgcolor: "#FF6600", color: "#fff" },
            }}
            onClick={abrirRegistro}
          >
            REGISTRAR CLIENTE
          </Button>
        </Grid>
        <Grid item>
          <Button
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{
              color: "#F8820B",
              fontWeight: "500",
              borderRadius: 2,
              px: 2,
              border: "1px solid #F8820B",
              "&:hover": {
                bgcolor: "#FF6600",
                border: "1px solid #FF6600",
                color: "white",
              },
            }}
          >
            Filtrar
          </Button>
        </Grid>
      </Grid>

      {/* Menú de filtros */}
      <Menu 
        anchorEl={anchorElFilter} 
        open={Boolean(anchorElFilter)} 
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            bgcolor: "#4d4a49",
            border: "1px solid #404040",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
          }
        }}
      >
        <MenuItem 
          onClick={() => handleSort("name-asc")}
          sx={{ 
            color: sortBy === "name-asc" ? "#F8820B" : "#fff", 
            "&:hover": { bgcolor: "#353842", color: "#F8820B" } 
          }}
        >
          Ordenar por Nombre (A-Z)
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort("name-desc")}
          sx={{ 
            color: sortBy === "name-desc" ? "#F8820B" : "#fff", 
            "&:hover": { bgcolor: "#353842", color: "#F8820B" } 
          }}
        >
          Ordenar por Nombre (Z-A)
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort("email")}
          sx={{ 
            color: sortBy === "email" ? "#F8820B" : "#fff", 
            "&:hover": { bgcolor: "#353842", color: "#F8820B" } 
          }}
        >
          Ordenar por Correo
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort("membership")}
          sx={{ 
            color: sortBy === "membership" ? "#F8820B" : "#fff", 
            "&:hover": { bgcolor: "#353842", color: "#F8820B" } 
          }}
        >
          Ordenar por Tipo de Membresía
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort("start-date")}
          sx={{ 
            color: sortBy === "start-date" ? "#F8820B" : "#fff", 
            "&:hover": { bgcolor: "#353842", color: "#F8820B" } 
          }}
        >
          Ordenar por Fecha de Inicio
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort("end-date")}
          sx={{ 
            color: sortBy === "end-date" ? "#F8820B" : "#fff", 
            "&:hover": { bgcolor: "#353842", color: "#F8820B" } 
          }}
        >
          Ordenar por Fecha de Vencimiento
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort("payment")}
          sx={{ 
            color: sortBy === "payment" ? "#F8820B" : "#fff", 
            "&:hover": { bgcolor: "#353842", color: "#F8820B" } 
          }}
        >
          Ordenar por Total de Pago
        </MenuItem>
        <MenuItem 
          onClick={() => handleSort("status")}
          sx={{ 
            color: sortBy === "status" ? "#F8820B" : "#fff", 
            "&:hover": { bgcolor: "#353842", color: "#F8820B" } 
          }}
        >
          Ordenar por Estado
        </MenuItem>
      </Menu>

      {/* Listado */}
      <Card sx={{ bgcolor: "#2A2D31", borderRadius: 2, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", border: "1px solid #404040", overflowX: "auto" }}>
        {/* Header tabla */}
        <Box sx={{ bgcolor: "#4d4a49", p: 2, position: "relative", minWidth: "1300px" }}>
          <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }} />
          <Grid container spacing={1} sx={{ position: "relative", zIndex: 1 }}>
            <Grid item xs={0.5}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>ID</Typography></Grid>
            <Grid item xs={1.6}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>NOMBRE COMPLETO</Typography></Grid>
            <Grid item xs={1.6}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>EMAIL</Typography></Grid>
            <Grid item xs={1.1}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>TELÉFONO</Typography></Grid>
            <Grid item xs={1.1}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>TIPO MEMBRESÍA</Typography></Grid>
            <Grid item xs={0.9}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>FECHA INICIO</Typography></Grid>
            <Grid item xs={1.2}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>FECHA VENCIMIENTO</Typography></Grid>
            <Grid item xs={1}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>MÉTODO PAGO</Typography></Grid>
            <Grid item xs={1}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>TOTAL PAGO</Typography></Grid>
            <Grid item xs={0.9}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px" }}>ESTADO</Typography></Grid>
            <Grid item xs={0.5}><Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "12px", textAlign: "center" }}>ACCIONES</Typography></Grid>
          </Grid>
        </Box>
        <CardContent sx={{ p: 0, maxHeight: 500, overflowY: "auto", minWidth: "1300px" }}>
          {displayed.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6, color: "#888" }}>
              <GroupIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#ccc" }}>No se encontraron clientes</Typography>
              <Typography>Intenta con otros términos de búsqueda</Typography>
            </Box>
          ) : (
            displayed.map((c, idx) => (
              <Box key={c._id || idx} sx={{
                transition: "all 0.2s",
                "&:hover": { bgcolor: "#353842", transform: "translateX(4px)", boxShadow: "inset 4px 0 0 #F8820B" }
              }}>
                <Grid container alignItems="center" spacing={1} sx={{ p: 1.5, minHeight: "60px" }}>
                  <Grid item xs={0.5}>
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
                  <Grid item xs={1.6}>
                    <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "13px", lineHeight: 1.2 }}>
                      {getFullName(c)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1.6}>
                    <Typography sx={{ color: "#ccc", fontSize: "13px", wordBreak: "break-all", lineHeight: 1.2 }}>
                      {c.email || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={1.1}>
                    <Typography sx={{ color: "#ccc", fontSize: "13px", lineHeight: 1.2 }}>
                      {c.phone || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={1.1}>
                    <Typography sx={{ color: "#ccc", fontSize: "13px", lineHeight: 1.2 }}>
                      {c.membership_type || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={0.9}>
                    <Typography sx={{ color: "#ccc", fontSize: "13px", lineHeight: 1.2 }}>
                      {formatDate(c.start_date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1.2}>
                    <Typography sx={{ 
                      color: isClientExpired(c.end_date) ? "#ff5722" : "#ccc", 
                      fontSize: "13px", 
                      lineHeight: 1.2,
                      fontWeight: isClientExpired(c.end_date) ? "600" : "400"
                    }}>
                      {formatDate(c.end_date)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography sx={{ color: "#ccc", fontSize: "13px", lineHeight: 1.2 }}>
                      {c.payment?.method || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={0.9}>
                    <Typography sx={{ color: "#ccc", fontSize: "13px", lineHeight: 1.2 }}>
                      {formatPayment(c)}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    {getStatusDisplay(c.status)}
                  </Grid>
                  <Grid item xs={0.5} textAlign="center">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setAnchorElMenu(e.currentTarget);
                        setClientSeleccionado(c);
                      }}
                      sx={{
                        bgcolor: "rgba(248,130,11,0.1)",
                        color: "#F8820B",
                        "&:hover": { bgcolor: "rgba(248,130,11,0.2)" },
                        width: 32,
                        height: 32
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Grid>
                </Grid>
                {idx < displayed.length - 1 && <Divider sx={{ borderColor: "#404040", mx: 3 }} />}
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      {/* Menú acciones */}
      <Menu
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={() => setAnchorElMenu(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { bgcolor: "#4d4a49", border: "1px solid #404040", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" } }}
      >
        <MenuItem onClick={() => abrirEdicion(clientSeleccionado)} sx={{ color: "#fff", "&:hover": { color: "#F8820B" } }}>Editar</MenuItem>
        <MenuItem 
          onClick={() => { 
            handleRecalculateMembership(clientSeleccionado); 
            setAnchorElMenu(null); 
          }} 
          sx={{ color: "#fff", "&:hover": { color: "#4caf50" } }}
        >
          Recalcular Vencimiento
        </MenuItem>
        <MenuItem onClick={() => { setOpenDeleteDialog(true); setAnchorElMenu(null); }} sx={{ color: "#fff", "&:hover": { color: "#FF3B30" } }}>Eliminar</MenuItem>
      </Menu>

      {/* Modal crear/editar */}
      <ModalClient
        open={modalOpen}
        onClose={onModalClose}
        modoEdicion={modoEdicion}
        clientEditar={clientEditar}
        onGuardadoExitoso={() => {}}
      />

      {/* Confirm delete */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} PaperProps={{ sx: { bgcolor: "#2A2D31", border: "1px solid #404040" } }}>
        <DialogTitle sx={{ color: "#fff" }}>¿Eliminar cliente?</DialogTitle>
        <DialogContent><Typography sx={{ color: "#ccc" }}>¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.</Typography></DialogContent>
        <DialogActions>
          <Button sx={{ color: "#ccc" }} onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button sx={{ bgcolor: "#FF3B30", color: "#fff", "&:hover": { bgcolor: "#D32F2F" } }} onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

Users.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};