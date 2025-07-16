// ============================================================================
// COMPONENTE DE NOTAS - TimeFit WebApp
// ============================================================================
// Este es el componente principal que maneja todas las notas del usuario
// Funcionalidades: Crear, Editar, Eliminar y Visualizar notas con categorías

import React, { useState, useEffect } from 'react';
// Importación de componentes de Material-UI para la interfaz
import {
  Card,          // Contenedor principal de cada nota
  CardContent,   // Contenido interno de cada tarjeta
  Typography,    // Textos estilizados
  Button,        // Botones interactivos
  TextField,     // Campos de texto
  MenuItem,      // Elementos del menú desplegable
  Select,        // Selector desplegable
  FormControl,   // Contenedor de formularios
  InputLabel,    // Etiquetas de campos
  Box,           // Contenedor flexible
  
  IconButton,    // Botones con iconos
  Divider,       // Línea divisoria
  Paper,         // Contenedor con sombra
  InputBase,     // Campo de entrada básico
  Avatar,        // Avatar de usuario
  Menu           // Menú desplegable
} from '@mui/material';

import Grid from '@mui/material/Grid2'; 

// Importación de iconos de Material-UI
import { 
  Edit,         // Icono de editar
  Delete,       // Icono de eliminar
  Save,         // Icono de guardar
  Cancel,       // Icono de cancelar
  StickyNote2,  // Icono de nota adhesiva para estado vacío
  Search as SearchIcon,  // Icono de búsqueda
  AccountCircle,         // Icono de cuenta
  Add as AddIcon         // Icono de agregar
} from '@mui/icons-material';

