// Revenue.jsx
import React, { useState } from 'react';
import { 
  Search, 
  Notifications, 
  Chat, 
  KeyboardArrowDown, 
  KeyboardArrowUp,

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
  InputBase,
  Avatar
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import './Revenue.css';

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

  // Función para mostrar/ocultar widgets
  const toggleWidget = (widget) => {
    setExpandedWidgets(prev => ({
      ...prev,
      [widget]: !prev[widget]
    }));
  };

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
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0px", marginBottom: "20px" }}>
        {/* Título y descripción */}
        <Grid item>
          <Typography variant="h4" sx={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
            Ingresos
          </Typography>
          <Typography variant="body2" sx={{ margin: 0, fontSize: "14px", color: "#ccc" }}>
            Esta sesión muestra las ganancias generadas por <hr/> servicios, productos y membresías del gimnasio.
          </Typography>
        </Grid>

        {/* Barra de búsqueda */}
        <Grid item>
          <Paper component="form" sx={{ 
            display: "flex", 
            alignItems: "center", 
            padding: "8px 15px", 
            borderRadius: "8px", 
            width: "455px", 
            height: "45px", 
            backgroundColor: "#fff"
          }}>
            <IconButton type="submit" sx={{ p: "8px" }} color="default">
              <Search sx={{ fontSize: "22px", color: "#777" }} />
            </IconButton>
            <InputBase 
              sx={{ ml: 1, flex: 1, fontSize: "16px", color: "#555" }} 
              placeholder="Buscar un servicio, membresía..." 
            />
          </Paper>
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
            <Typography sx={{ margin: 0, fontSize: "16px", color: "#F9A826", fontWeight: "bold" }}>
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
            backgroundColor: "#2A2A2E", 
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
                color: "#F9A826", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Ganancias Obtenidas
              </Typography>
              <IconButton 
                sx={{ 
                  backgroundColor: "#F9A826", 
                  color: "white", 
                  width: "30px", 
                  height: "30px", 
                  "&:hover": { backgroundColor: "#d88c19" } 
                }}
                onClick={() => toggleWidget('earnings')}
              >
                {expandedWidgets.earnings ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
            
            {expandedWidgets.earnings && (
              <>
                <Typography variant="h3" sx={{ 
                  fontSize: "38px", 
                  fontWeight: "bold", 
                  marginBottom: "10px" 
                }}>
                  $30,047
                  <Box component="span" sx={{ 
                    fontSize: "16px", 
                    marginLeft: "10px", 
                    color: "#65B741" 
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
                  marginBottom: "10px" 
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ 
                      width: "15px", 
                      height: "15px", 
                      borderRadius: "3px", 
                      backgroundColor: "#F9A826" 
                    }}></Box>
                    <Typography sx={{ fontSize: "14px" }}>Ingresos Actual</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ 
                      width: "15px", 
                      height: "15px", 
                      borderRadius: "3px", 
                      backgroundColor: "#65B741" 
                    }}></Box>
                    <Typography sx={{ fontSize: "14px" }}>Incremento</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Box sx={{ 
                      width: "15px", 
                      height: "15px", 
                      borderRadius: "3px", 
                      backgroundColor: "#E94560" 
                    }}></Box>
                    <Typography sx={{ fontSize: "14px" }}>Decremento</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ height: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={0} barSize={30}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(tick) => `${tick}k`} axisLine={false} tickLine={false} />
                      <Bar dataKey="income" stackId="a" fill="#F9A826" />
                      <Bar dataKey="increase" stackId="a" fill="#65B741" />
                      <Bar dataKey="decrease" stackId="b" fill="#E94560" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </>
            )}
          </Paper>

          {/* Widget de productos más vendidos con tabla */}
          <Paper sx={{ 
            backgroundColor: "#2A2A2E", 
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
                color: "#F9A826", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Top de los productos mas vendidos
              </Typography>
              <IconButton 
                sx={{ 
                  backgroundColor: "#F9A826", 
                  color: "white", 
                  width: "30px", 
                  height: "30px", 
                  "&:hover": { backgroundColor: "#d88c19" } 
                }}
                onClick={() => toggleWidget('topProducts')}
              >
                {expandedWidgets.topProducts ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
            
            {expandedWidgets.topProducts && (
              <TableContainer component={Box} sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>ID</TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>Nombre del Producto</TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>Cantidad Vendida</TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>Ganancia Obtenida</TableCell>
                      <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>Porcentaje</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>{product.id}</TableCell>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>{product.name}</TableCell>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>{product.quantity}</TableCell>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>{product.earnings}</TableCell>
                        <TableCell sx={{ color: "#fff", borderBottom: "1px solid #464648", padding: "15px 10px" }}>
                          <Box sx={{ 
                            backgroundColor: "#F9A826", 
                            color: "white", 
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
            backgroundColor: "#2A2A2E", 
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
                color: "#F9A826", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Productos Vendidos
              </Typography>
              <IconButton 
                sx={{ 
                  backgroundColor: "#F9A826", 
                  color: "white", 
                  width: "30px", 
                  height: "30px", 
                  "&:hover": { backgroundColor: "#d88c19" } 
                }}
                onClick={() => toggleWidget('products')}
              >
                {expandedWidgets.products ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
            
            {expandedWidgets.products && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>
                  3000
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "5px",
                  fontSize: "16px"
                }}>
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px" }}>
                    +9.65%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px" }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Widget de membresias vendidas */}
          <Paper sx={{ 
            backgroundColor: "#2A2A2E", 
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
                color: "#F9A826", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Membrecías Vendidas
              </Typography>
              <IconButton 
                sx={{ 
                  backgroundColor: "#F9A826", 
                  color: "white", 
                  width: "30px", 
                  height: "30px", 
                  "&:hover": { backgroundColor: "#d88c19" } 
                }}
                onClick={() => toggleWidget('memberships')}
              >
                {expandedWidgets.memberships ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
            
            {expandedWidgets.memberships && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>
                  500
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "5px",
                  fontSize: "16px"
                }}>
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px" }}>
                    +10.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px" }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Widget de nuevos clientes */}
          <Paper sx={{ 
            backgroundColor: "#2A2A2E", 
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
                color: "#F9A826", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Nuevos clientes
              </Typography>
              <IconButton 
                sx={{ 
                  backgroundColor: "#F9A826", 
                  color: "white", 
                  width: "30px", 
                  height: "30px", 
                  "&:hover": { backgroundColor: "#d88c19" } 
                }}
                onClick={() => toggleWidget('newClients')}
              >
                {expandedWidgets.newClients ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
            
            {expandedWidgets.newClients && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>
                  234
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "5px",
                  fontSize: "16px"
                }}>
                  <Typography component="span" sx={{ color: "#65B741", fontSize: "16px" }}>
                    +2.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px" }}>
                    respecto al semana anterior
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Widget de gastos totales */}
          <Paper sx={{ 
            backgroundColor: "#2A2A2E", 
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
                color: "#F9A826", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                Gastos totales
              </Typography>
              <IconButton 
                sx={{ 
                  backgroundColor: "#F9A826", 
                  color: "white", 
                  width: "30px", 
                  height: "30px", 
                  "&:hover": { backgroundColor: "#d88c19" } 
                }}
                onClick={() => toggleWidget('expenses')}
              >
                {expandedWidgets.expenses ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            </Box>
            
            {expandedWidgets.expenses && (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>
                  $15000
                </Typography>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  gap: "5px",
                  fontSize: "16px"
                }}>
                  <Typography component="span" sx={{ color: "#E94560", fontSize: "16px" }}>
                    -7.6%
                  </Typography>
                  <Typography component="span" sx={{ fontSize: "16px" }}>
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