import React from 'react';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography'
import { fontGrid } from '@mui/material/styles/cssUtils';
// import { Row } from 'antd';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Menu, MenuItem, IconButton } from '@mui/material';

// Icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PieChartIcon from '@mui/icons-material/PieChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Para las graficas
import { PieChart } from '@mui/x-charts/PieChart';

// Para el calendario
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Paper } from '@mui/material';


fontGrid

export default function Home() {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Manejadores para el menú
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const data = [
    { id: 1, productos: 'Pesas rusas', stock: 10, precioTotal: '$500.00' },
    { id: 2, productos: 'Mancuernas', stock: 13, precioTotal: '$700.50' },
    { id: 3, productos: 'Barras 3/4', stock: 5, precioTotal: '$250.00' },
    { id: 4, productos: 'Disco de peso', stock: 10, precioTotal: '$950.70' },
    { id: 5, productos: 'Colchonetas', stock: 4, precioTotal: '$500.00' },
    { id: 6, productos: 'Bandas', stock: 5, precioTotal: '$250.00' },
    { id: 7, productos: 'Cuerdas', stock: 10, precioTotal: '$450.00' },
    { id: 8, productos: 'Pesas', stock: 4, precioTotal: '$350.00' },
    { id: 9, productos: 'Pelotas de yoga', stock: 6, precioTotal: '$600.00' },
    { id: 10, productos: 'Suplementos/p', stock: 5, precioTotal: '$425.00' },
  ];


  const edades = [
    { id: 0, value: 26.9, label: '14 - 17 años', color: '#FF6384' }, // Rojo
    { id: 1, value: 7.7, label: '18 - 25 años', color: '#36A2EB' }, // Azul
    { id: 2, value: 11.5, label: '26 - 35 años', color: '#FFCE56' }, // Amarillo
    { id: 3, value: 26.9, label: '36 - 45 años', color: '#4BC0C0' }, // Turquesa
    { id: 4, value: 15.4, label: '46 - 55 años', color: '#9966FF' }, // Morado
    { id: 5, value: 7.7, label: '56 - 65 años', color: '#FF9F40' }, // Naranja
    { id: 6, value: 3.8, label: 'Más de 65 años', color: '#C9CBCF' }, // Gris
  ];



  return (
    <div >
      <h1> Menu de la aplicacion (inicio) </h1>

      {/* Contenedor 1: Todos los wingets de home */}
      <Grid container marginTop={2} display='flex' flexDirection='row'>

        {/* Sub-Contenedor 1: Lado izquierdo, columna Inventario y Notas */}
        <Grid container size={12} spacing={2} display='flex' flexDirection='column' justifyContent='center' >

          <Grid container size={12} spacing={2} display='flex' flexDirection='row'>

            <Grid size={{ lg: 3 }} sx={{ height: '23rem' }}> {/* Winget inventario */}
              <Card style={{ background: '#45474B', borderRadius: 30 }} sx={{ height: '100%' }} >
                <CardContent sx={{ padding: 3, }} >
                  <Box display="flex" alignItems="center">
                    <AssignmentIcon sx={{ fontSize: 40, color: '#FFFFFF', marginRight: 1 }} />
                    <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="#FFFFFF">Inventario</Typography>

                    <div style={{ marginLeft: 'auto' }}>
                      <IconButton
                        aria-label="más opciones"
                        aria-controls={open ? 'menu-opciones' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{
                          backgroundColor: '#FF8C00',
                          borderRadius: '15px',
                          width: '40px',
                          height: '24px',
                          padding: 0,
                          minWidth: '40px',
                          '&:hover': {
                            backgroundColor: '#e67e00',
                          }
                        }}
                      >
                        <KeyboardArrowDownIcon sx={{ color: 'black', fontSize: '20px' }} />
                      </IconButton>
                      <Menu
                        id="menu-opciones"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'boton-menu',
                          sx: {
                            padding: 0,
                          }
                        }}
                        PaperProps={{
                          sx: {
                            backgroundColor: '#f8820b',
                            color: 'Black',
                            borderRadius: '20px',
                          }
                        }}
                      >
                        <MenuItem sx={{
                          justifyContent: 'center',
                          textAlign: 'center', '&:hover': {
                            backgroundColor: '#272829',
                            color: '#f8820b'
                          },
                        }} onClick={handleClose}>Hoy</MenuItem>
                        <MenuItem sx={{
                          justifyContent: 'center',
                          textAlign: 'center', '&:hover': {
                            backgroundColor: '#272829',
                            color: '#f8820b'
                          },
                        }} onClick={handleClose}>Esta Semana</MenuItem>
                        <MenuItem sx={{
                          justifyContent: 'center',
                          textAlign: 'center', '&:hover': {
                            backgroundColor: '#272829',
                            color: '#f8820b'
                          },
                        }} onClick={handleClose}>Este Mes</MenuItem>
                        <MenuItem sx={{
                          justifyContent: 'center',
                          textAlign: 'center', '&:hover': {
                            backgroundColor: '#272829',
                            color: '#f8820b'
                          },
                        }} onClick={handleClose}>Este Año</MenuItem>
                      </Menu>
                    </div>
                  </Box>

                  <TableContainer>
                    <Table size="small" sx={{ width: '100%' }} aria-label="tabla de inventario">
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontSize: '0.875rem',
                              padding: '8px 4px',
                              borderBottom: '5px solid #f8820b',
                              color: 'white',
                              width: '10%'
                            }}
                          >
                            No
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: '0.875rem',
                              padding: '8px 4px',
                              borderBottom: '5px solid #f8820b',
                              color: 'white',
                              width: '40%'
                            }}
                          >
                            Productos
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: '0.875rem',
                              padding: '8px 4px',
                              borderBottom: '5px solid #f8820b',
                              color: 'white',
                              width: '15%'
                            }}
                          >
                            Stock
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: '0.875rem',
                              padding: '8px 4px',
                              borderBottom: '5px solid #f8820b',
                              color: 'white',
                              width: '35%',
                              textAlign: 'center'
                            }}
                          >
                            Precio Total
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell
                              sx={{
                                borderBottomStyle: 'none',
                                padding: '6px 4px',
                                color: 'white',
                                fontSize: '0.875rem'
                              }}
                              align='center'
                            >
                              {row.id}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottomStyle: 'none',
                                padding: '6px 4px',
                                color: 'white',
                                fontSize: '0.875rem'
                              }}
                            >
                              {row.productos}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottomStyle: 'none',
                                padding: '6px 4px',
                                color: 'white',
                                fontSize: '0.875rem'
                              }}
                              align="center"
                            >
                              {row.stock}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderBottomStyle: 'none',
                                padding: '6px 4px',
                                color: 'white',
                                fontSize: '0.875rem',

                              }}
                            >
                              {row.precioTotal}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </CardContent>
              </Card>
            </Grid>

            {/* Contenedor de la columna Usuarios, Colaboradores y Membresias vendidas */}
            <Grid container size={{ md: 9 }} spacing={2} display='flex' flexDirection='column' >

              {/* Sub-contenedor-2, #2: de la columna usuarios, edades y ventas obtenidas */}
              <Grid display='flex' gap={2} >

                <Grid size={{ lg: 5 }} sx={{ height: '8.5rem' }} > {/* Winget Cantidad de Usuarios */}
                  <Card style={{ background: '#45474B', borderRadius: 30, padding: 0 }} sx={{ height: '100%' }} >
                    <CardContent >
                      <Box display="flex" alignItems="center">
                        <GroupsIcon sx={{ fontSize: 40, color: '#FFFFFF', marginRight: 1 }} />
                        <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="#FFFFFF">Cantidad Usuarios</Typography>

                        <div style={{ marginLeft: 'auto' }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={open ? 'menu-opciones' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{
                              backgroundColor: '#FF8C00',
                              borderRadius: '15px',
                              width: '40px',
                              height: '24px',
                              padding: 0,
                              minWidth: '40px',
                              '&:hover': {
                                backgroundColor: '#e67e00',
                              }
                            }}
                          >
                            <KeyboardArrowDownIcon sx={{ color: 'black', fontSize: '20px' }} />
                          </IconButton>
                          <Menu
                            id="menu-opciones"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              'aria-labelledby': 'boton-menu',
                              sx: {
                                padding: 0,
                              }
                            }}
                            PaperProps={{
                              sx: {
                                backgroundColor: '#f8820b',
                                color: 'Black',
                                borderRadius: '20px',
                              }
                            }}
                          >
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Hoy</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Esta Semana</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Mes</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Año</MenuItem>
                          </Menu>
                        </div>
                      </Box>
                      <Typography variant="h2" textAlign={'center'} color="initial" sx={{ color: '#ffffff', fontWeight: 800 }}>
                        <p>
                          45
                        </p>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ lg: 5 }} sx={{ height: '8.5rem' }}> {/* Winget Colaboradores */}
                  <Card style={{ background: '#45474B', borderRadius: 30 }} sx={{ height: '100%' }} >
                    <CardContent >
                      <Box display="flex" alignItems="center">
                        <PersonIcon sx={{ fontSize: 40, color: '#FFFFFF', marginRight: 1 }} />
                        <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="#FFFFFF">Cantidad Colaboradores</Typography>

                        <div style={{ marginLeft: 'auto' }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={open ? 'menu-opciones' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{
                              backgroundColor: '#FF8C00',
                              borderRadius: '15px',
                              width: '40px',
                              height: '24px',
                              padding: 0,
                              minWidth: '40px',
                              '&:hover': {
                                backgroundColor: '#e67e00',
                              }
                            }}
                          >
                            <KeyboardArrowDownIcon sx={{ color: 'black', fontSize: '20px' }} />
                          </IconButton>
                          <Menu
                            id="menu-opciones"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              'aria-labelledby': 'boton-menu',
                              sx: {
                                padding: 0,
                              }
                            }}
                            PaperProps={{
                              sx: {
                                backgroundColor: '#f8820b',
                                color: 'Black',
                                borderRadius: '20px',
                              }
                            }}
                          >
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Hoy</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Esta Semana</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Mes</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Año</MenuItem>
                          </Menu>
                        </div>
                      </Box>
                      <Typography variant="h2" textAlign='center' color="initial" sx={{ color: '#ffffff', fontWeight: 800 }}>
                        <p>
                          15
                        </p>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 5 }} sx={{ height: '8.5rem' }}> {/* Winget Membs vendidas */}
                  <Card style={{ background: '#45474B', borderRadius: 30 }} sx={{ height: '100%' }} >
                    <CardContent >
                      <Box display="flex" alignItems="center">
                        <BadgeIcon sx={{ fontSize: 40, color: '#FFFFFF', marginRight: 1 }} />
                        <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="#FFFFFF">Membresias Vendidas</Typography>

                        <div style={{ marginLeft: 'auto' }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={open ? 'menu-opciones' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{
                              backgroundColor: '#FF8C00',
                              borderRadius: '15px',
                              width: '40px',
                              height: '24px',
                              padding: 0,
                              minWidth: '40px',
                              '&:hover': {
                                backgroundColor: '#e67e00',
                              }
                            }}
                          >
                            <KeyboardArrowDownIcon sx={{ color: 'black', fontSize: '20px' }} />
                          </IconButton>
                          <Menu
                            id="menu-opciones"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              'aria-labelledby': 'boton-menu',
                              sx: {
                                padding: 0,
                              }
                            }}
                            PaperProps={{
                              sx: {
                                backgroundColor: '#f8820b',
                                color: 'Black',
                                borderRadius: '20px',
                              }
                            }}
                          >
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Hoy</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Esta Semana</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Mes</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Año</MenuItem>
                          </Menu>
                        </div>
                      </Box>
                      <Typography variant="h2" textAlign='center' color="initial" sx={{ color: '#ffffff', fontWeight: 800 }}>
                        <p>
                          4,000
                        </p>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>

              <Grid container spacing={2}>

                <Grid size={{ md: 6.7 }} sx={{ height: '13.5rem' }} > {/* Winget Edades de los usuarios*/}
                  <Card style={{ background: '#45474B', borderRadius: 30 }} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <PieChartIcon sx={{ fontSize: 40, color: '#FFFFFF', marginRight: 1 }} />
                        <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="#FFFFFF">Edades de los usuarios</Typography>

                        <div style={{ marginLeft: 'auto' }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={open ? 'menu-opciones' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{
                              backgroundColor: '#FF8C00',
                              borderRadius: '15px',
                              width: '40px',
                              height: '24px',
                              padding: 0,
                              minWidth: '40px',
                              '&:hover': {
                                backgroundColor: '#e67e00',
                              }
                            }}
                          >
                            <KeyboardArrowDownIcon sx={{ color: 'black', fontSize: '20px' }} />
                          </IconButton>
                          <Menu
                            id="menu-opciones"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              'aria-labelledby': 'boton-menu',
                              sx: {
                                padding: 0,
                              }
                            }}
                            PaperProps={{
                              sx: {
                                backgroundColor: '#f8820b',
                                color: 'Black',
                                borderRadius: '20px',
                              }
                            }}
                          >
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Hoy</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Esta Semana</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Mes</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Año</MenuItem>
                          </Menu>
                        </div>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'center', height: '80%', alignItems: 'center' }}>
                        <PieChart
                          series={[
                            {
                              data: edades,
                              innerRadius: 20, // Radio interno para un gráfico de dona
                              outerRadius: 60, // Radio externo
                              paddingAngle: 3, // Espacio entre las secciones
                              cornerRadius: 3, // Bordes redondeados
                              highlightScope: { faded: 'global', highlighted: 'item' },
                              faded: { innerRadius: 20, additionalRadius: -20, color: 'gray' },
                              cx: 80, // Centrar el gráfico en el eje X
                              cy: 70, // Centrar el gráfico en el eje Y
                            },
                          ]}
                          width={300} // Ancho del gráfico
                          height={160} // Alto del gráfico}
                          slotProps={{

                            legend: {
                              position: { vertical: 'middle', horizontal: 'right' }, // Posición de la leyenda

                              labelStyle: {

                                fontSize: 10, // Tamaño de la fuente de las etiquetas
                              },
                              itemGap: 0, // Espacio entre los elementos de la leyenda
                            },
                          }} sx={{

                            "& .MuiChartsLegend-mark": {
                              width: "10px", // Tamaño más pequeño
                              height: "10px",
                            },
                            "& .MuiChartsLegend-root": {
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: "10px", // Ajusta el margen para que no quede pegado al gráfico
                              marginTop: "10px"
                            },
                          }}
                        />
                      </Box>

                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ md: 5.3 }} height={2} zIndex={1}> {/* Winget Calendario */}
                  <Card style={{ background: '#45474B', height: '30.5rem', borderRadius: 30 }}>
                    <CardContent sx={{ overflow: 'auto', maxHeight: '28rem', padding: 2, }}>
                      <Box display="flex" alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 40, color: '#FFFFFF', marginRight: 1 }} />
                        <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="#FFFFFF">Calendario</Typography>

                        <div style={{ marginLeft: 'auto' }}>
                          <IconButton
                            aria-label="más opciones"
                            aria-controls={open ? 'menu-opciones' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            sx={{
                              backgroundColor: '#FF8C00',
                              borderRadius: '15px',
                              width: '40px',
                              height: '24px',
                              padding: 0,
                              minWidth: '40px',
                              '&:hover': {
                                backgroundColor: '#e67e00',
                              }
                            }}
                          >
                            <KeyboardArrowDownIcon sx={{ color: 'black', fontSize: '20px' }} />
                          </IconButton>
                          <Menu
                            id="menu-opciones"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                              'aria-labelledby': 'boton-menu',
                              sx: {
                                padding: 0,
                              }
                            }}
                            PaperProps={{
                              sx: {
                                backgroundColor: '#f8820b',
                                color: 'Black',
                                borderRadius: '20px',
                              }
                            }}
                          >
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Hoy</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Esta Semana</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Mes</MenuItem>
                            <MenuItem sx={{
                              justifyContent: 'center',
                              textAlign: 'center', '&:hover': {
                                backgroundColor: '#272829',
                                color: '#f8820b'
                              },
                            }} onClick={handleClose}>Este Año</MenuItem>
                          </Menu>
                        </div>
                      </Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Paper
                          sx={{
                            padding: 1,
                            maxHeight: 300,
                            maxWidth: '100%',
                            margin: 'auto',
                            marginTop: 0,
                            background: 'transparent',
                            boxShadow: 'none', // Elimina la sombra del Paper
                            paddingBottom: 0
                          }}
                        >
                          <DateCalendar
                            sx={{
                              '& .MuiPickersCalendarHeader-root': {
                                justifyContent: 'center', // Centra el encabezado del calendario
                              },
                              '& .MuiPickersCalendarHeader-label': {
                                fontWeight: 'bold', // Hace que el mes y el año sean negritas
                                color: '#f8820b', // Color del mes y el año
                              },
                              '& .MuiPickersDay-root': {
                                color: '#fff', // Color de los días
                                fontWeight: 'bold', // Hace que los días sean negritas
                                '&:hover': {
                                  backgroundColor: '#e64a19', // Fondo naranja oscuro
                                },
                              },
                              '& .Mui-selected': {
                                backgroundColor: '#f8820b', // Fondo naranja para el día seleccionado
                                color: '#000', // Texto negro para el día seleccionado
                                '&:hover': {
                                  backgroundColor: '#e64a19', // Fondo naranja oscuro al pasar el mouse
                                },
                              },
                              '& .Mui-selected:focus, & .Mui-selected.Mui-focusVisible': {
                                backgroundColor: '#f8820b', // Fondo naranja para el día seleccionado
                                color: '#000', // Texto negro para el día seleccionado
                                '&:hover': {
                                  backgroundColor: '#e64a19', // Fondo naranja oscuro al pasar el mouse
                                },
                              },
                              '& .MuiPickersArrowSwitcher-button': {
                                color: '#f8820b', // Color de las flechas de navegación
                              },
                              '& .MuiSvgIcon-root': {
                                color: '#f8820b', // Color de las flechas de navegación
                                border: '2px solid #f8820b',
                                borderRadius: '50%',
                              },
                              '& .MuiDayCalendar-weekDayLabel': {
                                color: '#fff', // Color de los días de la semana
                                fontWeight: 'bold',
                              },
                            }}
                          />
                        </Paper>
                      </LocalizationProvider>
                      {/* Actividades Programadas */}
                      <Box sx={{ marginTop: 5, padding: 2, paddingBottom: 0 }}>
                        <Typography color="#FFFFFF" sx={{ fontWeight: 'bold', marginBottom: .5, fontSize: '13px' }}>
                          Actividades Programadas
                        </Typography>
                        <Typography color="#f8820b" sx={{ fontWeight: 'bold', marginBottom: 1, fontSize: '13px' }}>
                          Sabado, 22 de marzo de 2025
                        </Typography>

                        <Grid container display='flex' direction='row' sx={{ marginTop: 1 }}>
                          <Grid container direction="row" alignItems='center' size={{ xs: 12 }}>
                            <Grid size={{ xs: 3 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: '30px' }} color="#FFFFFF">
                                09:00
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              <Typography color='#f8820b' sx={{ fontSize: "50px", fontWeight: 800, textAlign: 'center' }}>|</Typography>
                            </Grid>
                            <Grid size={{ xs: 7 }}>
                              <Typography color='white' sx={{ fontSize: '12px', fontWeight: 'bold' }}>Reunion con equipo de ventas</Typography>
                              <Typography color='#f8820b' sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                                Ventas
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container direction="row" alignItems='center' size={{ xs: 12 }}>
                            <Grid size={{ xs: 3 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: '30px' }} color="#FFFFFF">
                                11:00
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              <Typography color='#f8820b' sx={{ fontSize: "50px", fontWeight: 800, textAlign: 'center' }}>|</Typography>
                            </Grid>
                            <Grid size={{ xs: 7 }}>
                              <Typography color='white' sx={{ fontSize: '12px', fontWeight: 'bold' }}>Revisión de retroalimentación</Typography>
                              <Typography color='#f8820b' sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                                Feedback
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container direction="row" alignItems='center' size={{ xs: 12 }}>
                            <Grid size={{ xs: 3 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: '30px' }} color="#FFFFFF">
                                14:00
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              <Typography color='#f8820b' sx={{ fontSize: "50px", fontWeight: 800, textAlign: 'center' }}>|</Typography>
                            </Grid>
                            <Grid size={{ xs: 7 }}>
                              <Typography color='white' sx={{ fontSize: '12px', fontWeight: 'bold' }}>Revisión de reportes mensuales</Typography>
                              <Typography color='#f8820b' sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                                Reportes
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container direction="row" alignItems='center' size={{ xs: 12 }}>
                            <Grid size={{ xs: 3 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: '30px' }} color="#FFFFFF">
                                17:30
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 2 }}>
                              <Typography color='#f8820b' sx={{ fontSize: "50px", fontWeight: 800, textAlign: 'center' }}>|</Typography>
                            </Grid>
                            <Grid size={{ xs: 7 }}>
                              <Typography color='white' sx={{ fontSize: '12px', fontWeight: 'bold' }}>Evaluación de desempeño de
                                Equipo.</Typography>
                              <Typography color='#f8820b' sx={{ fontSize: '13px', fontWeight: 'bold' }}>
                                Evaluación
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>


            </Grid>

          </Grid>


          {/* Sub-contenedor 2, #1: Notas, Ventas Obtenidas */}
          <Grid container size={8} display='flex' flexDirection='row'>

            <Grid display='flex' gap={2} >

              <Grid size={{ md: 'grow' }} sx={{ height: '16rem' }}> {/* Winget Notas */}
                <Card style={{ background: '#45474B', borderRadius: 30 }} sx={{ height: '100%', width: '100%' }}>
                  <CardContent sx={{ padding: 3 }} >
                    <Typography variant="body1" color="#FFFFFF">Winget Notas</Typography>
                    <Typography variant="p" color="initial">
                      <p>
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ md: 'grow' }} sx={{ height: '16rem' }}> {/* Winget Ventas obtenidas */}
                <Card style={{ background: '#45474B', borderRadius: 30 }} sx={{ height: '100%' }} >
                  <CardContent sx={{ padding: 3 }} >
                    <Typography variant="body1" color="#FFFFFF">Ventas obtenidas</Typography>
                    <Typography variant="p" color="initial">
                      <p>
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          </Grid>

        </Grid>

        {/* /*
            ! SIGUE USANDO EL GRID ANIDADO, UNA COLUMNA DENTRO DE OTRA Y TODO DENTRO DE UN CONTENEDOR PRINCIPAL
          */}




      </Grid>

    </div>
  )
}