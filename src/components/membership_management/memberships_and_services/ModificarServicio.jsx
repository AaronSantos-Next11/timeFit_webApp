import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { Link, useNavigate, useLocation } from "react-router-dom";

const ModificarServicio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Se recibe el servicio a modificar vía location.state.service
  const serviceToModify = location.state?.service || {};

  // Inicializar estados con los datos actuales del servicio
  const [nombreServicio, setNombreServicio] = useState(serviceToModify.name || "");
  const [descripcion, setDescripcion] = useState(serviceToModify.description || "");
  const [categoria, setCategoria] = useState(serviceToModify.category || "");
  const [costo, setCosto] = useState(
    serviceToModify.cost ? serviceToModify.cost.replace("$", "").replace(" MXN", "") : ""
  );
  const [duracionValor, setDuracionValor] = useState(
    serviceToModify.duration ? serviceToModify.duration.split(" ")[0] : ""
  );
  const [duracionUnidad, setDuracionUnidad] = useState(
    serviceToModify.duration ? serviceToModify.duration.split(" ")[1] : "Sesion"
  );
  const [capacidad, setCapacidad] = useState(serviceToModify.capacity || "");
  const [estado, setEstado] = useState(serviceToModify.status || "Activo");

  // Estados para campos adicionales (si aplica)
  const [descuento, setDescuento] = useState(serviceToModify.discount || "");
  const [cargosAdicionales, setCargosAdicionales] = useState(serviceToModify.additionalCharges || "");

