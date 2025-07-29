import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {
  Email,
  Badge,
  Person,
  Business,
  Schedule,
  CalendarToday,
  AccessTime,
  AccountCircle,
  WorkOutline,
  Check,
  Close,
} from '@mui/icons-material';

export default function User_profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para edición inline
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    name: '',
    last_name: '',
    email: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Referencias para los inputs usando useRef
  const nameInputRef = React.useRef(null);
  const lastNameInputRef = React.useRef(null);
  const emailInputRef = React.useRef(null);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // --- Lectura segura del usuario del localStorage ---
  let userFromStorage = null;
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    userFromStorage = raw ? JSON.parse(raw) : null;
  } catch {
    userFromStorage = null;
  }

  const roleName = userFromStorage?.role?.role_name || "Rol desconocido";
  const userColor = userFromStorage?.color || "#ff4300";

  // Mapeo de colores
  const colorMap = {
    Rojo: "#e74c3c",
    Azul: "#3498db",
    Verde: "#2ecc71",
    Amarillo: "#f1c40f",
    Morado: "#9b59b6",
    Naranja: "#e67e22",
    Rosa: "#e91e63",
    Durazno: "#ffb74d",
    Turquesa: "#1abc9c",
    RojoVino: "#880e4f",
    Lima: "#cddc39",
    Cian: "#00acc1",
    Lavanda: "#9575cd",
    Magenta: "#d81b60",
    Coral: "#ff7043",
  };

  const getMappedColor = (colorName) => colorMap[colorName] || "#ff4300";
  const bannerColor = getMappedColor(userColor);

  // Fetch datos del usuario desde el backend
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      let endpoint = '';
      
      if (roleName === "Administrador") {
        endpoint = `${API}/api/admins/me`;
      } else if (roleName === "Colaborador") {
        endpoint = `${API}/api/colaborators/me`;
      } else {
        throw new Error("Rol no reconocido");
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos del backend:', data);
      setUserData(data);
      
      // Inicializar valores de edición
      setEditValues({
        name: data.name || '',
        last_name: data.last_name || '',
        email: data.email || ''
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API, token, roleName]);

  useEffect(() => {
    if (token && roleName !== "Rol desconocido") {
      fetchUserData();
    } else {
      setLoading(false);
      setError("No se encontró token o rol válido");
    }
  }, [token, roleName, fetchUserData]);

  // Función para iniciar edición
  const startEditing = (field) => {
    if (roleName !== "Administrador") return;
    setEditingField(field);
  };

  // Función para cancelar edición
  const cancelEditing = () => {
    setEditingField(null);
    // Restaurar valores originales
    setEditValues({
      name: userData.name || '',
      last_name: userData.last_name || '',
      email: userData.email || ''
    });
  };

  // Función para guardar cambios
  const saveChanges = async () => {
    if (!userData || updateLoading) return;

    try {
      setUpdateLoading(true);
      
      const updateData = {
        id: userData._id,
        name: editValues.name.trim(),
        last_name: editValues.last_name.trim(),
        email: editValues.email.trim()
      };

      const response = await fetch(`${API}/api/admins/updated`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar los datos');
      }

      const updatedData = await response.json();
      
      // Actualizar los datos locales
      setUserData(updatedData);
      setEditingField(null);
      
      // Mostrar mensaje de éxito (opcional)
      console.log('Datos actualizados correctamente');
      
    } catch (err) {
      console.error('Error updating user data:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Función para manejar cambios en inputs - CORRECCIÓN DEL CURSOR
  const handleInputChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para formatear días de trabajo
  const formatWorkingDays = (days) => {
    if (!days || !Array.isArray(days)) return "No definido";
    return days.join(", ");
  };

  // Función para formatear hora con AM/PM
  const formatTime = (time) => {
    if (!time) return "No definido";
    
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return time;
    
    const period = hours >= 12 ? 'p.m.' : 'a.m.';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Componente para campo editable
  const EditableField = ({ field, icon, label, value, isFullName = false }) => {
    const isEditing = editingField === field;
    const canEdit = roleName === "Administrador";
    
    return (
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '18px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(248, 130, 11, 0.1)',
        transition: 'all 0.3s ease',
        cursor: canEdit ? 'pointer' : 'default'
      }}
      onDoubleClick={() => canEdit && startEditing(field)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          {icon}
          <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', fontWeight: '600' }}>
            {label}
          </Typography>
          {canEdit && !isEditing && (
            <Typography variant="caption" style={{ 
              color: 'rgba(248, 130, 11, 0.6)', 
              fontSize: '12px',
              marginLeft: 'auto' 
            }}>
              Doble clic para editar
            </Typography>
          )}
        </div>
        
        <div style={{ marginLeft: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isEditing ? (
            <>
              {isFullName ? (
                <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={editValues.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nombre"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#1e1e1e',
                      border: '2px solid #F8820B',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                  <input
                    ref={lastNameInputRef}
                    type="text"
                    value={editValues.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    placeholder="Apellido"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#1e1e1e',
                      border: '2px solid #F8820B',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
              ) : (
                <input
                  ref={emailInputRef}
                  type={field === 'email' ? 'email' : 'text'}
                  value={editValues[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: '#1e1e1e',
                    border: '2px solid #F8820B',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                  autoFocus
                />
              )}
              
              <button
                onClick={saveChanges}
                disabled={updateLoading}
                style={{
                  backgroundColor: '#2ecc71',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: updateLoading ? 'not-allowed' : 'pointer',
                  opacity: updateLoading ? 0.6 : 1
                }}
              >
                <Check style={{ color: 'white', fontSize: '18px' }} />
              </button>
              
              <button
                onClick={cancelEditing}
                disabled={updateLoading}
                style={{
                  backgroundColor: '#e74c3c',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: updateLoading ? 'not-allowed' : 'pointer',
                  opacity: updateLoading ? 0.6 : 1
                }}
              >
                <Close style={{ color: 'white', fontSize: '18px' }} />
              </button>
            </>
          ) : (
            <Typography variant="body1" style={{ color: 'white', fontSize: '16px' }}>
              {value}
            </Typography>
          )}
        </div>
      </div>
    );
  };

  // Validación de PropTypes para EditableField
  EditableField.propTypes = {
    field: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    isFullName: PropTypes.bool
  };

  if (loading) {
    return (
      <div style={{ 
        background: '#272829', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography variant="h4" style={{ color: '#F8820B' }}>
          Cargando perfil...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        background: '#272829', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography variant="h5" style={{ color: '#e74c3c' }}>
          Error: {error}
        </Typography>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ 
        background: '#272829', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography variant="h5" style={{ color: '#F8820B' }}>
          No se encontraron datos del usuario
        </Typography>
      </div>
    );
  }

  const fullName = `${userData.name || ""} ${userData.last_name || ""}`.trim();
  const inicial = fullName ? fullName[0].toUpperCase() : "?";
  
  // CORRECCIÓN: Acceso correcto a los datos del gimnasio
  const gymName = userData.gym_id?.name || userData.gym?.name || "No asignado";
  
  // CORRECCIÓN: Acceso correcto a la matrícula según el rol
  const getMatricula = () => {
    if (roleName === "Administrador") {
      return userData.admin_code || "No disponible";
    } else if (roleName === "Colaborador") {
      return userData.colaborator_code || "No disponible";
    }
    return "No disponible";
  };

  return (
    <div style={{ 
      background: '#272829', 
      minHeight: '100vh', 
      padding: '32px',
      fontFamily: 'Roboto, Arial, sans-serif'
    }}>
      {/* Banner con color de fondo */}
      <div style={{ 
        position: 'relative', 
        marginBottom: '40px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <div
          style={{
            width: '100%',
            height: 200,
            background: `linear-gradient(135deg, ${bannerColor}dd, ${bannerColor})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <Typography variant="h3" style={{ 
            color: 'white', 
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            letterSpacing: '1px'
          }}>
          </Typography>
        </div>
      </div>

      {/* Encabezado del perfil */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '24px', 
        marginBottom: '40px',
        backgroundColor: '#1e1e1e',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        border: '1px solid rgba(248, 130, 11, 0.1)'
      }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${bannerColor}, ${bannerColor}dd)`,
          color: '#fff',
          fontSize: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid #F8820B',
          fontWeight: '700',
          boxShadow: '0 4px 20px rgba(248, 130, 11, 0.3)'
        }}>
          {inicial}
        </div>
        
        <div style={{ flex: 1 }}>
          <Typography variant="h4" style={{ 
            color: '#F8820B', 
            margin: 0, 
            fontWeight: '600',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {fullName}
          </Typography>
          <Typography variant="h6" style={{ 
            color: '#ffffff', 
            margin: 0,
            opacity: 0.9,
            fontWeight: '400'
          }}>
            {roleName}
          </Typography>
        </div>
      </div>

      {/* Contenedor principal de información */}
      <div style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        border: '1px solid rgba(248, 130, 11, 0.1)'
      }}>
        {/* Título principal */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '2px solid #F8820B'
        }}>
          <AccountCircle style={{ color: '#F8820B', fontSize: '32px' }} />
          <Typography variant="h5" style={{ 
            color: '#F8820B', 
            fontWeight: '600',
            margin: 0
          }}>
            Información del Usuario
          </Typography>
          {roleName === "Administrador" && (
            <Typography variant="caption" style={{ 
              color: 'rgba(248, 130, 11, 0.7)', 
              marginLeft: 'auto',
              fontSize: '12px'
            }}>
              ✏️ Campos editables: Nombre completo y correo electrónico
            </Typography>
          )}
        </div>

        {/* Grid de información */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '24px'
        }}>
          {/* Datos Personales */}
          <div>
            <Typography variant="h6" style={{ 
              color: '#F8820B', 
              marginBottom: '20px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Person style={{ fontSize: '24px' }} />
              Datos Personales
            </Typography>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Nombre de Usuario */}
              <div style={{
                backgroundColor: '#2a2a2a',
                padding: '18px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(248, 130, 11, 0.1)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <AccountCircle style={{ color: '#F8820B', fontSize: '20px' }} />
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', fontWeight: '600' }}>
                    Nombre de Usuario
                  </Typography>
                </div>
                <Typography variant="body1" style={{ color: 'white', fontSize: '16px', marginLeft: '32px' }}>
                  @{userData.username}
                </Typography>
              </div>

              {/* Nombre Completo - Editable para administradores */}
              <EditableField
                field="fullName"
                icon={<Badge style={{ color: '#F8820B', fontSize: '20px' }} />}
                label="Nombre Completo"
                value={fullName}
                isFullName={true}
              />

              {/* Email - Editable para administradores */}
              <EditableField
                field="email"
                icon={<Email style={{ color: '#F8820B', fontSize: '20px' }} />}
                label="Correo Electrónico"
                value={userData.email}
              />

              {/* Matrícula - CORREGIDO */}
              <div style={{
                backgroundColor: '#2a2a2a',
                padding: '18px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(248, 130, 11, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <WorkOutline style={{ color: '#F8820B', fontSize: '20px' }} />
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', fontWeight: '600' }}>
                    {roleName === "Administrador" ? "Matrícula de Administrador" : "Matrícula de Colaborador"}
                  </Typography>
                </div>
                <Typography variant="body1" style={{ color: 'white', fontSize: '16px', marginLeft: '32px' }}>
                  {getMatricula()}
                </Typography>
              </div>
            </div>
          </div>

          {/* Datos del Sistema */}
          <div>
            <Typography variant="h6" style={{ 
              color: '#F8820B', 
              marginBottom: '20px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AccessTime style={{ fontSize: '24px' }} />
              Datos del Sistema
            </Typography>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Fecha de Registro */}
              <div style={{
                backgroundColor: '#2a2a2a',
                padding: '18px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(248, 130, 11, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <CalendarToday style={{ color: '#F8820B', fontSize: '20px' }} />
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', fontWeight: '600' }}>
                    Fecha de Registro
                  </Typography>
                </div>
                <Typography variant="body1" style={{ color: 'white', fontSize: '16px', marginLeft: '32px' }}>
                  {formatDate(userData.createdAt)}
                </Typography>
              </div>

              {/* Última Actualización */}
              <div style={{
                backgroundColor: '#2a2a2a',
                padding: '18px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(248, 130, 11, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <AccessTime style={{ color: '#F8820B', fontSize: '20px' }} />
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', fontWeight: '600' }}>
                    Última Actualización
                  </Typography>
                </div>
                <Typography variant="body1" style={{ color: 'white', fontSize: '16px', marginLeft: '32px' }}>
                  {formatDate(userData.updatedAt)}
                </Typography>
              </div>

              {/* Tipo de Rol */}
              <div style={{
                backgroundColor: '#2a2a2a',
                padding: '18px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(248, 130, 11, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <Person style={{ color: '#F8820B', fontSize: '20px' }} />
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', fontWeight: '600' }}>
                    Tipo de Rol
                  </Typography>
                </div>
                <Typography variant="body1" style={{ color: 'white', fontSize: '16px', marginLeft: '32px' }}>
                  {userData.rol_id?.role_name || userData.role?.role_name || roleName}
                </Typography>
              </div>
              
              {/* Gimnasio - CORREGIDO */}
              <div style={{
                backgroundColor: '#2a2a2a',
                padding: '18px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(248, 130, 11, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <Business style={{ color: '#F8820B', fontSize: '20px' }} />
                  <Typography variant="body2" style={{ color: '#F8820B', fontSize: '14px', fontWeight: '600' }}>
                    Gimnasio
                  </Typography>
                </div>
                <Typography variant="body1" style={{ color: 'white', fontSize: '16px', marginLeft: '32px' }}>
                  {gymName}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Horario de Trabajo (solo para colaboradores) - Ocupa todo el ancho */}
        {roleName === "Colaborador" && userData.working_hour && (
          <div style={{ marginTop: '32px' }}>
            <Typography variant="h6" style={{ 
              color: '#F8820B', 
              marginBottom: '20px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Schedule style={{ fontSize: '24px' }} />
              Horario Laboral
            </Typography>

            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '16px',
              padding: '32px',
              border: '2px solid rgba(248, 130, 11, 0.2)',
              boxShadow: '0 4px 20px rgba(248, 130, 11, 0.1)'
            }}>
              {/* Header del horario */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '28px',
                paddingBottom: '20px',
                borderBottom: '1px solid rgba(248, 130, 11, 0.3)'
              }}>
                <div style={{
                  backgroundColor: '#F8820B',
                  borderRadius: '50%',
                  padding: '12px',
                  marginRight: '16px'
                }}>
                  <Schedule style={{ color: 'white', fontSize: '28px' }} />
                </div>
                <Typography variant="h5" style={{ 
                  color: 'white', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Configuración de Horario de Trabajo  
                </Typography>
              </div>

              {/* Grid del horario */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '24px',
                alignItems: 'start'
              }}>
                {/* Días de trabajo */}
                <div style={{
                  backgroundColor: 'rgba(248, 130, 11, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(248, 130, 11, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    backgroundColor: '#F8820B',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CalendarToday style={{ color: 'white', fontSize: '24px' }} />
                  </div>
                  <Typography variant="h6" style={{ 
                    color: '#F8820B', 
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    Días Laborales
                  </Typography>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '16px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="body1" style={{ 
                      color: 'white', 
                      fontSize: '16px',
                      fontWeight: '500',
                      lineHeight: '1.4',
                      textAlign: 'center'
                    }}>
                      {formatWorkingDays(userData.working_hour.days)}
                    </Typography>
                  </div>
                </div>

                {/* Hora de entrada */}
                <div style={{
                  backgroundColor: 'rgba(46, 204, 113, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(46, 204, 113, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    backgroundColor: '#2ecc71',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <AccessTime style={{ color: 'white', fontSize: '24px' }} />
                  </div>
                  <Typography variant="h6" style={{ 
                    color: '#2ecc71', 
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    Hora de Entrada
                  </Typography>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '16px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" style={{ 
                      color: 'white', 
                      fontWeight: '700',
                      fontSize: '24px'
                    }}>
                      {formatTime(userData.working_hour.start_time)}
                    </Typography>
                  </div>
                </div>

                {/* Hora de salida */}
                <div style={{
                  backgroundColor: 'rgba(231, 76, 60, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(231, 76, 60, 0.2)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    backgroundColor: '#e74c3c',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <AccessTime style={{ color: 'white', fontSize: '24px', transform: 'rotate(180deg)' }} />
                  </div>
                  <Typography variant="h6" style={{ 
                    color: '#e74c3c', 
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}>
                    Hora de Salida
                  </Typography>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '16px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" style={{ 
                      color: 'white', 
                      fontWeight: '700',
                      fontSize: '24px'
                    }}>
                      {formatTime(userData.working_hour.end_time)}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Footer informativo */}
              <div style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(248, 130, 11, 0.3)',
                textAlign: 'center'
              }}>
                <Typography variant="body2" style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '14px',
                  fontStyle: 'italic'
                }}>
                  💼 Este horario define los días y horas de trabajo establecidos para el colaborador
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}