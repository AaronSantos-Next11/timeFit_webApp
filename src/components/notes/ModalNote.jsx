import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  Paper,
  Avatar,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import {
  StickyNote2 as StickyNote2Icon,
  Close as CloseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  NotificationImportant as NotificationImportantIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  ModelTraining as ModelTrainingIcon,
  Inventory as InventoryIcon,
  SupportAgent as SupportAgentIcon,
  ReportProblem as ReportProblemIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

const categories = [
  { 
    value: 'nota', 
    label: 'Nota', 
    borderColor: '#e67d22ff',
    icon: 'StickyNote2Icon'
  },
  { 
    value: 'recordatorio', 
    label: 'Recordatorio', 
    borderColor: '#d81b60',
    icon: 'NotificationImportantIcon'
  },
  { 
    value: 'reporte', 
    label: 'Reporte', 
    borderColor: '#f1c40fcb',
    icon: 'AssessmentIcon'
  },
  { 
    value: 'curso', 
    label: 'Curso', 
    borderColor: '#8873acff',
    icon: 'SchoolIcon'
  },
  { 
    value: 'capacitacion', 
    label: 'Capacitacion', 
    borderColor: '#2c84beff',
    icon: 'ModelTrainingIcon'
  },
  { 
    value: 'productos', 
    label: 'Productos', 
    borderColor: '#5adc39a4',
    icon: 'InventoryIcon'
  },
  { 
    value: 'soporte', 
    label: 'Soporte', 
    borderColor: '#15a084ff',
    icon: 'SupportAgentIcon'
  },
  { 
    value: 'quejas', 
    label: 'Quejas', 
    borderColor: '#e74c3c',
    icon: 'ReportProblemIcon'
  }
];

// Función para obtener el componente de icono
const getIconComponent = (iconName) => {
  const iconMap = {
    'StickyNote2Icon': StickyNote2Icon,
    'NotificationImportantIcon': NotificationImportantIcon,
    'AssessmentIcon': AssessmentIcon,
    'SchoolIcon': SchoolIcon,
    'ModelTrainingIcon': ModelTrainingIcon,
    'InventoryIcon': InventoryIcon,
    'SupportAgentIcon': SupportAgentIcon,
    'ReportProblemIcon': ReportProblemIcon
  };
  return iconMap[iconName] || CategoryIcon;
};

const ModalNote = ({ open, onClose, noteId, onGuardadoExitoso }) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'nota'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Validación del formulario
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (form.title.length > 100) {
      newErrors.title = 'El título no puede exceder 100 caracteres';
    }
    if (!form.content.trim()) {
      newErrors.content = 'El contenido es requerido';
    }
    if (form.content.length > 2000) {
      newErrors.content = 'El contenido no puede exceder 2000 caracteres';
    }
    if (!form.category) {
      newErrors.category = 'La categoría es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cargar datos de la nota a editar
  useEffect(() => {
    if (noteId && open) {
      setLoading(true);
      fetch(`${API}/api/notes/${noteId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error al obtener la nota');
          }
          return res.json();
        })
        .then((data) => {
          if (data.note) {
            setForm({
              title: data.note.title || '',
              content: data.note.content || '',
              category: data.note.category || 'nota'
            });
          }
        })
        .catch((err) => {
          console.error("Error al obtener nota:", err);
          alert("Error al cargar la nota");
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (open) {
      // Reset form para nueva nota
      setForm({
        title: '',
        content: '',
        category: 'nota'
      });
    }
    setErrors({});
  }, [noteId, open, API, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo que se está editando
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = async () => {
  if (!validate()) return;

  setLoading(true);

  try {
    const url = noteId ? "/api/notes/update" : "/api/notes/create";
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      ...(noteId && { id: noteId })
    };

    const response = await fetch(`${API}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Manejar errores específicos del backend
      alert(data.message || "Error al guardar la nota");
      return;
    }

    // ✅ SOLO notificar éxito al componente padre (NO enviar data)
    if (onGuardadoExitoso) {
      onGuardadoExitoso(); // Sin parámetros
    }

    // Cerrar modal
    onClose();

  } catch (err) {
    console.error("Error al guardar nota:", err);
    alert("Error de conexión. Intenta de nuevo.");
  } finally {
    setLoading(false);
  }
};

  const selectedCategory = categories.find(cat => cat.value === form.category);
  const CategoryIconComponent = getIconComponent(selectedCategory?.icon);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: '#1a1a1a',
          borderRadius: '16px',
          border: '1px solid #333',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }
      }}
    >
      {/* Header del modal */}
      <DialogTitle sx={{ 
        bgcolor: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
        color: '#fff',
        p: 0,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          background: '#FF6600',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'relative'
        }}>
          <Avatar sx={{ 
            bgcolor: 'rgba(255,255,255,0.2)', 
            color: 'rgba(14, 14, 14, 1)',
            width: 48,
            height: 48
          }}>
            <StickyNote2Icon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black' }}>
              {noteId ? 'Editar Nota' : 'Nueva Nota'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(3, 3, 3, 0.8)', fontWeight: 'bold' }}>
              {noteId ? 'Modificar los datos de la nota' : 'Crear una nueva nota para guarda tus ideas creativas o recordatorios importantes'}
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        bgcolor: '#1a1a1a', 
        color: '#fff',
        p: 3
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography sx={{ color: '#F8820B' }}>Cargando...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Información General */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 2, 
                bgcolor: '#2a2a2a', 
                borderRadius: '12px',
                border: '1px solid #333'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TitleIcon sx={{ color: '#F8820B' }} />
                  <Typography variant="h6" sx={{ color: '#F8820B', fontWeight: 'bold' }}>
                    Información General
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography sx={{ color: '#F8820B', fontWeight: '600', mb: 1 }}>
                      Título de la Nota
                    </Typography>
                    <TextField
                      fullWidth
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      error={!!errors.title}
                      helperText={errors.title}
                      placeholder="Ej: Rutina de entrenamiento para principiantes"
                      disabled={loading}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#fff',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: '#e0e0e0' },
                          '&:hover fieldset': { borderColor: '#F8820B' },
                          '&.Mui-focused fieldset': { borderColor: '#F8820B' }
                        },
                        '& .MuiInputBase-input': { color: '#000' }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography sx={{ color: '#F8820B', fontWeight: '600', mb: 1 }}>
                      Categoría
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      error={!!errors.category}
                      helperText={errors.category}
                      disabled={loading}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          bgcolor: '#fff',
                          borderRadius: '8px',
                          '& fieldset': { borderColor: '#e0e0e0' },
                          '&:hover fieldset': { borderColor: '#F8820B' },
                          '&.Mui-focused fieldset': { borderColor: '#F8820B' }
                        }
                      }}
                    >
                      {categories.map((cat) => {
                        const IconComponent = getIconComponent(cat.icon);
                        return (
                          <MenuItem key={cat.value} value={cat.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: '50%', 
                                bgcolor: cat.borderColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}>
                                <IconComponent sx={{ fontSize: 14, color: '#fff' }} />
                              </Box>
                              {cat.label}
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Contenido */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 2, 
                bgcolor: '#2a2a2a', 
                borderRadius: '12px',
                border: '1px solid #333'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DescriptionIcon sx={{ color: '#F8820B' }} />
                  <Typography variant="h6" sx={{ color: '#F8820B', fontWeight: 'bold' }}>
                    Contenido de la Nota
                  </Typography>
                </Box>
                
                <Typography sx={{ color: '#F8820B', fontWeight: '600', mb: 1 }}>
                  Descripción
                </Typography>
                <TextField
                  fullWidth
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  error={!!errors.content}
                  helperText={errors.content}
                  multiline
                  rows={6}
                  placeholder="Escribe aquí el contenido de tu nota para la administración del gimnasio..."
                  disabled={loading}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#fff',
                      borderRadius: '8px',
                      '& fieldset': { borderColor: '#e0e0e0' },
                      '&:hover fieldset': { borderColor: '#F8820B' },
                      '&.Mui-focused fieldset': { borderColor: '#F8820B' }
                    },
                    '& .MuiInputBase-input': { color: '#000' }
                  }}
                />
              </Paper>
            </Grid>

            {/* Vista Previa */}
            {form.title && form.content && (
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: '#2a2a2a', 
                  borderRadius: '12px',
                  border: '1px solid #333'
                }}>
                  <Typography variant="h6" sx={{ color: '#F8820B', fontWeight: 'bold', mb: 2 }}>
                    Vista Previa
                  </Typography>
                  
                  {/* Card Preview - Mimicking CardNote component style */}
                  <Box
                    sx={{
                      width: '100%',
                      minHeight: 320,
                      maxHeight: 420,
                      backgroundColor: 'linear-gradient(135deg, #404040 0%, #353535 100%)',
                      backgroundImage: 'linear-gradient(135deg, #404040 0%, #353535 100%)',
                      borderLeft: `8px solid ${selectedCategory?.borderColor}`,
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'visible',
                      boxShadow: `
                        0 4px 20px rgba(0,0,0,0.25),
                        0 2px 8px rgba(0,0,0,0.15),
                        inset 0 1px 0 rgba(255,255,255,0.1)
                      `,
                      transform: 'rotate(-0.5deg)',
                      transformOrigin: 'center center',
                    }}
                  >
                    {/* Cinta adhesiva superior */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%) rotate(1deg)',
                        width: 80,
                        height: 24,
                        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                        borderRadius: '4px',
                        boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                        zIndex: 2,
                        border: '1px solid rgba(0,0,0,0.1)',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '70%',
                          height: '2px',
                          background: 'rgba(0,0,0,0.1)',
                          borderRadius: '1px',
                        }
                      }}
                    />

                    {/* Header con icono y título */}
                    <Box
                      sx={{
                        p: 3,
                        pb: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 52,
                          height: 52,
                          bgcolor: selectedCategory?.borderColor,
                          color: '#fff',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                          flexShrink: 0,
                        }}
                      >
                        <CategoryIconComponent sx={{ fontSize: 26 }} />
                      </Avatar>
                      
                      <Box sx={{ flex: 1, pr: 8 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            lineHeight: 1.3,
                            minHeight: '52px',
                            maxHeight: '52px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word',
                            fontFamily: '"Inter", "Roboto", sans-serif',
                          }}
                        >
                          {form.title}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Contenido */}
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#ffffff',
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          marginBottom: 3,
                          minHeight: '120px',
                          maxHeight: '150px',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 6,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                          fontFamily: '"Inter", "Roboto", sans-serif',
                          fontWeight: 400,
                        }}
                      >
                        {form.content}
                      </Typography>

                      <Divider sx={{ 
                        borderColor: `${selectedCategory?.borderColor}40`,
                        mb: 2.5,
                        opacity: 0.7
                      }} />

                      {/* Footer */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                        }}
                      >
                        {/* Categoría */}
                        <Chip
                          label={selectedCategory?.label || 'Sin categoría'}
                          size="small"
                          sx={{
                            backgroundColor: selectedCategory?.borderColor,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: '28px',
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            '& .MuiChip-label': {
                              px: 2,
                            },
                          }}
                        />

                        {/* Fecha */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          bgcolor: 'rgba(0,0,0,0.3)',
                          px: 2.5,
                          py: 1.2,
                          borderRadius: 3,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          border: `2px solid ${selectedCategory?.borderColor}40`,
                          backdropFilter: 'blur(8px)',
                        }}>
                          <CalendarTodayIcon 
                            sx={{ 
                              color: selectedCategory?.borderColor, 
                              fontSize: 16 
                            }} 
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#ffffff',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              fontFamily: '"Inter", "Roboto", sans-serif',
                            }}
                          >
                            {new Date().toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Líneas sutiles de papel */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 120,
                        left: 24,
                        right: 24,
                        bottom: 80,
                        background: `repeating-linear-gradient(
                          transparent,
                          transparent 23px,
                          ${selectedCategory?.borderColor}20 23px,
                          ${selectedCategory?.borderColor}20 24px
                        )`,
                        pointerEvents: 'none',
                        opacity: 0.4,
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        bgcolor: '#1a1a1a', 
        p: 3,
        borderTop: '1px solid #333'
      }}>
        <Button 
          onClick={onClose}
          disabled={loading}
          sx={{ 
            color: '#FF6600',
            borderColor: '#FF6600',
            '&:hover': { 
              borderColor: '#FF6600', 
              bgcolor: '#FF6600', 
              color: '#fff', 
              fontWeight: 'bold'
            }
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          variant="contained"
          startIcon={noteId ? <EditIcon /> : <AddIcon />}
          sx={{ 
            background: '#F8820B',
            color: 'black',
            fontWeight: 'bold',
            px: 3,
            borderRadius: '8px',
            '&:hover': { 
              borderColor: '#FF6600', 
              bgcolor: '#FF6600', 
              color: 'black', 
              fontWeight: 'bold'
            },
            '&:disabled': {
              bgcolor: '#ccc',
              color: '#666'
            }
          }}
        >
          {loading ? 'Guardando...' : (noteId ? 'Actualizar' : 'Guardar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalNote.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  noteId: PropTypes.string, // ID de la nota para editar (null/undefined para nueva nota)
  onGuardadoExitoso: PropTypes.func.isRequired, // Callback cuando se guarda exitosamente
};

export default ModalNote;