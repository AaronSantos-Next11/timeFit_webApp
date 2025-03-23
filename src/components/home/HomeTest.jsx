import React from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Home () {
   return (
      <div >
         <h1 style={{ color: '#FFFFFF' }}>Menu de la aplicacion (inicio)</h1>

         <Grid container spacing={2} marginTop={2} px={-2}>

            {/* Lado izquierdo: Inventario */}
            <Grid size={{xs:12, md:3}} >
               <Card sx={{ backgroundColor: '#45474B', borderRadius: 4, height: '100%', boxShadow: 3 }}>
               <CardContent>
                  <Typography variant="body1" color="#FFFFFF">Inventario</Typography>
                  <Typography variant="body2" color="#B0B0B0">
                     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                  </Typography>
               </CardContent>
               </Card>
            </Grid>

            {/* Parte superior derecha: Usuarios, Colaboradores, Membresías */}
            <Grid size={{xs:12, md: 8}} container spacing={2}>
               
               <Grid size={{xs:4}}>
               <Card sx={{ backgroundColor: '#45474B', borderRadius: 4, height: '100%', boxShadow: 3 }}>
                  <CardContent>
                     <Typography variant="body1" color="#FFFFFF">Cantidad de usuarios</Typography>
                     <Typography variant="h2" textAlign="center" color="#FFFFFF">
                     45
                     </Typography>
                  </CardContent>
               </Card>
               </Grid>

               <Grid size={{xs:4}}>
               <Card sx={{ backgroundColor: '#45474B', borderRadius: 4, height: '100%', boxShadow: 3 }}>
                  <CardContent>
                     <Typography variant="body1" color="#FFFFFF">Winget Colaboradores</Typography>
                     <Typography variant="h2" textAlign="center" color="#FFFFFF">
                     15
                     </Typography>
                  </CardContent>
               </Card>
               </Grid>

               <Grid size={{xs:4}}>
               <Card sx={{ backgroundColor: '#45474B', borderRadius: 4, height: '100%', boxShadow: 3 }}>
                  <CardContent>
                     <Typography variant="body1" color="#FFFFFF">Membresías vendidas</Typography>
                     <Typography variant="h2" textAlign="center" color="#FFFFFF">
                     4,000
                     </Typography>
                  </CardContent>
               </Card>
               </Grid>

               {/* Edades de los usuarios y Calendario */}
               <Grid size={{xs:7}}>
               <Card sx={{ backgroundColor: '#45474B', borderRadius: 4, height: '14rem', boxShadow: 3 }}>
                  <CardContent>
                     <Typography variant="body1" color="#FFFFFF">Edades de los usuarios</Typography>
                     <Typography variant="body2" color="#B0B0B0">
                     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                     </Typography>
                  </CardContent>
               </Card>
               </Grid>

               <Grid size={{xs:5}}  height={7} zIndex={1}>
               <Card sx={{ backgroundColor: '#45474B', borderRadius: 4, height: '27rem', boxShadow: 3 }}>
                  <CardContent>
                     <Typography variant="body1" color="#FFFFFF">Winget Calendario</Typography>
                     <Typography variant="body2" color="#B0B0B0">
                     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                     </Typography>
                  </CardContent>
               </Card>
               </Grid>
               
            </Grid>

            {/* Notas y Ventas Obtenidas */}
            <Grid size={{xs:12}} container spacing={2}>

               <Grid size={{xs:3.7}} >
               <Card sx={{ backgroundColor: '#45474B', borderRadius: 4, height: '12rem', boxShadow: 3 }}>
                  <CardContent>
                     <Typography variant="body1" color="#FFFFFF">Winget Notas</Typography>
                     <Typography variant="body2" color="#B0B0B0">
                     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                     </Typography>
                  </CardContent>
               </Card>
               </Grid>

               <Grid size={{xs:3.97}}>
               <Card sx={{ backgroundColor: '#45474B', borderRadius: 4, height: '12rem', boxShadow: 3 }}>
                  <CardContent>
                     <Typography variant="body1" color="#FFFFFF">Ventas obtenidas</Typography>
                     <Typography variant="body2" color="#B0B0B0">
                     "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                     </Typography>
                  </CardContent>
               </Card>
               </Grid>

            </Grid>

         </Grid>
      </div>
   );
}