export default function Notes() {
  // ============================================================================
  // ESTADOS DEL COMPONENTE
  // ============================================================================
  // Aquí se definen todas las variables que pueden cambiar en el componente
  
  const [notes, setNotes] = useState([]);                    // Lista de todas las notas
  const [isAddingNote, setIsAddingNote] = useState(false);   // Controla si se muestra el formulario de agregar
  const [editingNoteId, setEditingNoteId] = useState(null);  // ID de la nota que se está editando
  const [newNote, setNewNote] = useState({                   // Datos de la nueva nota
    title: '',           // Título
    content: '',         // Contenido
    category: 'Curso'    // Categoría por defecto
  });
  const [editNote, setEditNote] = useState({                 // Datos de la nota en edición
    title: '',           // Título
    content: '',         // Contenido
    category: 'Curso'    // Categoría por defecto
  });
  
  // Estados para el header
  const [anchorEl, setAnchorEl] = useState(null);         // Estado del menú de perfil
  const [searchTerm, setSearchTerm] = useState("");       // Término de búsqueda

  // ============================================================================
  // DATOS DE USUARIO Y PERFIL
  // ============================================================================
  // Obtener datos del usuario desde localStorage
  let admin = null;
  try {
    const adminDataString = localStorage.getItem("admin") || sessionStorage.getItem("admin");
    admin = adminDataString ? JSON.parse(adminDataString) : null;
  } catch {
    admin = null;
  }

  const roleName = admin?.role?.role_name || "Rol desconocido";
  
  // Funciones para obtener datos del usuario
  const getInitials = (username) => username?.slice(0, 2).toUpperCase() || "";
  const usernameInitials = getInitials(admin?.username);
  const getFirstNameAndLastName = (n, l) => `${n?.split(" ")[0] || ""} ${l?.split(" ")[0] || ""}`.trim();
  const displayName = getFirstNameAndLastName(admin?.name, admin?.last_name);

  // Funciones para manejar el menú de perfil
  const handleProfileMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // ============================================================================
  // FILTRADO DE NOTAS
  // ============================================================================
  // Filtrar notas por término de búsqueda
  const filteredNotes = notes.filter(note => {
    const term = searchTerm.toLowerCase();
    return (
      note.title?.toLowerCase().includes(term) ||
      note.content?.toLowerCase().includes(term) ||
      note.category?.toLowerCase().includes(term)
    );
  });

  // ============================================================================
  // CONFIGURACIÓN DE COLORES POR CATEGORÍA
  // ============================================================================
  // Aquí puedes cambiar los colores de cada categoría de nota
  const categoryColors = {
    'Curso': '#e91e63',        // Rosa - Para notas de cursos
    'Reporte': '#F8820B',      // Naranja - Para reportes
    'Soporte': '#f44336',      // Rojo - Para soporte técnico
    'Recordatorio': '#00bcd4', // Azul claro - Para recordatorios
    'Productos': '#4caf50',    // Verde - Para productos
    'Agradecimiento': '#ff9800', // Naranja oscuro - Para agradecimientos
    'Nuevo': '#9c27b0'         // Púrpura - Para nuevas funcionalidades
  };

  // ============================================================================
  // ESTILOS DEL MODAL
  // ============================================================================
  // Estilos para el modal de crear nota, similar al de soporte
  const styles = {
    modal: {
      display: isAddingNote ? 'flex' : 'none',
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
      backgroundColor: '#F8820B',
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
    }
  };

  // ============================================================================
  // EFECTOS DE CICLO DE VIDA
  // ============================================================================
  // Estos efectos se ejecutan automáticamente cuando el componente se monta o cambia
  
  // Cargar notas desde localStorage al iniciar la aplicación
  useEffect(() => {
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []); // Se ejecuta solo una vez al montar el componente

  // Guardar notas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('userNotes', JSON.stringify(notes));
  }, [notes]); // Se ejecuta cada vez que 'notes' cambia

  // ============================================================================
  // FUNCIONES DE MANEJO DE NOTAS
  // ============================================================================
  // Estas funciones controlan todas las operaciones CRUD (Create, Read, Update, Delete)
  
  // FUNCIÓN: Agregar nueva nota
  const handleAddNote = () => {
    // Validar que el título y contenido no estén vacíos
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),                    // ID único usando timestamp
        title: newNote.title,              // Título de la nota
        content: newNote.content,          // Contenido de la nota
        category: newNote.category,        // Categoría seleccionada
        createdAt: new Date().toLocaleDateString('es-ES', {  // Fecha de creación
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };
      setNotes([note, ...notes]);         // Agregar nota al inicio del array
      setNewNote({ title: '', content: '', category: 'Curso' }); // Limpiar formulario
      setIsAddingNote(false);             // Ocultar modal
    }
  };

  // FUNCIÓN: Abrir modal para crear nueva nota
  const handleOpenModal = () => setIsAddingNote(true);

  // FUNCIÓN: Cerrar modal y limpiar formulario
  const handleCloseModal = () => {
    setIsAddingNote(false);
    setNewNote({ title: '', content: '', category: 'Curso' });
  };

  // FUNCIÓN: Iniciar edición de una nota
  const handleEditNote = (note) => {
    setEditingNoteId(note.id);           // Establecer ID de nota en edición
    setEditNote({                        // Cargar datos actuales en el formulario
      title: note.title,
      content: note.content,
      category: note.category
    });
  };

  // FUNCIÓN: Guardar cambios de edición
  const handleSaveEdit = () => {
    // Validar que el título y contenido no estén vacíos
    if (editNote.title.trim() && editNote.content.trim()) {
      setNotes(notes.map(note => 
        note.id === editingNoteId          // Buscar la nota que se está editando
          ? { ...note, title: editNote.title, content: editNote.content, category: editNote.category }
          : note                           // Mantener otras notas sin cambios
      ));
      setEditingNoteId(null);              // Salir del modo edición
      setEditNote({ title: '', content: '', category: 'Curso' }); // Limpiar formulario
    }
  };

  // FUNCIÓN: Cancelar edición
  const handleCancelEdit = () => {
    setEditingNoteId(null);                // Salir del modo edición
    setEditNote({ title: '', content: '', category: 'Curso' }); // Limpiar formulario
  };

  // FUNCIÓN: Eliminar nota
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id)); // Filtrar la nota a eliminar
  };

  // ============================================================================
  // RENDERIZADO DEL COMPONENTE
  // ============================================================================
  // Aquí se define cómo se ve la interfaz de usuario

  return (
    // ============================================================================
    // CONTENEDOR PRINCIPAL DE LA PÁGINA
    // ============================================================================
    // Box es el contenedor principal con fondo oscuro y padding
    <Box sx={{ 
      background: '#272829',  // Color de fondo principal - CAMBIAR AQUÍ para otro color
      minHeight: '100vh',     // Altura mínima de toda la pantalla
      padding: '5px',        // Espaciado interno - CAMBIAR AQUÍ para más o menos espaciado
      color: 'white'          // Color de texto por defecto
    }}>
      
      {/* ========================================================================
          ENCABEZADO DE LA PÁGINA
          ======================================================================== */}
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: 'white' }}>
            Notas
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mt: 1 }}>
            {roleName === "Administrador"
              ? "Crea y administra tus notas personales"
              : "Consulta y gestiona tus notas"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: "400px" }}>
            <Paper
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: "30px",
                boxShadow: 3,
                width: "100%",
                height: "48px",
                backgroundColor: "#fff",
                border: "1px solid #444",
              }}
            >
              <IconButton type="submit" sx={{ p: "8px" }} color="primary">
                <SearchIcon sx={{ fontSize: "26px", color: "#aaa" }} />
              </IconButton>
              <InputBase
                sx={{ ml: 2, flex: 1, fontSize: "18px", color: "#000",  }}
                placeholder="Buscar una nota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Paper>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: "20px", color: "#F8820B", fontWeight: "bold" }}>{displayName}</Typography>
            <Typography variant="body2" sx={{ fontSize: "15px", color: "#ccc" }}>
              {roleName}
            </Typography>
          </Box>
          <IconButton
            aria-label="account of current user"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            sx={{ color: "#fff" }}
          >
            {usernameInitials ? (
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#ff4300",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {usernameInitials}
              </Avatar>
            ) : (
              <AccountCircle sx={{ fontSize: "60px" }} />
            )}
          </IconButton>
        </Grid>
      </Grid>

      {/* Menú de perfil */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Perfil</MenuItem>
        <MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
      </Menu>

      {/* Botón para agregar nueva nota */}
      <Grid container justifyContent="flex-end" sx={{ mb: 3 }}>
        <Button
          onClick={handleOpenModal}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#e67e22",
            color: "black",
            "&:hover": { backgroundColor: "#d35400", color: "white" },
            borderRadius: "8px",
            fontWeight: "bold",
            textTransform: "none",
            px: 3,
            py: 1.5,
            fontSize: "16px",
          }}
        >
          Añadir nueva nota
        </Button>
      </Grid>

      {/* ========================================================================
          MODAL PARA AGREGAR NUEVA NOTA
          ======================================================================== */}
      {/* Modal con el mismo estilo que el de soporte y ayuda */}
      <div style={styles.modal} onClick={handleCloseModal}>
        <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
          {/* Header del modal */}
          <div style={styles.modalHeader}>
            <button style={styles.backArrow} onClick={handleCloseModal}>
              ←
            </button>
            <div style={styles.modalTitle}>
              Crear una nueva nota
            </div>
          </div>
          
          <div style={styles.modalBody}>
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '0px' }}>
              {/* Campo de título */}
              <div style={{ width: '90%', margin: '0 auto', padding: '10px 0px' }}>
                <TextField 
                  variant='standard'
                  placeholder="Título de la nota..."
                  value={newNote.title}
                  onChange={(e) => {
                    if (e.target.value.length <= 50) {
                      setNewNote({ ...newNote, title: e.target.value });
                    }
                  }}
                  fullWidth
                  InputProps={{ 
                    disableUnderline: true,
                    style: { color: '#000', fontSize: '18px', fontWeight: 'bold' }
                  }}
                  helperText={`${newNote.title.length}/50 caracteres`}
                  FormHelperTextProps={{
                    style: { 
                      color: newNote.title.length > 45 ? '#f44336' : '#666', 
                      fontSize: '12px',
                      marginLeft: '10px'
                    }
                  }}
                />
              </div>
              <Divider sx={{ bgcolor: '#F8820B', height: 3, width: '100%', mt: 0 }} />
              
              {/* Campo de contenido */}
              <div style={{ padding: '15px 0', width: '95%', margin: '0 auto' }}>
                <TextField
                  multiline
                  rows={8}
                  placeholder="Escribe aquí el contenido de tu nota..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  fullWidth
                  variant="standard"
                  InputProps={{ 
                    disableUnderline: true,
                    style: { 
                      color: '#000', 
                      fontSize: '14px', 
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'  // Preservar saltos de línea
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '10px',
                      whiteSpace: 'pre-wrap',  // Preservar saltos de línea
                      wordWrap: 'break-word'   // Romper palabras largas
                    }
                  }}
                />
              </div>
              
              {/* Selector de categoría */}
              <div style={{ width: '95%', margin: '0 auto', paddingBottom: '15px' }}>
                <FormControl fullWidth variant="standard">
                  <InputLabel sx={{ color: '#666', fontSize: '14px' }}>Categoría</InputLabel>
                  <Select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    sx={{
                      color: '#000',
                      '& .MuiSelect-select': {
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        padding: '8px 12px'
                      }
                    }}
                  >
                    <MenuItem value="Curso">Curso</MenuItem>
                    <MenuItem value="Reporte">Reporte</MenuItem>
                    <MenuItem value="Soporte">Soporte</MenuItem>
                    <MenuItem value="Recordatorio">Recordatorio</MenuItem>
                    <MenuItem value="Productos">Productos</MenuItem>
                    <MenuItem value="Agradecimiento">Agradecimiento</MenuItem>
                    <MenuItem value="Nuevo">Nuevo</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            
            {/* Botón para guardar nota */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginRight: 18 }}>
              <Button
                variant="contained"
                onClick={handleAddNote}
                sx={{
                  backgroundColor: '#F8820B',
                  color: '#000',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  px: 3,
                  py: 1,
                  boxShadow: 'none',
                  mb: 2,
                  '&:hover': {
                    backgroundColor: '#e6740a'
                  }
                }}
              >
                Añadir nueva nota
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          LISTA DE NOTAS / ESTADO VACÍO
          ======================================================================== */}
      {notes.length === 0 ? (
        // ESTADO VACÍO - Cuando no hay notas
        <Box sx={{
          textAlign: 'center',    // Centrar contenido
          padding: '60px 20px',   // Espaciado interno - CAMBIAR AQUÍ
          color: '#666'           // Color del texto - CAMBIAR AQUÍ
        }}>
          <StickyNote2 sx={{ 
            fontSize: '80px',      // Tamaño del icono - CAMBIAR AQUÍ
            marginBottom: '20px'   // Espacio inferior - CAMBIAR AQUÍ
          }} />
          <Typography variant="h5" sx={{ marginBottom: '10px' }}>
            No tienes notas aún {/* CAMBIAR AQUÍ el texto */}
          </Typography>
          <Typography>
            Haz clic en "Añadir nueva nota" para crear tu primera nota {/* CAMBIAR AQUÍ el texto */}
          </Typography>
        </Box>
      ) : filteredNotes.length === 0 ? (
        // ESTADO SIN RESULTADOS DE BÚSQUEDA
        <Box sx={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <SearchIcon sx={{ 
            fontSize: '80px',
            marginBottom: '20px'
          }} />
          <Typography variant="h5" sx={{ marginBottom: '10px' }}>
            No se encontraron notas
          </Typography>
          <Typography>
            Intenta con otro término de búsqueda
          </Typography>
        </Box>
      ) : (
        // GRILLA DE NOTAS - Cuando hay notas para mostrar
        <Grid container spacing={3}> {/* CAMBIAR AQUÍ spacing para más o menos separación */}
          {filteredNotes.map(note => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={note.id}> {/* CAMBIAR AQUÍ las proporciones responsive */}
              <Card sx={{
                background: categoryColors[note.category] || '#F8820B', // Color según categoría
                borderRadius: '12px',        // Redondez de la tarjeta - CAMBIAR AQUÍ
                color: 'white',              // Color del texto
                position: 'relative',        // Para posicionar botones
                minHeight: '180px',          // Altura mínima - CAMBIAR AQUÍ
                display: 'flex',             // Flexbox para organizar contenido
                flexDirection: 'column',     // Dirección vertical
                justifyContent: 'space-between' // Separar contenido y botones
              }}>
                <CardContent sx={{ paddingBottom: '8px !important' }}>
                  
                  {/* MODO EDICIÓN vs MODO VISUALIZACIÓN */}
                  {editingNoteId === note.id ? (
                    // ============================================================
                    // MODO EDICIÓN - Formulario para editar nota
                    // ============================================================
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {/* CAMPO TÍTULO EN EDICIÓN */}
                      <TextField
                        fullWidth
                        value={editNote.title}
                        onChange={(e) => {
                          if (e.target.value.length <= 50) {
                            setEditNote({ ...editNote, title: e.target.value });
                          }
                        }}
                        sx={{
                          marginBottom: '10px',
                          '& .MuiInputBase-root': {
                            background: 'rgba(255, 255, 255, 0.2)', // Fondo transparente - CAMBIAR AQUÍ
                            color: 'black',    // Color del texto - CAMBIAR AQUÍ
                            fontWeight: 'bold' // Peso de la fuente - CAMBIAR AQUÍ
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)' // Color del borde - CAMBIAR AQUÍ
                            }
                          }
                        }}
                        helperText={`${editNote.title.length}/50 caracteres`}
                        FormHelperTextProps={{
                          style: { 
                            color: editNote.title.length > 45 ? '#f44336' : 'rgba(255, 255, 255, 0.7)', 
                            fontSize: '12px'
                          }
                        }}
                      />
                      
                      {/* CAMPO CONTENIDO EN EDICIÓN */}
                      <TextField
                        fullWidth
                        multiline
                        rows={3}  // Número de líneas - CAMBIAR AQUÍ
                        value={editNote.content}
                        onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                        sx={{
                          marginBottom: '10px',
                          flex: 1,
                          '& .MuiInputBase-root': {
                            background: 'rgba(255, 255, 255, 0.2)', // Fondo transparente - CAMBIAR AQUÍ
                            color: 'black', // Color del texto - CAMBIAR AQUÍ
                            whiteSpace: 'pre-wrap'  // Preservar saltos de línea
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)' // Color del borde - CAMBIAR AQUÍ
                            }
                          },
                          '& .MuiInputBase-input': {
                            whiteSpace: 'pre-wrap',  // Preservar saltos de línea
                            wordWrap: 'break-word'   // Romper palabras largas
                          }
                        }}
                      />
                      
                      {/* SELECTOR CATEGORÍA EN EDICIÓN */}
                      <FormControl fullWidth sx={{ marginBottom: '15px' }}>
                        <Select
                          value={editNote.category}
                          onChange={(e) => setEditNote({ ...editNote, category: e.target.value })}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)', // Fondo transparente - CAMBIAR AQUÍ
                            color: 'black', // Color del texto - CAMBIAR AQUÍ
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255, 255, 255, 0.3)' // Color del borde - CAMBIAR AQUÍ
                            }
                          }}
                        >
                          {/* OPCIONES DE CATEGORÍA - AGREGAR/QUITAR AQUÍ */}
                          <MenuItem value="Curso">Curso</MenuItem>
                          <MenuItem value="Reporte">Reporte</MenuItem>
                          <MenuItem value="Soporte">Soporte</MenuItem>
                          <MenuItem value="Recordatorio">Recordatorio</MenuItem>
                          <MenuItem value="Productos">Productos</MenuItem>
                          <MenuItem value="Agradecimiento">Agradecimiento</MenuItem>
                          <MenuItem value="Nuevo">Nuevo</MenuItem>
                        </Select>
                      </FormControl>
                      
                      {/* BOTONES DE EDICIÓN */}
                      <Box sx={{ display: 'flex', gap: '8px' }}> {/* CAMBIAR AQUÍ el gap */}
                        {/* BOTÓN GUARDAR EDICIÓN */}
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Save />}
                          onClick={handleSaveEdit}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)', // Fondo - CAMBIAR AQUÍ
                            color: 'black',        // Color del texto - CAMBIAR AQUÍ
                            borderRadius: '20px',  // Redondez - CAMBIAR AQUÍ
                            fontSize: '12px',      // Tamaño de letra - CAMBIAR AQUÍ
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.3)' // Hover - CAMBIAR AQUÍ
                            }
                          }}
                        >
                          Guardar {/* CAMBIAR AQUÍ el texto */}
                        </Button>
                        
                        {/* BOTÓN CANCELAR EDICIÓN */}
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={handleCancelEdit}
                          sx={{
                            color: 'black',       // Color del texto - CAMBIAR AQUÍ
                            borderColor: 'rgba(255, 255, 255, 0.3)', // Color del borde - CAMBIAR AQUÍ
                            borderRadius: '20px', // Redondez - CAMBIAR AQUÍ
                            fontSize: '12px',     // Tamaño de letra - CAMBIAR AQUÍ
                            '&:hover': {
                              borderColor: 'rgba(255, 255, 255, 0.5)' // Borde al hover - CAMBIAR AQUÍ
                            }
                          }}
                        >
                          Cancelar {/* CAMBIAR AQUÍ el texto */}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    // ============================================================
                    // MODO VISUALIZACIÓN - Mostrar contenido de la nota
                    // ============================================================
                    <>
                      {/* BOTONES DE ACCIÓN EN ESQUINA SUPERIOR DERECHA */}
                      <Box sx={{
                        position: 'absolute',
                        top: '10px',     // Posición desde arriba - CAMBIAR AQUÍ
                        right: '10px',   // Posición desde la derecha - CAMBIAR AQUÍ
                        display: 'flex',
                        gap: '5px'       // Separación entre botones - CAMBIAR AQUÍ
                      }}>
                        {/* BOTÓN EDITAR */}
                        <IconButton
                          size="small"
                          onClick={() => handleEditNote(note)}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)', // Fondo - CAMBIAR AQUÍ
                            color: 'black',  // Color del icono - CAMBIAR AQUÍ
                            width: '24px',   // Ancho - CAMBIAR AQUÍ
                            height: '24px',  // Alto - CAMBIAR AQUÍ
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.3)' // Hover - CAMBIAR AQUÍ
                            }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        
                        {/* BOTÓN ELIMINAR */}
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteNote(note.id)}
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)', // Fondo - CAMBIAR AQUÍ
                            color: 'black',  // Color del icono - CAMBIAR AQUÍ
                            width: '24px',   // Ancho - CAMBIAR AQUÍ
                            height: '24px',  // Alto - CAMBIAR AQUÍ
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.3)' // Hover - CAMBIAR AQUÍ
                            }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* CONTENIDO DE LA NOTA */}
                      <Box sx={{ 
                        paddingRight: '60px',  // CAMBIAR AQUÍ el padding
                        flex: 1,               // Ocupa todo el espacio disponible
                        display: 'flex',       // Flexbox para organizar contenido
                        flexDirection: 'column' // Dirección vertical
                      }}>
                        {/* TÍTULO DE LA NOTA */}
                        <Typography variant="h6" sx={{
                          color: 'black',        // Color del título - CAMBIAR AQUÍ
                          marginBottom: '10px',  // Espacio inferior - CAMBIAR AQUÍ
                          fontWeight: 'bold',    // Peso de la fuente - CAMBIAR AQUÍ
                          wordWrap: 'break-word', // Romper palabras largas
                          fontSize: '15px'
                        }}>
                          {note.title}
                        </Typography>
                        
                        {/* CONTENIDO DE LA NOTA */}
                        <Typography variant="body2" sx={{
                          color: 'black',        // Color del contenido - CAMBIAR AQUÍ
                          lineHeight: '1.4',     // Altura de línea - CAMBIAR AQUÍ
                          opacity: 0.8,          // Transparencia - CAMBIAR AQUÍ
                          wordWrap: 'break-word', // Romper palabras largas
                          overflowWrap: 'break-word', // Romper palabras si es necesario
                          whiteSpace: 'pre-wrap', // Preservar saltos de línea y espacios
                          wordBreak: 'break-word', // Romper palabras largas
                          display: 'block',       // Asegurar que se muestre como bloque
                          flex: 1, // Ocupa todo el espacio disponible
                          fontSize: '15px'
                        }}>
                          {note.content}
                        </Typography>
                      </Box>

                      {/* PARTE INFERIOR DE LA TARJETA - PEGADA HASTA ABAJO */}
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between', // Separar botón y fecha
                        alignItems: 'center',
                        marginTop: 'auto',               // Empujar hacia abajo
                        paddingTop: '10px'               // Espacio superior - CAMBIAR AQUÍ
                      }}>
                        {/* BOTÓN DE CATEGORÍA */}
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            background: 'rgba(255, 255, 255, 0.2)', // Fondo - CAMBIAR AQUÍ
                            color: 'black',        // Color del texto - CAMBIAR AQUÍ
                            borderRadius: '20px',  // Redondez - CAMBIAR AQUÍ
                            fontSize: '12px',      // Tamaño de letra - CAMBIAR AQUÍ
                            fontWeight: 'bold',    // Peso de la fuente - CAMBIAR AQUÍ
                            cursor: 'default',     // Sin cursor de click
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.2)' // Sin cambio al hover
                            }
                          }}
                        >
                          {note.category}
                        </Button>
                        
                        {/* FECHA DE CREACIÓN */}
                        <Typography variant="caption" sx={{
                          color: 'rgba(0, 0, 0, 0.6)', // Color de la fecha - CAMBIAR AQUÍ
                          fontSize: '11px'              // Tamaño de letra - CAMBIAR AQUÍ
                        }}>
                          {note.createdAt}
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

