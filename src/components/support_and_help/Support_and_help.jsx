import { Button, Typography, Paper, Modal, Box, TextField, Divider } from '@mui/material';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function Support_and_help() {

  const [open, setOpen] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendReport = () => setOpenSuccess(true);
  const handleCloseSuccess = () => {
    setOpenSuccess(false);
    setOpen(false);
  }

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image']
    ]
  };

  const styles = {
    modal: {
      display: open ? 'flex' : 'none',
      position: 'fixed',
      zIndex: 1000,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalContent: {
      backgroundColor: '#272829',
      border: '',
      borderRadius: '20px',
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    },
    modalHeader: {
      backgroundColor: '#FF6600',
      color: '#000',
      padding: '10px 30px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderRadius: '0px 0px 20px 20px',

    },
    backArrow: {
      cursor: 'pointer',
      fontSize: '20px',
      fontWeight: 'bold',
      padding: '5px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '30px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#000'
    },
    modalTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      margin: 0
    },
    modalBody: {
      padding: '20px'
    },
    guideTitle: {
      color: '#fff',
      fontSize: '14px',
      marginBottom: '10px',
      fontWeight: '500'
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      marginBottom: '10px',
      paddingBottom: '10px',
      borderBottom: '1px solid #45474B'
    },
    toolbarBtn: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: '5px 8px',
      borderRadius: '3px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    divider: {
      width: '1px',
      height: '20px',
      backgroundColor: '#45474B',
      margin: '0 5px'
    },
    textArea: {
      width: '100%',
      height: '200px',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '10px',
      fontSize: '13px',
      lineHeight: '1.4',
      fontFamily: 'inherit',
      resize: 'vertical',
      marginBottom: '20px',
      boxSizing: 'border-box'
    },
    sendButton: {
      display: 'flex',
      justifyContent: 'center'
    },
    sendBtn: {
      backgroundColor: '#F8820B',
      color: '#000',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 30px',
      fontWeight: 'bold',
      fontSize: '14px',
      cursor: 'pointer'
    }
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        sx={{ marginBottom: '30px' }}>
        <Typography variant='h1' sx={{ fontWeight: 'bold', color: '#fff', fontSize: '24px' }}>Preguntas Frecuentes (FAQ)</Typography>
      </Grid>
      <div>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant='h2' sx={{ fontSize: '15px', color: '#F8820B' }}>¿Cómo puedo restablecer mi contraseña?</Typography>
          </div>
          <Paper sx={{ padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#45474B' }}>
            <Typography sx={{ justifyContent: 'center', color: '#fff' }}>Si has olvidado tu contraseña, ve a la pantalla de inicio de sesión y haz clic en el enlace "¿Olvidaste tu contraseña?". Te pediremos que ingreses tu correo electrónico para enviarte un enlace para restablecerla. Si no recibes el correo en unos minutos, revisa tu carpeta de spam.</Typography>
          </Paper>
        </div>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant='h2' sx={{ fontSize: '15px', color: '#F8820B' }}>¿Cómo actualizo mi información personal (nombre, correo, teléfono)?</Typography>
          </div>
          <Paper sx={{ padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#45474B' }}>
            <Typography sx={{ justifyContent: 'center', color: '#fff' }}>Para actualizar tu información, inicia sesión en tu cuenta y ve a la sección "Perfil de Usuario". Allí podrás editar tus datos personales. No olvides guardar los cambios al finalizar.</Typography>
          </Paper>
        </div>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant='h2' sx={{ fontSize: '15px', color: '#F8820B' }}>¿Cómo puedo cambiar el horario de las clases que ofrezco?</Typography>
          </div>
          <Paper sx={{ padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#45474B' }}>
            <Typography sx={{ justifyContent: 'center', color: '#fff' }}>Si eres un administrador o entrenador, ve a la sección "Gestión de membresía", después ingresar “Administrar planes” y selecciona la servicio que deseas modificar. Puedes cambiar el horario, la duración, el tipo de clase, y el número de plazas disponibles. Haz clic en "Modificar Servicio" para confirmar los cambios.</Typography>
          </Paper>
        </div>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant='h2' sx={{ fontSize: '15px', color: '#F8820B' }}>¿Cómo puedo ajustar los precios de las membresías?</Typography>
          </div>
          <Paper sx={{ padding: '15px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#45474B' }}>
            <Typography sx={{ justifyContent: 'center', color: '#fff' }}>Para actualizar los precios de las membresías, dirígete a la sección "Gestión de membresía", después ingresar “Administrar planes” . Allí podrás modificar los precios y las opciones de pago, así como agregar o eliminar tipos de membresías. Recuerda actualizar los precios en la plataforma para reflejar los cambios.</Typography>
          </Paper>
        </div>
        <div>
          <div style={{ marginBottom: '10px' }}>
            <Typography variant='h2' sx={{ fontSize: '15px', color: '#F8820B' }}>¿Puedo personalizar la apariencia de la plataforma?</Typography>
          </div>
          <Paper sx={{ padding: '15px', borderRadius: '8px', marginBottom: '30px', backgroundColor: '#45474B' }}>
            <Typography sx={{ justifyContent: 'center', color: '#fff' }}>Sí, en la sección "Configuración" podrás personalizar el diseño y la apariencia de la plataforma, como colores, logotipo y tema. Esto te permitirá adaptar la plataforma a la identidad visual del gimnasio.</Typography>
          </Paper>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px' }}>
        <Button variant="contained" sx={{ backgroundColor: '#F8820B', color: '#000', padding: '10px 20px', borderRadius: '8px' }}
          onClick={handleOpen}>
          <Typography>Generar reporte</Typography>
        </Button>
      </div>


      {/* Modal */}
      <div style={styles.modal} onClick={handleClose}>
        <div style={styles.modalContent}
          onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div style={styles.modalHeader}>
            <button style={styles.backArrow} onClick={handleClose}>
              ←
            </button>
            <div style={styles.modalTitle}>
              Generar un reporte del problema de la aplicación
            </div>
          </div>
          <div >

            <div style={styles.modalBody}>
              <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '0px' }}>
                <Grid container spacing={0} sx={{ marginBottom: '20px' }}>
                  <div style={{ width: '90%', margin: '0 auto', padding: '10px 00px' }}>
                    <TextField variant='standard'
                      defaultValue="Escribe aquí el titulo del reporte"
                      fullWidth
                      InputProps={{ disableUnderline: true }}
                    ></TextField>
                  </div>
                  <Divider sx={{ bgcolor: '#F8820B', height: 3, width: '100%', mt: 0 }} />
                </Grid>

                {/* Toolbar */}
                <div style={{ padding: '10px 0', width: '95%', margin: '0 auto' }}>
                  <style>
                    {`
                      .ql-container.ql-snow {
                        border: none !important;
                        border-radius: 8px !important;
                        background: #fff;
                      }
                      .ql-toolbar.ql-snow {
                        border: none !important;
                        border-bottom: 1.5px solid #eee !important;
                        border-radius: 8px 8px 0 0 !important;
                        background: #fff;
                        display: flex;
                        justify-content: center;
                      }
                    `}
                  </style>
                  <ReactQuill
                    modules={modules}
                    style={{
                      height: '250px',           
                      minHeight: '200px',
                      width: '100%',
                      background: '#fff',
                      borderRadius: 8,
                      marginBottom: 20,
                      display: 'flex',
                      flexDirection: 'column',
                      alignContent: 'center',
                      justifyContent: 'center',
                      color: '#000',
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginRight: 18 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#F8820B',
                  color: '#000',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  px: 1,
                  py: 1,
                  boxShadow: 'none',
                  mb: 4,
                }}
                onClick={handleSendReport}
              >
                Enviar reporte
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openSuccess}
        onClose={handleCloseSuccess}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(2px)',
          backgroundColor: 'rgba(0,0,0,0.7) !important',
        }}
      >
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            bgcolor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              // bgcolor: '#fff',
              borderRadius: 4,
              boxShadow: 6,
              px: 6,
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 600,
            }}
          >
            <Typography variant="h2" sx={{ color: '#F8820B', fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' }, mb: 2, textAlign: 'center' }}>
              ¡Reporte enviado!
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '1.3rem', textAlign: 'center', mb: 4 }}>
              Tu reporte ha sido recibido correctamente.<br />
              Nos pondremos en contacto contigo si es necesario.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#F8820B',
                color: '#000',
                borderRadius: '8px',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                boxShadow: 'none'
              }}
              onClick={handleCloseSuccess}
            >
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
