import React, { useState } from 'react';
import {
  Box,
  Badge,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Avatar
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";

const Revenue = () => {
    const messagesCount = 4;
  const notificationsCount = 17;

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

  const [expandedWidgets] = useState({
    earnings: true,
    products: true,
    memberships: true,
    newClients: true,
    expenses: true,
    topProducts: true,
  });

  const chartData = [
    { day: 'Lun 2', income: 1800, increase: 2200 },
    { day: 'Mar 3', income: 5000, increase: 2000 },
    { day: 'Mie 4', income: 3500, increase: 1500 },
    { day: 'Jue 5', income: 1800, increase: 1200 },
    { day: 'Vie 6', income: 3000, increase: 0, decrease: 600 },
    { day: 'Sab 7', income: 2000, increase: 1600 },
    { day: 'Dom 8', income: 1500, increase: 0, decrease: 700 },
  ];

  const topProducts = [
    { id: '01', name: 'Suplemento Proteico', quantity: '100 Unidades', earnings: '$1,500 MXN', percentage: '60%' },
    { id: '02', name: 'Ropa Deportiva', quantity: '70 piezas', earnings: '$700 MXN', percentage: '30%' },
    { id: '03', name: 'Botellas Reutilizables', quantity: '50 piezas', earnings: '$250 MXN', percentage: '10%' },
  ];

  return (
    <>
      <Grid container
        alignItems="center"
        justifyContent="space-between"
        sx={{ padding: "10px 0 20px 0" }}
      >
        <Grid item>
          <Typography variant="h4" sx={{ margin: 0, fontSize: '30px', fontWeight: 'bold' }}>
            Ingresos
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: "16px", color: "#ccc", marginTop: "10px" }}>
            Esta sesión muestra las ganancias generadas por servicios, productos y membresías del gimnasio.
          </Typography>
        </Grid>

        {/* Perfil del usuario, notificacion y mensaje */}
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

      <Grid container spacing={3} sx={{ marginTop: '5px' }}>
        {/* Columna izquierda */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ backgroundColor: '#45474B', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography sx={{ color: '#F8820B', fontSize: '20px', fontWeight: 'bold' }}>
                Ganancias Obtenidas
              </Typography>
            </Box>

            {expandedWidgets.earnings && (
              <>
                <Typography variant="h3" sx={{ fontSize: '38px', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>
                  $30,047
                  <Box component="span" sx={{ fontSize: '16px', marginLeft: '10px', color: '#B1D690' }}>
                    (+9.65%)
                  </Box>
                  <Box component="span" sx={{ fontSize: '16px', marginLeft: '10px', color: '#E94560' }}>
                    (-2.35%)
                  </Box>
                </Typography>

                <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px', marginTop: '20px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Box sx={{ width: '15px', height: '15px', borderRadius: '3px', backgroundColor: '#F8820B' }}></Box>
                    <Typography sx={{ fontSize: '14px', color: 'white' }}>Ingresos Actual</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Box sx={{ width: '15px', height: '15px', borderRadius: '3px', backgroundColor: '#B1D690' }}></Box>
                    <Typography sx={{ fontSize: '14px', color: 'white' }}>Incremento</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Box sx={{ width: '15px', height: '15px', borderRadius: '3px', backgroundColor: '#E94560' }}></Box>
                    <Typography sx={{ fontSize: '14px', color: 'white' }}>Decremento</Typography>
                  </Box>
                </Box>

                <Box sx={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={0} barSize={30}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#ffff', fontWeight: 'bold' }} />
                      <YAxis tickFormatter={(tick) => `${tick}k`} axisLine={false} tickLine={false} tick={{ fill: '#ffff', fontWeight: 'bold' }} />
                      <Bar dataKey="income" stackId="a" fill="#F8820B" />
                      <Bar dataKey="increase" stackId="a" fill="#B1D690" />
                      <Bar dataKey="decrease" stackId="b" fill="#E94560" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}
          </Paper>

          <Paper sx={{ backgroundColor: '#45474B', borderRadius: '10px', padding: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography sx={{ color: '#F8820B', fontSize: '20px', fontWeight: 'bold' }}>
                Top de los productos más vendidos
              </Typography>
            </Box>

            {expandedWidgets.topProducts && (
              <TableContainer component={Box} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px', fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px', fontWeight: 'bold' }}>Nombre del Producto</TableCell>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px', fontWeight: 'bold' }}>Cantidad Vendida</TableCell>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px', fontWeight: 'bold' }}>Ganancia Obtenida</TableCell>
                      <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px', fontWeight: 'bold' }}>Porcentaje</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px' }}>{product.id}</TableCell>
                        <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px' }}>{product.name}</TableCell>
                        <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px' }}>{product.quantity}</TableCell>
                        <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px' }}>{product.earnings}</TableCell>
                        <TableCell sx={{ color: '#fff', borderBottom: '1px solid #F8820B', padding: '15px 10px' }}>
                          <Box sx={{
                            backgroundColor: '#F8820B',
                            color: 'black',
                            fontWeight: 'bold',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            display: 'inline-block',
                            fontSize: '14px'
                          }}>
                            {product.percentage}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Columna derecha */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ backgroundColor: '#45474B', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography sx={{ color: '#F8820B', fontSize: '20px', fontWeight: 'bold' }}>
                Productos Vendidos
              </Typography>
            </Box>

            {expandedWidgets.products && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontSize: '50px', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>
                  3000
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '16px' }}>
                  <Typography component="span" sx={{ color: '#65B741', fontSize: '16px', fontWeight: 'bold' }}>
                    +9.65%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: '16px', color: 'white' }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ backgroundColor: '#45474B', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography sx={{ color: '#F8820B', fontSize: '20px', fontWeight: 'bold' }}>
                Membrecías Vendidas
              </Typography>
            </Box>

            {expandedWidgets.memberships && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontSize: '50px', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>
                  500
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '16px' }}>
                  <Typography component="span" sx={{ color: '#65B741', fontSize: '16px', fontWeight: 'bold' }}>
                    +10.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: '16px', color: 'white' }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ backgroundColor: '#45474B', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography sx={{ color: '#F8820B', fontSize: '20px', fontWeight: 'bold' }}>
                Nuevos clientes
              </Typography>
            </Box>

            {expandedWidgets.newClients && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontSize: '50px', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>
                  234
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '16px' }}>
                  <Typography component="span" sx={{ color: '#65B741', fontSize: '16px', fontWeight: 'bold' }}>
                    +2.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: '16px', color: 'white' }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          <Paper sx={{ backgroundColor: '#45474B', borderRadius: '10px', padding: '20px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography sx={{ color: '#F8820B', fontSize: '20px', fontWeight: 'bold' }}>
                Gastos totales
              </Typography>
            </Box>

            {expandedWidgets.expenses && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontSize: '50px', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>
                  $15000
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '16px' }}>
                  <Typography component="span" sx={{ color: '#E94560', fontSize: '16px', fontWeight: 'bold' }}>
                    -7.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: '16px', color: 'white' }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Revenue;
