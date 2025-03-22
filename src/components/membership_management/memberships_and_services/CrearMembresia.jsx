import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importar PropTypes
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  InputAdornment,
  Collapse
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ImageIcon from '@mui/icons-material/Image';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const CrearMembresia = () => {
  const [servicios] = useState([
    { id: 1, nombre: 'Asesoría Nutricional', categoria: 'Nutrición', duracion: '1 sesión', seleccionado: true },
  ]);

  const [imagenURL, setImagenURL] = useState('');
  const [mostrarPastePrompt, setMostrarPastePrompt] = useState(false);
  const [colorMembresia, setColorMembresia] = useState('#FF8C00');
  const [hexInput, setHexInput] = useState('#FF8C00');
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Estado para opciones de precio
  const [opcionesPrecio, setOpcionesPrecio] = useState([
    { id: 1, tipo: 'Nueva Opcion', precio: '0', periodo: '1', unidadTiempo: 'mes', expandido: false },
  ]);

  // Manejador para copiar/pegar imagen
  useEffect(() => {
    const handlePaste = (e) => {
      if (!mostrarPastePrompt) return;
      
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagenURL(e.target.result);
            setMostrarPastePrompt(false);
          };
          reader.readAsDataURL(blob);
          break;
        } else if (item.type === 'text/plain') {
          item.getAsString((url) => {
            if (isValidImageUrl(url)) {
              setImagenURL(url);
              setMostrarPastePrompt(false);
            }
          });
        }
      }
    };

    if (mostrarPastePrompt) {
      document.addEventListener('paste', handlePaste);
    }

    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [mostrarPastePrompt]);

  // Validación simple de URL de imagen
  const isValidImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null || url.startsWith('data:image/');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagenURL(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validar y formatear entrada de color hexadecimal
  const handleHexInputChange = (e) => {
    let value = e.target.value;
    setHexInput(value);
    
    // Validar formato hexadecimal
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      setColorMembresia(value);
    }
  };

  // Actualizar input hex cuando cambia el color picker
  const handleColorPickerChange = (e) => {
    const value = e.target.value;
    setColorMembresia(value);
    setHexInput(value);
  };

  // Manejar expansión de opción de precio
  const toggleExpandOption = (optionId) => {
    setOpcionesPrecio(prevOptions => 
      prevOptions.map(option => 
        option.id === optionId 
          ? {...option, expandido: !option.expandido} 
          : option
      )
    );
  };

  // Manejar cambios en los inputs de las opciones de precio
  const handleOpcionChange = (optionId, field, value) => {
    setOpcionesPrecio(prevOptions => 
      prevOptions.map(option => 
        option.id === optionId 
          ? {...option, [field]: value} 
          : option
      )
    );
  };

  // Añadir nueva opción de precio
  const addNuevaOpcion = () => {
    const newId = opcionesPrecio.length > 0 
      ? Math.max(...opcionesPrecio.map(o => o.id)) + 1 
      : 1;
    
    const nuevaOpcion = {
      id: newId,
      tipo: '',
      precio: '',
      periodo: '',
      unidadTiempo: 'mes',
      expandido: true
    };
    
    setOpcionesPrecio([...opcionesPrecio, nuevaOpcion]);
  };

  // Eliminar opción de precio
  const deleteOpcion = (optionId) => {
    setOpcionesPrecio(prevOptions => 
      prevOptions.filter(option => option.id !== optionId)
    );
  };

  const OpcionPrecio = ({ option }) => {
    const [temporalTipo, setTemporalTipo] = useState(option.tipo);
    const [temporalPrecio, setTemporalPrecio] = useState(option.precio);
    const [temporalPeriodo, setTemporalPeriodo] = useState(option.periodo);

    const handleBlur = (field) => {
      handleOpcionChange(option.id, field, field === 'tipo' ? temporalTipo : field === 'precio' ? temporalPrecio : temporalPeriodo);
    };

    return (
      <Box sx={{ mb: 2 }}>
        <Box 
          sx={{ 
            backgroundColor: '#444', 
            borderRadius: 1, 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={() => toggleExpandOption(option.id)}
              sx={{ color: '#FFF', p: 0, mr: 1 }}
            >
              {option.expandido ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <Typography sx={{ color: 'white' }}>
              {option.tipo || "Nueva opción"}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: "#F8820B" }}>
              {option.precio ? `$${option.precio} MXN por ${option.periodo} ${option.unidadTiempo}` : "Configurar precio"}
            </Typography>
            <IconButton 
              onClick={() => deleteOpcion(option.id)}
              sx={{ color: '#FFF', ml: 1 }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Collapse in={option.expandido}>
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#333', 
            border: '1px solid #444',
            borderTop: 0,
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, fontSize: 14, color: '#aaa' }}>
                  NOMBRE DEL PAGO
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Mensual, Trimestral, etc."
                  value={temporalTipo}
                  onChange={(e) => setTemporalTipo(e.target.value)}
                  onBlur={() => handleBlur('tipo')}
                  variant="outlined"
                  InputProps={{
                    sx: { 
                      bgcolor: 'white',
                      borderRadius: 1
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ mb: 1, fontSize: 14, color: '#aaa' }}>
                  COSTO ($MXN)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="$ 950"
                  value={temporalPrecio}
                  onChange={(e) => setTemporalPrecio(e.target.value)}
                  onBlur={() => handleBlur('precio')}
                  variant="outlined"
                  InputProps={{
                    sx: { 
                      bgcolor: 'white',
                      borderRadius: 1
                    }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ mb: 1, fontSize: 14, color: '#aaa' }}>
                  PAGOS | TIEMPO
                </Typography>
                <TextField
                  fullWidth
                  placeholder="1"
                  value={temporalPeriodo}
                  onChange={(e) => setTemporalPeriodo(e.target.value)}
                  onBlur={() => handleBlur('periodo')}
                  variant="outlined"
                  InputProps={{
                    sx: { 
                      bgcolor: 'white',
                      borderRadius: 1,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ mb: 1, fontSize: 14, color: '#aaa' }}>
                  &nbsp;
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={option.unidadTiempo}
                  onChange={(e) => handleOpcionChange(option.id, 'unidadTiempo', e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  InputProps={{
                    sx: { 
                      bgcolor: 'white',
                      borderRadius: 1
                    }
                  }}
                >
                  <option value="mes">mes</option>
                  <option value="día">día</option>
                  <option value="año">año</option>
                  <option value="semana">semana</option>
                  <option value="quincena">quincena</option>

                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>
    );
  };

  // Validación de PropTypes para OpcionPrecio
  OpcionPrecio.propTypes = {
    option: PropTypes.shape({
      id: PropTypes.number.isRequired,
      tipo: PropTypes.string.isRequired,
      precio: PropTypes.string.isRequired,
      periodo: PropTypes.string.isRequired,
      unidadTiempo: PropTypes.string.isRequired,
      expandido: PropTypes.bool.isRequired,
    }).isRequired,
  };

  return (
    <Paper 
      sx={{ 
        maxWidth: '100%', 
        bgcolor: '#333', 
        borderRadius: 3,
        p: 2,
        color: 'white'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: "#F8820B", 
          p: 2, 
          borderRadius: 2,
          mb: 3
        }}
      >
        <IconButton component={Link} to="/membership_management/memberships" sx={{ mr: 2, color: 'black' }}>
          <ArrowBackIcon/>
        </IconButton>
        <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
          Registra una nueva membresía para tus usuarios.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: 'bold' }}>
              Nombre de la Membresía
            </Typography>
            <TextField
              fullWidth
              placeholder="Ingresa el nombre de la membresía"
              variant="outlined"
              InputProps={{
                sx: { 
                  bgcolor: 'white',
                  borderRadius: 1
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: 'bold' }}>
              Descripción
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Describe los beneficios y características de la membresía"
              variant="outlined"
              InputProps={{
                sx: { 
                  bgcolor: 'white',
                  borderRadius: 1
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: 'bold' }}>
              Color de la Membresía
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="input"
                type="color"
                value={colorMembresia}
                onChange={handleColorPickerChange}
                sx={{ 
                  width: 40, 
                  height: 40, 
                  border: 'none',
                  borderRadius: 1,
                  cursor: 'pointer',
                  p: 0
                }}
              />
              <TextField
                placeholder="Código hexadecimal"
                value={hexInput}
                onChange={handleHexInputChange}
                sx={{ width: 150 }}
                InputProps={{
                  sx: { 
                    bgcolor: 'white',
                    borderRadius: 1
                  }
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: 'bold'  }}>
              Precios y duraciones
            </Typography>
            
            {opcionesPrecio.map(option => (
              <OpcionPrecio key={option.id} option={option} />
            ))}
            
            <Button 
              startIcon={<AddCircleOutlineIcon />} 
              onClick={addNuevaOpcion}
              sx={{ 
                color: "#F8820B",
                mb: 2
              }}
            >
              Añadir otra opción
            </Button>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: 'bold' }}>
              Cantidad de Usuarios
            </Typography>
            <TextField
              fullWidth
              placeholder="Ingresa la cantidad de usuarios (individual, grupal, etc.)"
              variant="outlined"
              InputProps={{
                sx: { 
                  bgcolor: 'white',
                  borderRadius: 1
                }
              }}
            />
          </Box>

          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: "#F8820B", 
              color: 'black', 
              fontWeight: 'bold',
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Registrar membresía
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: 'bold' }}>
              Imagen representativa de la membresía
            </Typography>
            
            {/* Área de imagen */}
            <Box
              ref={dropAreaRef}
              onClick={() => {
                if (!imagenURL) {
                  setMostrarPastePrompt(true);
                }
              }}
              sx={{ 
                width: '100%', 
                height: 250,
                borderRadius: 2,
                border: '2px dashed #777',
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                bgcolor: '#444',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              {imagenURL ? (
                <Box
                  component="img"
                  src={imagenURL}
                  alt="Imagen de la membresía"
                  sx={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : mostrarPastePrompt ? (
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <ContentPasteIcon sx={{ fontSize: 50, color: '#aaa', mb: 1 }} />
                  <Typography color="#ddd" sx={{ fontWeight: 'bold' }}>
                    Pega la imagen o URL (Ctrl+V)
                  </Typography>
                  <Typography color="#999" sx={{ fontSize: 14 }}>
                    Haz clic en cualquier otro lugar para cancelar
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <ImageIcon sx={{ fontSize: 50, color: '#777', mb: 1 }} />
                  <Typography color="#999">
                    Selecciona una imagen para representar la membresía
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Opciones de carga de imagen */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Button 
                variant="contained"
                component="label"
                startIcon={<FileUploadIcon />}
                sx={{ 
                  bgcolor: '#444',
                  '&:hover': {
                    bgcolor: '#555'
                  }
                }}
              >
                SUBIR ARCHIVO
                <input 
                  ref={fileInputRef}
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography sx={{ color: "#F8820B", fontWeight: 'bold' }}>
                Servicios
              </Typography>
              <ExpandMoreIcon />
            </Box>
            
            <TextField
              fullWidth
              placeholder="Buscar un servicio, membresía..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { 
                  bgcolor: 'white',
                  borderRadius: 2,
                  mb: 2
                }
              }}
            />

            <TableContainer component={Paper} sx={{ bgcolor: '#444', mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ borderBottom: `2px solid ${"#F8820B"}`, color: 'white' }}>Nombre del servicio</TableCell>
                    <TableCell sx={{ borderBottom: `2px solid ${"#F8820B"}`, color: 'white' }}>Categoría</TableCell>
                    <TableCell sx={{ borderBottom: `2px solid ${"#F8820B"}`, color: 'white' }}>Duración</TableCell>
                    <TableCell sx={{ borderBottom: `2px solid ${"#F8820B"}`, width: 60 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {servicios.map((servicio) => (
                    <TableRow key={servicio.id}>
                      <TableCell sx={{ color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox 
                            checked={servicio.seleccionado} 
                            sx={{ 
                              color: "#F8820B",
                              '&.Mui-checked': {
                                color: "#F8820B",
                              }
                            }}
                          />
                          {servicio.nombre}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>{servicio.categoria}</TableCell>
                      <TableCell sx={{ color: 'white' }}>{servicio.duracion}</TableCell>
                      <TableCell>
                        <IconButton size="small" sx={{ color: "#F8820B" }}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Button 
              startIcon={<AddCircleOutlineIcon />} 
              sx={{ 
                color: "#F8820B",
              }}
            >
              Añadir más servicios
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CrearMembresia;