// Estados y referencias:
const [imagenURL, setImagenURL] = useState('');
const [mostrarPastePrompt, setMostrarPastePrompt] = useState(false);
const fileInputRef = useRef(null);
const dropAreaRef = useRef(null);

  const calcularResumen = () => {
    const costoNumerico = parseFloat(costo) || 0;
    const descuentoNumerico = parseFloat(descuento) || 0;
    const cargosAdicionalesNumerico = parseFloat(cargosAdicionales) || 0;
    const subtotal = Math.max(costoNumerico - descuentoNumerico, 0);
    const total = subtotal + cargosAdicionalesNumerico;
    return [
      { descripcion: "Costo del Servicio:", cantidad: `$${costoNumerico.toFixed(2)} MXN` },
      { descripcion: "Descuento Aplicado:", cantidad: `$${descuentoNumerico.toFixed(2)} MXN` },
      { descripcion: "Subtotal:", cantidad: `$${subtotal.toFixed(2)} MXN` },
      { descripcion: "Cargos Adicionales:", cantidad: `$${cargosAdicionalesNumerico.toFixed(2)} MXN` },
      { descripcion: "Costo Total:", cantidad: `$${total.toFixed(2)} MXN`, destacado: true },
    ];
  };

  const resumenData = calcularResumen();

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

  const getBackgroundColor = (estado) => {
    switch (estado) {
      case "Activo":
        return "#BCEB9F";
      case "Inactivo":
        return "#FF9B9B";
      case "Pendiente":
        return "#FFD699";
      default:
        return "#BCEB9F";
    }
  };

  // Se asocia el evento "paste" directamente al área de imagen (dropAreaRef)
  useEffect(() => {
    const handlePaste = (e) => {
      if (!mostrarPastePrompt) return;
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const blob = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (ev) => {
            setImagenURL(ev.target.result);
            setMostrarPastePrompt(false);
          };
          reader.readAsDataURL(blob);
          e.preventDefault();
          break;
        } else if (item.type === "text/plain") {
          item.getAsString((url) => {
            if (isValidImageUrl(url)) {
              setImagenURL(url);
              setMostrarPastePrompt(false);
            }
          });
          e.preventDefault();
          break;
        }
      }
    };

    const dropArea = dropAreaRef.current;
    if (mostrarPastePrompt && dropArea) {
      dropArea.addEventListener("paste", handlePaste);
    }
    return () => {
      if (dropArea) {
        dropArea.removeEventListener("paste", handlePaste);
      }
    };
  }, [mostrarPastePrompt]);

  // useEffect para cerrar el prompt si se hace clic fuera del área
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

  // Al enviar el formulario, se calcula el costo total para reflejarlo en la columna "costo"
  const handleSubmit = (e) => {
    e.preventDefault();
    const costoNumerico = parseFloat(costo) || 0;
    const descuentoNumerico = parseFloat(descuento) || 0;
    const cargosAdicionalesNumerico = parseFloat(cargosAdicionales) || 0;
    const subtotal = Math.max(costoNumerico - descuentoNumerico, 0);
    const total = subtotal + cargosAdicionalesNumerico;

    const updatedService = {
      id: serviceToModify.id,
      name: nombreServicio || "Nuevo Servicio",
      description: descripcion || "Descripción del servicio",
      category: categoria || "General",
      // Se utiliza el total calculado para reflejar el costo final
      cost: `$${total.toFixed(2)} MXN`,
      duration: `${duracionValor} ${duracionUnidad}`,
      capacity: capacidad,
      status: estado,
      discount: descuento,
      additionalCharges: cargosAdicionales,
      imagenURL,
    };
    // Navega de vuelta a Membership pasando el servicio modificado
    navigate("/membership_management/memberships", { state: { modifiedService: updatedService } });
  };

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
      <form onSubmit={handleSubmit}>
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
            Modificar este servicio a tu gimnasio.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Nombre del Servicio
              </Typography>
              <TextField
                fullWidth
                value={nombreServicio}
                onChange={(e) => setNombreServicio(e.target.value)}
                variant="outlined"
                placeholder="Ingresa el nombre del servicio"
                InputProps={{ sx: { bgcolor: "white", borderRadius: 1 } }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Descripción
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                variant="outlined"
                placeholder="Ingresa la descripción del servicio"
                InputProps={{ sx: { bgcolor: "white", borderRadius: 1 } }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Categoría
              </Typography>
              <TextField
                fullWidth
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                variant="outlined"
                placeholder="Ingresa una categoría del servicio"
                InputProps={{ sx: { bgcolor: "white", borderRadius: 1 } }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Costo (MXN)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  value={costo}
                  onChange={(e) => setCosto(e.target.value)}
                  variant="outlined"
                  placeholder="Ingresa el precio del servicio (MXN)"
                  sx={{ width: "70%" }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    sx: { bgcolor: "white", borderRadius: 1 },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Descuento Aplicado (MXN)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  value={descuento}
                  onChange={(e) => setDescuento(e.target.value)}
                  variant="outlined"
                  placeholder="Ingresa el descuento a aplicar"
                  sx={{ width: "70%" }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    sx: { bgcolor: "white", borderRadius: 1 },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Cargos Adicionales (MXN)
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  value={cargosAdicionales}
                  onChange={(e) => setCargosAdicionales(e.target.value)}
                  variant="outlined"
                  placeholder="Ingresa cargos adicionales si aplican"
                  sx={{ width: "70%" }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    sx: { bgcolor: "white", borderRadius: 1 },
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Duración
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  value={duracionValor}
                  onChange={(e) => setDuracionValor(e.target.value)}
                  variant="outlined"
                  placeholder="1"
                  sx={{ width: "30%", mr: 1 }}
                  InputProps={{ sx: { bgcolor: "white", borderRadius: 1 } }}
                />
                <FormControl variant="outlined" sx={{ width: "40%" }}>
                  <Select
                    value={duracionUnidad}
                    onChange={(e) => setDuracionUnidad(e.target.value)}
                    sx={{ bgcolor: "white", borderRadius: 1 }}
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
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Capacidad
              </Typography>
              <TextField
                fullWidth
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                variant="outlined"
                placeholder="Ingresa la capacidad que tendrá el servicio"
                InputProps={{ sx: { bgcolor: "white", borderRadius: 1 } }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography sx={{ mb: 1, color: "#F8820B", fontWeight: "bold" }}>
                Estado
              </Typography>
              <FormControl variant="outlined" sx={{ width: "40%" }}>
                <Select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  sx={{
                    bgcolor: getBackgroundColor(estado),
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
              <Box
                ref={dropAreaRef}
                onClick={() => { if (!imagenURL) setMostrarPastePrompt(true); }}
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
                  <Box component="img" src={imagenURL} alt="Imagen del servicio" sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2 }} />
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
                    <Typography color="#999">
                      Selecciona una imagen para representar el servicio
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Button variant="contained" component={Link} startIcon={<FileUploadIcon />} sx={{ bgcolor: "#444", "&:hover": { bgcolor: "#555" } }}>
                  SUBIR ARCHIVO
                  <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFileUpload} />
                </Button>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ mb: 2, color: "#F8820B", fontWeight: "bold" }}>Resumen del pago</Typography>
              <Box sx={{ bgcolor: "#444", borderRadius: 2, p: 1 }}>
                {resumenData.map((item, index) => (
                  <Box key={index} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                    <Typography sx={{ color: "white" }}>{item.descripcion}</Typography>
                    <Typography sx={{ color: item.destacado ? "#F8820B" : "white", fontWeight: item.destacado ? "bold" : "normal" }}>
                      {item.cantidad}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: "#F8820B", color: "black", fontWeight: "bold", borderRadius: 2, px: 4, py: 1 }}>
                  Actualizar servicio
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ModificarServicio;
