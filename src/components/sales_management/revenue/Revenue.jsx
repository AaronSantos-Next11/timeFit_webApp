// Revenue.jsx
import React, { useState } from 'react';
import {  
  Notifications, 
  Chat,

} from '@mui/icons-material';
import { 
  Box, 
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

const Revenue = () => {
  // Estado para los widgets expandidos/colapsados
  const [expandedWidgets, setExpandedWidgets] = useState({
    earnings: true,
    products: true,
    memberships: true,
    newClients: true,
    expenses: true,
    topProducts: true,
  });

  // Datos para la gráfica
  const chartData = [
    { day: 'Lun 2', income: 1800, increase: 2200 },
    { day: 'Mar 3', income: 5000, increase: 2000 },
    { day: 'Mie 4', income: 3500, increase: 1500 },
    { day: 'Jue 5', income: 1800, increase: 1200 },
    { day: 'Vie 6', income: 3000, increase: 0, decrease: 600 },
    { day: 'Sab 7', income: 2000, increase: 1600 },
    { day: 'Dom 8', income: 1500, increase: 0, decrease: 700 },
  ];

  // Datos de productos más vendidos
  const topProducts = [
    { id: '01', name: 'Suplemento Proteico', quantity: '100 Unidades', earnings: '$1,500 MXN', percentage: '60%' },
    { id: '02', name: 'Ropa Deportiva', quantity: '70 piezas', earnings: '$700 MXN', percentage: '30%' },
    { id: '03', name: 'Botellas Reutilizables', quantity: '50 piezas', earnings: '$250 MXN', percentage: '10%' },
  ];


  // Mock data for user profile
  const displayName = "Yair Guzman";
  const photoURL = null;
  const messagesCount = 0;
  const notificationsCount = 0;
  
  const handleProfileMenuOpen = () => {
    // Function to handle profile menu opening
  };

  return (
    <div className="revenue-container">
      {/* Header con búsqueda y perfil */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "8px 0px", marginBottom: "20px" }}>
        {/* Título y descripción */}
        <Grid item>
          <Typography variant="h4" sx={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
            Ingresos
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: "14px", color: "#ccc", marginRight: "220px", marginTop: "5px" }}>
            Esta sesión muestra las ganancias generadas por servicios, productos y membresías del gimnasio.
          </Typography>
        </Grid>



        {/* Notificaciones y mensajes */}
        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton size="large" aria-label="show messages" sx={{ color: "#fff" }}>
            <Chat sx={{ fontSize: "24px" }} />
          </IconButton>
          <IconButton size="large" aria-label="show notifications" sx={{ color: "#fff" }}>
            <Notifications sx={{ fontSize: "24px" }} />
          </IconButton>
        </Grid>

        {/* Perfil del usuario */}
        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ margin: 0, fontSize: "16px", color: "#F8820B", fontWeight: "bold" }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ margin: 0, fontSize: "14px", color: "#fff" }}>
              Administrador
            </Typography>
          </Box>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: "#3B82F6",
              fontWeight: "bold"
            }}
          >
            G
          </Avatar>
        </Grid>
      </Grid>

      {/* Layout principal - 2 columnas */}
      <Grid container spacing={3}>
        {/* Columna izquierda */}
        <Grid item xs={12} md={8}>
          {/* Widget de ganancias con gráfico */}
          <Paper sx={{ 
            backgroundColor: "#45474B", 
            borderRadius: "10px", 
            padding: "20px",
            marginBottom: "20px"
          }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px" 
            }}>
              <Typography sx={{ 
                color: "#F8820B", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Ganancias Obtenidas
              </Typography>
            </Box>
            
            {expandedWidgets.earnings && (
              <>
                <Typography variant="h3" sx={{ 
                  fontSize: "38px", 
                  fontWeight: "bold", 
                  marginBottom: "10px" ,
                  color: "white"
                }}>
                  $30,047
                  <Box component="span" sx={{ 
                    fontSize: "16px", 
                    marginLeft: "10px", 
                    color: "#B1D690" 
                  }}>
                    (+9.65%)
                  </Box>
                  <Box component="span" sx={{ 
                    fontSize: "16px", 
                    marginLeft: "10px", 
                    color: "#E94560" 
                  }}>
                    (-2.35%)
                  </Box>
                </Typography>
                
                <Box sx={{ 
                  display: "flex", 
                  gap: "20px", 
                  marginBottom: "20px",
                  marginTop:"20px"
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px", }}>
                    <Box sx={{ 
                      width: "15px", 
                      height: "15px", 
                      borderRadius: "3px", 
                      backgroundColor: "#F8820B" 
                    }}></Box>
                    <Typography sx={{ fontSize: "14px", color: "white" }}>Ingresos Actual</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ 
                      width: "15px", 
                      height: "15px", 
                      borderRadius: "3px", 
                      backgroundColor: "#B1D690" 
                    }}></Box>
                    <Typography sx={{ fontSize: "14px", color: "white"}}>Incremento</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ 
                      width: "15px", 
                      height: "15px", 
                      borderRadius: "3px", 
                      backgroundColor: "#E94560" 
                    }}></Box>
                    <Typography sx={{ fontSize: "14px" , color: "white" }}>Decremento</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={0} barSize={30}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false}   tick={{fill: '#ffff', fontWeight:"bold"}} />
                      <YAxis tickFormatter={(tick) => `${tick}k`} axisLine={false} tickLine={false} tick={{fill: '#ffff', fontWeight:"bold"}}/>
                      <Bar dataKey="income" stackId="a" fill="#F8820B" />
                      <Bar dataKey="increase" stackId="a" fill="#B1D690" />
                      <Bar dataKey="decrease" stackId="b" fill="#E94560" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}
          </Paper>

          {/* Widget de productos más vendidos con tabla */}
          <Paper sx={{ 
            backgroundColor: "#45474B", 
            borderRadius: "10px", 
            padding: "20px" 
          }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px" 
            }}>
              <Typography sx={{ 
                color: "#F8820B", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Top de los productos mas vendidos
              </Typography>
            </Box>
            
            {expandedWidgets.topProducts && (
              <TableContainer component={Box} sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px", fontWeight: "bold",  }}>ID</TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px", fontWeight: "bold", }}>Nombre del Producto</TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px", fontWeight: "bold",}}>Cantidad Vendida</TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px", fontWeight: "bold", }}>Ganancia Obtenida</TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px", fontWeight: "bold",}}>Porcentaje</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>{product.id}</TableCell>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>{product.name}</TableCell>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>{product.quantity}</TableCell>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>{product.earnings}</TableCell>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #F8820B", padding: "15px 10px" }}>
                          <Box sx={{ 
                            backgroundColor: "#F8820B", 
                            color: "black",
                            fontWeight: "bold",
                            padding: "5px 10px", 
                            borderRadius: "20px", 
                            display: "inline-block",
                            fontSize: "14px"
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
          {/* Widget de productos vendidos */}
          <Paper sx={{ 
            backgroundColor: "#45474B", 
            borderRadius: "10px", 
            padding: "20px",
            marginBottom: "20px"
          }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px" 
            }}>
              <Typography sx={{ 
                color: "#F8820B", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Productos Vendidos
              </Typography>
            </Box>
            
            {expandedWidgets.products && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px", color:"white" }}>
                  3000
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "5px",
                  fontSize: "16px"
                }}>
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px", fontWeight: "bold",}}>
                    +9.65%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px" , color:"white"}}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Widget de membresias vendidas */}
          <Paper sx={{ 
            backgroundColor: "#45474B", 
            borderRadius: "10px", 
            padding: "20px",
            marginBottom: "20px"
          }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px" 
            }}>
              <Typography sx={{ 
                color: "#F8820B", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Membrecías Vendidas
              </Typography>
            </Box>
            
            {expandedWidgets.memberships && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px", color:"white" }}>
                  500
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "5px",
                  fontSize: "16px"
                }}>
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px", fontWeight: "bold",}}>
                    +10.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px", color:"white" }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Widget de nuevos clientes */}
          <Paper sx={{ 
            backgroundColor: "#45474B", 
            borderRadius: "10px", 
            padding: "20px",
            marginBottom: "20px"
          }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px" 
            }}>
              <Typography sx={{ 
                color: "#F8820B", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Nuevos clientes
              </Typography>
            </Box>
            
            {expandedWidgets.newClients && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px", color:"white" }}>
                  234
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "5px",
                  fontSize: "16px"
                }}>
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px", fontWeight: "bold",}}>
                    +2.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px", color:"white" }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Widget de gastos totales */}
          <Paper sx={{ 
            backgroundColor: "#45474B", 
            borderRadius: "10px", 
            padding: "20px"
          }}>
            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "20px" 
            }}>
              <Typography sx={{ 
                color: "#F8820B", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Gastos totales
              </Typography>
    
            </Box>
            
            {expandedWidgets.expenses && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px", color:"white" }}>
                  $15000
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "5px",
                  fontSize: "16px"
                }}>
                  <Typography component="span" sx={{ color: "#E94560", fontSize: "16px", fontWeight: "bold",}}>
                    -7.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px", color:"white" }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Revenue;