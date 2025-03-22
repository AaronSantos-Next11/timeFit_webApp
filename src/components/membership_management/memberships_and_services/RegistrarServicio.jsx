import React, { useState, useRef, useEffect } from "react";
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
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Link } from "react-router-dom";

const RegistrarServicio = () => {
  // Estados para los campos del formulario
  const [nombreServicio, setNombreServicio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [costo, setCosto] = useState("");
  const [duracionValor, setDuracionValor] = useState("");
  const [duracionUnidad, setDuracionUnidad] = useState("Sesion");
  const [capacidad, setCapacidad] = useState("");
  const [estado, setEstado] = useState("Activo");

  // Nuevos estados para campos adicionales
  const [descuento, setDescuento] = useState("");
  const [cargosAdicionales, setCargosAdicionales] = useState("");

  // Estados para manejo de imagen
  const [imagenURL, setImagenURL] = useState("");
  const [mostrarPastePrompt, setMostrarPastePrompt] = useState(false);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Calcular valores para el resumen - LÓGICA MODIFICADA SIN IVA
  const calcularResumen = () => {
    const costoNumerico = parseFloat(costo) || 0;
    const descuentoNumerico = parseFloat(descuento) || 0;
    const cargosAdicionalesNumerico = parseFloat(cargosAdicionales) || 0;

    // Subtotal 
    const subtotal = Math.max(costoNumerico - descuentoNumerico, 0); // Evitar valores negativos
    
    // Total final con cargos adicionales
    const total = subtotal + cargosAdicionalesNumerico;

    return [
      { descripcion: "Costo del Servicio:", cantidad: `$${costoNumerico.toFixed(2)} MXN` },
      { descripcion: "Descuento Aplicado:", cantidad: `$${descuentoNumerico.toFixed(2)} MXN` },
      { descripcion: "Subtotal:", cantidad: `$${subtotal.toFixed(2)} MXN` },
      { descripcion: "Cargos Adicionales:", cantidad: `$${cargosAdicionalesNumerico.toFixed(2)} MXN` },
      { descripcion: "Costo Total:", cantidad: `$${total.toFixed(2)} MXN`, destacado: true },
    ];
  };

  // Datos de resumen para mostrar en la tabla
  const resumenData = calcularResumen();

  // Efecto para manejar el pegado de imágenes (ctrl+v)
  useEffect(() => {
    const handlePaste = (e) => {
      if (!mostrarPastePrompt) return;

      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagenURL(e.target.result);
            setMostrarPastePrompt(false);
          };
          reader.readAsDataURL(blob);
          break;
        } else if (item.type === "text/plain") {
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
      document.addEventListener("paste", handlePaste);
    }

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [mostrarPastePrompt]);

  // Validación simple de URL de imagen
  const isValidImageUrl = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null || url.startsWith("data:image/");
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

  // Función para determinar el color de fondo según el estado seleccionado
  const getBackgroundColor = (estado) => {
    switch (estado) {
      case "Activo":
        return "#BCEB9F"; // Verde claro
      case "Inactivo":
        return "#FF9B9B"; // Rojo claro
      case "Pendiente":
        return "#FFD699"; // Amarillo claro
      default:
        return "#BCEB9F"; // Color por defecto
    }
  };

  // Manejar clic en cualquier lugar para cerrar el prompt de pegar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropAreaRef.current && !dropAreaRef.current.contains(event.target) && mostrarPastePrompt) {
        setMostrarPastePrompt(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarPastePrompt]);

  return (
    <Paper
      sx={{
        maxWidth: "100%",
        bgcolor: "#333",
        borderRadius: 3,
        p: 2,
        color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F8820B",
          p: 2,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <IconButton component={Link} to="/membership_management/memberships" sx={{ mr: 2, color: "black" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>
          Registrar un nuevo servicio a tu gimnasio.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Nombre de la Membresía</Typography>
            <TextField
              fullWidth
              value={nombreServicio}
              onChange={(e) => setNombreServicio(e.target.value)}
              variant="outlined"
              placeholder="Ingresa el nombre del servicio"
              InputProps={{
                sx: {
                  bgcolor: "white",
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Descripción</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              variant="outlined"
              placeholder="Ingresa la descripcion del servicio"
              InputProps={{
                sx: {
                  bgcolor: "white",
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Categoría</Typography>
            <TextField
              fullWidth
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              variant="outlined"
              placeholder="Ingresa una categoria del servicio"
              InputProps={{
                sx: {
                  bgcolor: "white",
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Costo (MXN)</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TextField
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                variant="outlined"
                placeholder="Ingresar el precio del servicio (MXM)"
                sx={{ width: "70%" }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  sx: {
                    bgcolor: "white",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Nuevo campo para Descuento */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Descuento Aplicado (MXN)</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TextField
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
                variant="outlined"
                placeholder="Ingresa el descuento a aplicar"
                sx={{ width: "70%" }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  sx: {
                    bgcolor: "white",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Nuevo campo para Cargos Adicionales */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Cargos Adicionales (MXN)</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TextField
                value={cargosAdicionales}
                onChange={(e) => setCargosAdicionales(e.target.value)}
                variant="outlined"
                placeholder="Ingresa cargos adicionales si aplican"
                sx={{ width: "70%" }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  sx: {
                    bgcolor: "white",
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Duración</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TextField
                value={duracionValor}
                onChange={(e) => setDuracionValor(e.target.value)}
                variant="outlined"
                placeholder="1"
                sx={{ width: "30%", mr: 1 }}
                InputProps={{
                  sx: {
                    bgcolor: "white",
                    borderRadius: 1,
                  },
                }}
              />
              <FormControl variant="outlined" sx={{ width: "40%" }}>
                <Select
                  value={duracionUnidad}
                  onChange={(e) => setDuracionUnidad(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 1,
                  }}
                >
                  <MenuItem value="Sesion">Sesion</MenuItem>
                  <MenuItem value="Hora">Hora</MenuItem>
                  <MenuItem value="Minuto">Minuto</MenuItem>
                  <MenuItem value="Día">Día</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Capacidad</Typography>
            <TextField
              fullWidth
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              variant="outlined"
              placeholder="Ingresa la capacidad que tendra el servicio"
              InputProps={{
                sx: {
                  bgcolor: "white",
                  borderRadius: 1,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>Estado</Typography>
            <FormControl variant="outlined" sx={{ width: "40%" }}>
              <Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                sx={{
                  bgcolor: getBackgroundColor(estado), // Color dinámico según el estado
                  borderRadius: 2,
                  color: "black",
                  fontWeight: "bold",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                }}
              >
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
              Imagen representativa del servicio
            </Typography>

            {/* Área de imagen mejorada para poder usar Ctrl+V */}
            <Box
              ref={dropAreaRef}
              onClick={() => {
                if (!imagenURL) {
                  setMostrarPastePrompt(true);
                }
              }}
              sx={{
                width: "100%",
                height: 340,
                borderRadius: 2,
                border: "2px dashed #777",
                mb: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                bgcolor: "#444",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {imagenURL ? (
                <Box
                  component="img"
                  src={imagenURL}
                  alt="Imagen del servicio"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              ) : mostrarPastePrompt ? (
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <ContentPasteIcon sx={{ fontSize: 50, color: "#aaa", mb: 1 }} />
                  <Typography color="#ddd" sx={{ fontWeight: "bold" }}>
                    Pega la imagen o URL (Ctrl+V)
                  </Typography>
                  <Typography color="#999" sx={{ fontSize: 14 }}>
                    Haz clic en cualquier otro lugar para cancelar
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <ImageIcon sx={{ fontSize: 50, color: "#777", mb: 1 }} />
                  <Typography color="#999">Selecciona una imagen para representar el servicio</Typography>
                </Box>
              )}
            </Box>

            {/* Opciones de carga de imagen */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<FileUploadIcon />}
                sx={{
                  bgcolor: "#444",
                  "&:hover": {
                    bgcolor: "#555",
                  },
                }}
              >
                SUBIR ARCHIVO
                <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileUpload} />
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ mb: 2, color: "#F8820B", fontWeight: "bold" }}>Resumen del pago</Typography>

            <TableContainer component={Paper} sx={{ bgcolor: "#444", borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #555",
                        color: "#F8820B",
                        fontWeight: "bold",
                        borderTopLeftRadius: 8,
                      }}
                    >
                      Descripciones
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #555",
                        color: "#F8820B",
                        fontWeight: "bold",
                        textAlign: "right",
                        borderTopRightRadius: 8,
                      }}
                    >
                      Cantidades
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resumenData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{
                          borderBottom: index === resumenData.length - 1 ? "none" : "1px solid #555",
                          color: "white",
                          py: 1,
                        }}
                      >
                        {item.descripcion}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: index === resumenData.length - 1 ? "none" : "1px solid #555",
                          color: item.destacado ? "#F8820B" : "white",
                          fontWeight: item.destacado ? "bold" : "normal",
                          textAlign: "right",
                          py: 1,
                        }}
                      >
                        {item.cantidad}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#F8820B",
                  color: "black",
                  fontWeight: "bold",
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                }}
              >
                Registrar servicio
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RegistrarServicio;