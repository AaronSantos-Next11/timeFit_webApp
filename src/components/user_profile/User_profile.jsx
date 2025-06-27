import React from 'react';
import Typography from '@mui/material/Typography';
import {
  Male,
  Cake,
  Phone,
  Email,
  Badge,
  Facebook,
  Instagram,
  Telegram,
  Circle,
  People,
  Speed
} from '@mui/icons-material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function User_profile() {
  // Obtén los datos del usuario desde localStorage
  const displayName = localStorage.getItem("displayName") || "Usuario";
  const photoURL = localStorage.getItem("photoURL") || "";

  // Si no hay foto, usa la inicial del nombre
  const inicial = displayName ? displayName[0].toUpperCase() : "?";

  return (
    <div style={{ background: '#272829', minHeight: '100vh', padding: 0 }}>
      <div>
        {/* Imagen de portada */}
        <img
          src="/img/OIP.jpg"
          alt="Portada"
          style={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            borderRadius: 10,
            marginBottom: -10,
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
          }}
        />
      </div>
      {/* Bloque de usuario */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: 16,
        padding: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        marginTop: -40,
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        WebkitBorderBottomLeftRadius: 0,
        WebkitBorderBottomRightRadius: 0,
        paddingBottom: 10,
      }}>
        {photoURL ? (
          <img
            src={photoURL}
            alt="Foto de perfil"
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid #F8820B',
              background: '#fff',
              flexShrink: 0
            }}
          />
        ) : (
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: '#45474B',
            color: '#fff',
            fontSize: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #F8820B',
            flexShrink: 0
          }}>
            {inicial}
          </div>
        )}
        <div>
          <h2 style={{ color: '#F8820B', margin: 0 }}>{displayName}</h2>
          <p style={{ color: '#fff', margin: 0 }}>Administrador</p>
        </div>
      </div>
      <div style={{
        background: '#1a1a1a',
        borderRadius: 16,
        padding: 32,
        WebkitBorderTopLeftRadius: 0,
        WebkitBorderTopRightRadius: 0,
        paddingTop: 10,
      }}>
        <div style={{ marginLeft: 100, marginRight: 10 }}>
          <Typography variant="h6" style={{ color: 'white', marginBottom: 10, fontSize: '15px' }}>
            Con más de 8 años en la industria del fitness, Yair Guzman se especializa en la gestión de gimnasios y en la creación de experiencias positivas para los miembros. Ha liderado equipos de trabajo para optimizar operaciones diarias, implementar estrategias de marketing efectivas y garantizar la satisfacción de los clientes.
          </Typography>
        </div>
        {/* Sección de columnas */}
        <div style={{
          marginLeft: 100,
          marginRight: 10,
          marginTop: 30,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20
        }}>
          {/* Primera columna */}
          <div style={{
            backgroundColor: '#45474B',
            padding: 20,
            borderRadius: 8,
            width: 330,
            height: 450
          }}>
            <div style={{ justifyContent: 'center', display: 'flex', marginBottom: 10 }}>
              <Typography variant="h6" style={{ color: 'white', marginBottom: 10, fontSize: '20px', fontWeight: 'bold' }}>
                Información personal
              </Typography>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 12 }}>
                <Male style={{ color: '#F8820B', fontSize: 20 }} />
                <div>
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0 }}>
                    Género
                  </Typography>
                  <Typography variant="body2" style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                    Masculino
                  </Typography>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 12 }}>
                <Cake style={{ color: '#F8820B', fontSize: 20 }} />
                <div>
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0 }}>
                    Cumpleaños
                  </Typography>
                  <Typography variant="body2" style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                    3 de marzo de 2024
                  </Typography>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 12 }}>
                <Phone style={{ color: '#F8820B', fontSize: 20 }} />
                <div>
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0 }}>
                    Número de teléfono
                  </Typography>
                  <Typography variant="body2" style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                    967 585 98 34
                  </Typography>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 12 }}>
                <Email style={{ color: '#F8820B', fontSize: 20 }} />
                <div>
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0 }}>
                    Correo electrónico
                  </Typography>
                  <Typography variant="body2" style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                    yair@gmail.com
                  </Typography>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 12 }}>
                <Badge style={{ color: '#F8820B', fontSize: 20 }} />
                <div>
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0 }}>
                    Matrícula de administrador
                  </Typography>
                  <Typography variant="body2" style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                    23040598
                  </Typography>
                </div>
              </div>
              <div style={{ marginTop: 30 }}>
                <Typography variant="body2" style={{
                  color: '#F8820B',
                  marginBottom: 2,
                  fontSize: '14px',
                  marginLeft: 32
                }}>
                  Contacto
                </Typography>
                <div style={{ display: 'flex', gap: 0, marginLeft: 23 }}>
                  <div style={{
                    backgroundColor: '',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white'
                  }}>
                    <Facebook />
                  </div>
                  <div style={{
                    backgroundColor: '',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white'
                  }}>
                    <WhatsAppIcon />
                  </div>
                  <div style={{
                    backgroundColor: '',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white'
                  }}>
                    <Telegram />
                  </div>
                  <div style={{
                    backgroundColor: '',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white'
                  }}>
                    <Instagram />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Segunda columna */}
          <div style={{
            backgroundColor: '#45474B',
            padding: 20,
            borderRadius: 8,
            width: 330,
            height: 450
          }}>
            <div style={{ justifyContent: 'center', display: 'flex', marginBottom: 10 }}>
              <Typography variant="h6" style={{ color: 'white', marginBottom: 10, fontSize: '20px', fontWeight: 'bold' }}>
                Actividades o Recordatorios
              </Typography>
            </div>
            {/* Actividad 1 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 15, marginLeft: 20 }}>
              <Circle style={{ color: '#F8820B', fontSize: 12 }} />
              <div style={{
                background: '#5A5A5A',
                borderRadius: 10,
                padding: '10px 16px',
                minWidth: 220,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
              }}>
                <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                  4 de diciembre de 2024
                </Typography>
                <Typography variant="body2" style={{ color: 'white', fontSize: '12px', margin: 0 }}>
                  Presentación de la aplicación.
                </Typography>
              </div>
            </div>
            {/* Actividad 2 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 15, marginLeft: 20 }}>
              <Circle style={{ color: '#F8820B', fontSize: 12 }} />
              <div style={{
                background: '#5A5A5A',
                borderRadius: 10,
                padding: '10px 16px',
                minWidth: 220,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
              }}>
                <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                  6 de diciembre de 2024
                </Typography>
                <Typography variant="body2" style={{ color: 'white', fontSize: '12px', margin: 0 }}>
                  Terminar el proyecto Time Fit.
                </Typography>
              </div>
            </div>
            {/* Actividad 3 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 15, marginLeft: 20 }}>
              <Circle style={{ color: '#F8820B', fontSize: 12 }} />
              <div style={{
                background: '#5A5A5A',
                borderRadius: 10,
                padding: '10px 16px',
                minWidth: 220,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
              }}>
                <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                  8 de diciembre de 2024
                </Typography>
                <Typography variant="body2" style={{ color: 'white', fontSize: '12px', margin: 0 }}>
                  Revisar la instalación del gimnsio.
                </Typography>
              </div>
            </div>
            {/* Actividad 4 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 15, marginLeft: 20 }}>
              <Circle style={{ color: '#F8820B', fontSize: 12 }} />
              <div style={{
                background: '#5A5A5A',
                borderRadius: 10,
                padding: '10px 16px',
                minWidth: 220,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
              }}>
                <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                  15 de diciembre de 2024
                </Typography>
                <Typography variant="body2" style={{ color: 'white', fontSize: '12px', margin: 0 }}>
                  Revisar errores de documentación.
                </Typography>
              </div>
            </div>
            {/* Actividad 5 */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15, gap: 15, marginLeft: 20 }}>
              <Circle style={{ color: '#F8820B', fontSize: 12 }} />
              <div style={{
                background: '#5A5A5A',
                borderRadius: 10,
                padding: '10px 16px',
                minWidth: 220,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
              }}>
                <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>
                  8 de diciembre de 2024
                </Typography>
                <Typography variant="body2" style={{ color: 'white', fontSize: '12px', margin: 0 }}>
                  Hablar con nuestro primer cliente.
                </Typography>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            width: 330
          }}>
            {/* Cuadro superior - Tiempo de Actividad */}
            <div style={{
  backgroundColor: '#45474B',
  padding: 20,
  borderRadius: 8,
  height: 215
}}>
  <div style={{ justifyContent: 'center', display: 'flex', marginBottom: -20 }}>
    <Typography variant="h6" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
      Tiempo de Actividad
    </Typography>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
    {/* Columna izquierda: hora y frase */}
    <div style={{ flex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <Typography variant="h2" style={{ color: 'white', fontSize: '32px', margin: 0, fontWeight: 'bold' }}>
          08:00:01
        </Typography>
        <Typography variant="body1" style={{ color: 'white', fontSize: '14px', margin: 0 }}>
          Horas Laborales
        </Typography>
      </div>
    </div>
    {/* Columna derecha: ícono */}
    <div style={{
      backgroundColor: '#F8820B',
      borderRadius: '50%',
      width: 80,
      height: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 20,
      marginBottom: 16
    }}>
      <People style={{ color: 'white', fontSize: 40 }} />
    </div>
  </div>
</div>
            
            {/* Cuadro inferior - Desempeño Laboral */}
            <div style={{
              backgroundColor: '#45474B',
              padding: 20,
              borderRadius: 8,
              height: 215
            }}>
              <div style={{ justifyContent: 'center', display: 'flex', marginBottom: 20 }}>
                <Typography variant="h6" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                  Desempeño Laboral
                </Typography>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{
                  backgroundColor: '#F8820B',
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Speed style={{ color: 'white', fontSize: 40 }} />
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Typography variant="h5" style={{ color: 'white', fontSize: '16px', margin: 0,  }}>
                  Progreso Actual: 90%
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}