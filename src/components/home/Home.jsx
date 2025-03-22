import React from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography'

export default function Home () {
  return (
    <div >
        <h1> Menu de la aplicacion (inicio) </h1>

        {/* Contenedor 1: Todos los wingets de home */}
        <Grid container marginTop={2} display='flex' flexDirection='row'>

          {/* Sub-Contenedor 1: Lado izquierdo, columna Inventario y Notas */}
          <Grid container size={12} spacing={2}  display='flex' flexDirection='column' justifyContent='center' >

            <Grid container size={12} spacing={2} display='flex' flexDirection='row'>
              
              <Grid size={{ lg: 3}} sx={{height: '23rem'}}> {/* Winget inventario */}
                <Card style={{background:'#45474B', borderRadius: 30 }} sx={{height: '100%'}} >
                  <CardContent sx={{padding: 3,}} >
                    <Typography variant="body1" color="#FFFFFF">Inventario</Typography>

                    <Typography variant="p" color="initial">                 
                      <p>
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                      </p>
                    </Typography>

                  </CardContent>
                </Card>
              </Grid>

              {/* Contenedor de la columna Usuarios, Colaboradores y Membresias vendidas */}
              <Grid container size={{md:9}} spacing={2} display='flex' flexDirection='column' >

                {/* Sub-contenedor-2, #2: de la columna usuarios, edades y ventas obtenidas */}
                <Grid display='flex' gap={2} >
                  
                  <Grid size={{lg: 5 }} sx={{height: '8.5rem'}} > {/* Winget Cantidad de Usuarios */}
                    <Card style={{background:'#45474B', borderRadius: 30, padding:0 }} sx={{height: '100%'}} >
                      <CardContent >
                      <Typography variant="body1" color="#FFFFFF">Cantidad de usuarios</Typography>
                      <Typography variant="h2" textAlign={'center'} color="initial">
                        <p>
                          45
                        </p>
                      </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid size={{lg: 5}} sx={{height: '8.5rem'}}> {/* Winget Colaboradores */}
                    <Card style={{background:'#45474B', borderRadius: 30}} sx={{height: '100%'}} >
                      <CardContent >
                      <Typography variant="body1" color="#FFFFFF">Winget Colaboradores</Typography>
                      <Typography variant="h2" textAlign='center' color="initial">
                        <p>
                          15
                        </p>
                      </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid size={{xs: 5}} sx={{height: '8.5rem'}}> {/* Winget Membs vendidas */}
                    <Card style={{background:'#45474B', borderRadius: 30}} sx={{height:'100%'}} >
                      <CardContent >
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

                <Grid container spacing={2}>

                  <Grid size={{ md: 6.7}} sx={{height: '13.5rem'}} > {/* Winget Edades de los usuarios*/}
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

                  <Grid size={{md: 5.3}} height={2} zIndex={1}> {/* Winget Calendario */}
                    <Card style={{background:'#45474B',  height: '30.5rem',  borderRadius: 30}}>
                      <CardContent>
                      <Typography variant="body1" color="#FFFFFF">Winget Calendario</Typography>
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


            {/* Sub-contenedor 2, #1: Notas, Ventas Obtenidas */}
            <Grid container size={8} display='flex' flexDirection='row'>

              <Grid display='flex' gap={2} >

                <Grid size={{ md: 'grow'}} sx={{height: '16rem'}}> {/* Winget Notas */}
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

                <Grid size={{ md: 'grow'}} sx={{height: '16rem'}}> {/* Winget Ventas obtenidas */}
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

          </Grid>

          {/* /*
            ! SIGUE USANDO EL GRID ANIDADO, UNA COLUMNA DENTRO DE OTRA Y TODO DENTRO DE UN CONTENEDOR PRINCIPAL
          */}




        </Grid>

    </div>
  )
}