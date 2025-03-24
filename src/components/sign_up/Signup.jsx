import React from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import imagen from '../../assets/TipoSonrieLogin.jpg';
import timefitLogo from "../../assets/timefit.svg";

export default function MyComponent() {
  const theme = useTheme();
  const textFieldStyle = {
    backgroundColor: 'white',
    borderRadius: '5px'
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Contenedor del formulario */}
      <div
        style={{
          flex: '0 0 50%', // Ocupa el 50% del ancho en pantallas grandes
          maxWidth: '600px', // Ajusta este valor según lo necesites
          padding: '50px',
          backgroundColor: theme.palette.secondary.main,
          boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
          overflowY: 'auto', // Permite el desplazamiento vertical
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <img src={timefitLogo} alt="Time Fit Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
          <h3 style={{ fontWeight: 'bold' }}>Time Fit / Admin</h3>
        </header>

        {/* Botón de regreso a la página */}
        <div
          style={{
            position: 'fixed', // Fijo para que esté siempre en la parte superior derecha
            top: 0,
            right: 0, // Posicionado a la derecha
            padding: '10px', // Espaciado opcional
            zIndex: 1, // Asegura que el botón esté por encima del contenido
          }}
        >
          <button
            style={{
              background: theme.palette.primary.main, // Fondo del color del tema
              border: 'none', // Sin borde
              color: 'white', // Color del texto blanco
              cursor: 'pointer', // Cambia el cursor al pasar sobre el botón
              fontSize: '16px', // Tamaño de fuente opcional
              padding: '5px 10px', // Espaciado interno del botón
              borderRadius: '4px', // Bordes redondeados opcionales
            }}
            onClick={() => (window.location.href = "https://landing-page-time-fit.vercel.app/")}
          >
            ← Regresar a la página web
          </button>
        </div>

        <Typography variant="h2" sx={{ fontWeight: 'bold', marginBottom: 2 }} color={theme.palette.primary.main}>
          Regístrate
        </Typography>
        <Typography variant="subtitle1" color={theme.palette.primary.main} sx={{ marginBottom: 2 }}>
          ¿Ya tienes una cuenta? <a href="#">Inicie sesión aquí</a>
        </Typography>

        <form>
          <Typography variant="subtitle1" color={theme.palette.primary.main}>
            Elija un nombre de usuario
          </Typography>
          <TextField label="Escriba aquí su nombre de usuario" variant="outlined" fullWidth margin="dense" sx={textFieldStyle} />

          {/* Dos entradas de datos en una misma fila */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <Typography variant="subtitle1" color={theme.palette.primary.main}>
                Nombre(s)
              </Typography>
              <TextField label="Escriba aquí su nombre" variant="outlined" fullWidth margin="dense" sx={textFieldStyle} />
            </div>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <Typography variant="subtitle1" color={theme.palette.primary.main}>
                Apellidos
              </Typography>
              <TextField label="Escriba aquí sus apellidos" variant="outlined" fullWidth margin="dense" sx={textFieldStyle} />
            </div>
          </div>

          <Typography variant="subtitle1" color={theme.palette.primary.main}>
            Correo electrónico
          </Typography>
          <TextField label="Escriba aquí su correo electrónico" variant="outlined" fullWidth margin="dense" sx={textFieldStyle} />

          <Typography variant="subtitle1" color={theme.palette.primary.main}>
            Elija una contraseña
          </Typography>
          <TextField label="Escriba aquí su contraseña" type="password" variant="outlined" fullWidth margin="dense" sx={textFieldStyle} />

          <Typography variant="subtitle1" color={theme.palette.primary.main}>
            Confirmar contraseña
          </Typography>
          <TextField label="Escriba nuevamente su contraseña" type="password" variant="outlined" fullWidth           margin="dense" sx={textFieldStyle} />

          {/* Aceptación de términos */}
<div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
  <input type="checkbox" id="terms" style={{ marginRight: '8px', accentColor: theme.palette.primary.main }} />
  <Typography variant="body2" color={theme.palette.primary.main}>
    Acepto los <a href="/Condiction" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>Términos y Condiciones</a>
  </Typography>
</div>

{/* Botón principal de registro */}
<Button
  variant="contained"
  sx={{
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    '&:hover': { backgroundColor: theme.palette.primary.dark },
    marginTop: '20px',
    padding: '12px',
    fontSize: '16px',
  }}
  type="submit"
  fullWidth
>
  Registrarse
</Button>

{/* Separador */}
<div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', marginBottom: '20px' }}>
  <div style={{ flex: 1, height: '1px', backgroundColor: theme.palette.primary.main }}></div>
  <Typography variant="body2" sx={{ marginX: '10px', color: theme.palette.primary.main }}>
    O registrarte con
  </Typography>
  <div style={{ flex: 1, height: '1px', backgroundColor: theme.palette.primary.main }}></div>
</div>

{/* Botones de inicio de sesión con Google y Microsoft */}
<div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
  <Button
    variant="outlined"
    sx={{
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      '&:hover': { backgroundColor: theme.palette.primary.main, color: 'white' },
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px',
    }}
    fullWidth
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.palette.primary.main} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12v-2.6h10a10 10 0 0 1-2.9 9.6l-2.2-1.6a7.7 7.7 0 0 0 2.3-5.4h-7.2z" />
      <path d="M3.5 14.5a9.9 9.9 0 0 1 0-5l2.2 1.6a7.8 7.8 0 0 0 0 2l-2.2 1.4z" />
      <path d="M12 22a10 10 0 0 1-8.5-5.5l2.2-1.6a7.8 7.8 0 0 0 6.3 3.8v3z" />
      <path d="M20.5 5.5l-2.2 1.6A7.7 7.7 0 0 0 12 4v-3a10 10 0 0 1 8.5 4.5z" />
    </svg>
    Registrarse con Google
  </Button>

  <Button
    variant="outlined"
    sx={{
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      '&:hover': { backgroundColor: theme.palette.primary.main, color: 'white' },
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px',
    }}
    fullWidth
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.palette.primary.main} xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3h20v18H2z" fill="none" />
      <path d="M4 5h16v14H4z" />
      <path fill="white" d="M6 7h12v2H6zM6 11h12v2H6zM6 15h12v2H6z" />
    </svg>
    Registrarse con Microsoft
  </Button>
</div>



        </form>
      </div>

      {/* Contenedor de la imagen */}
      <div
        style={{
          flex: '1', // Ocupa el resto del espacio disponible
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <img
          src={imagen}
          alt="Persona haciendo ejercicio"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Cambiado a 'cover' para que la imagen cubra todo el contenedor
          }}
        />
      </div>
    </div>
  );
}
