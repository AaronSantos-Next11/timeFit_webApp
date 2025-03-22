import React from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography'
import { fontGrid } from '@mui/material/styles/cssUtils';
// import { Row } from 'antd';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';

fontGrid

export default function Home() {

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
                  <Typography sx={{ mb:2 }} variant="body1" color="#FFFFFF">Inventario</Typography>

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
                      width: '35%'
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
              <Grid container size={8} spacing={2} display='flex' flexDirection='column' >

                {/* Sub-contenedor-2, #2: de la columna usuarios, edades y ventas obtenidas */}
                <Grid display='flex' gap={2} >
                  
                  <Grid size={{lg: 4 }} sx={{height: '8.5rem'}} > {/* Winget Cantidad de Usuarios */}
                    <Card style={{background:'#45474B', borderRadius: 30 }} sx={{height: '100%'}} >
                      <CardContent sx={{padding: 3 }}>
                      <Typography variant="body1" color="#FFFFFF">Cantidad de usuarios</Typography>
                      <Typography variant="h2" textAlign={'center'} color="initial">
                        <p>
                          45
                        </p>
                      </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid size={{lg: 4}} sx={{height: '8.5rem'}}> {/* Winget Colaboradores */}
                    <Card style={{background:'#45474B', borderRadius: 30}} sx={{height: '100%'}} >
                      <CardContent>
                      <Typography variant="body1" color="#FFFFFF">Winget Colaboradores</Typography>
                      <Typography variant="h2" textAlign='center' color="initial">
                        <p>
                          15
                        </p>
                      </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid size={{lg: 4}}> {/* Winget Membs vendidas */}
                    <Card style={{background:'#45474B', borderRadius: 30}} sx={{height:'100%'}} >
                      <CardContent>
                        <Typography variant="body1" color="#FFFFFF">Membresias vendidas</Typography>
                        <Typography variant="h2" textAlign='center' color="initial">
                          <p>
                            4,000
                          </p>
                      </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                </Grid>
                  
                <Grid size={{xs: 5, md: 7, lg: 7}} sx={{height: '13.5rem'}} > {/* Winget Edades de los usuarios*/}
                  <Card style={{background:'#45474B', borderRadius: 30 }} sx={{height: '100%'}}>
                    <CardContent>
                    <Typography variant="body1" color="#FFFFFF">Edades de los usuarios</Typography>
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


            {/* Sub-contenedor 2, #1: Notas, Ventas Obtenidas */}
            <Grid container size={'auto'} spacing={2} display='flex' flexDirection='row'>

              <Grid size={{ lg: 3.6}} sx={{height: '16rem'}}> {/* Winget Notas */}
                <Card style={{background:'#45474B', borderRadius: 30}} sx={{height: '100%', width:'100%'}}>
                  <CardContent sx={{padding: 3 }} >
                  <Typography variant="body1" color="#FFFFFF">Winget Notas</Typography>
                  <Typography variant="p" color="initial">
                    <p>
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{xs: 2, md: 2.6, lg: 3.6}} sx={{height: '16rem'}}> {/* Winget Ventas obtenidas */}
                <Card style={{background:'#45474B', borderRadius: 30 }} sx={{height:'100%'}} >
                  <CardContent sx={{padding: 3 }} >
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

        {/* /*
            ! SIGUE USANDO EL GRID ANIDADO, UNA COLUMNA DENTRO DE OTRA Y TODO DENTRO DE UN CONTENEDOR PRINCIPAL
          */}

          <Grid size={{xs: 3, md: 4}}> {/* Winget Calendario */}
            <Card style={{background:'#45474B'}}>
              <CardContent>
              <Typography variant="body1" color="#FFFFFF">Winget Calendario</Typography>

              </CardContent>
            </Card>
          </Grid>

      </Grid>

    </div>
  )
}