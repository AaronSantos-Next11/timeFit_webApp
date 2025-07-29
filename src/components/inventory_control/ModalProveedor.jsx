import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
} from "@mui/material";
import {
  Business as BusinessIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

const colorOptions = [
  { name: "Verde", value: "Verde", color: "#4CAF50" },
  { name: "Rojo", value: "Rojo", color: "#F44336" },
  { name: "Azul", value: "Azul", color: "#2196F3" },
  { name: "Naranja", value: "Naranja", color: "#FF9800" },
  { name: "Amarillo", value: "Amarillo", color: "#f1c40f" },
  { name: "Morado", value: "Morado", color: "#9C27B0" },
  { name: "Rosa", value: "Rosa", color: "#E91E63" },
  { name: "Durazno", value: "Durazno", color: "#ffb74d" },
  { name: "Turquesa", value: "Turquesa", color: "#1abc9c" },
  { name: "Rojo Vino", value: "RojoVino", color: "#880e4f" },
  { name: "Lima", value: "Lima", color: "#cddc39" },
  { name: "Cian", value: "Cian", color: "#00acc1" },
  { name: "Lavanda", value: "Lavanda", color: "#9575cd" },
  { name: "Magenta", value: "Magenta", color: "#d81b60" },
  { name: "Coral", value: "Coral", color: "#ff7043" },
];

const ModalProveedor = ({ open, onClose, proveedor, role, refreshProveedores }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    color: "Verde",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nombre requerido";
    if (!form.phone.trim()) newErrors.phone = "Teléfono requerido";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Teléfono debe tener 10 dígitos";
    }
    if (!form.email.trim()) newErrors.email = "Email requerido";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email inválido";
    }
    if (!form.color) newErrors.color = "Color requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (proveedor) {
      setForm({
        name: proveedor.name || "",
        phone: proveedor.phone || "",
        email: proveedor.email || "",
        color: proveedor.color || "Verde",
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",
        color: "Verde",
      });
    }
    setErrors({}); // Limpiar errores al abrir modal
  }, [proveedor, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const formattedPhone = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: formattedPhone });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    const proveedorData = {
      ...form,
      ...(proveedor?._id && { id: proveedor._id }), // Solo incluir id si existe
    };

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");

    try {
      let response;
      if (proveedor?._id) {
        // Actualizar proveedor existente
        response = await fetch(`${API_URL}/api/suppliers/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(proveedorData),
        });
      } else {
        // Crear nuevo proveedor
        response = await fetch(`${API_URL}/api/suppliers/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(proveedorData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al guardar el proveedor: ${errorData.message || response.statusText}`);
      }
      
      // Cerrar modal y refrescar lista
      onClose();
      if (refreshProveedores) {
        refreshProveedores();
      }
    } catch (error) {
      console.error("Error al guardar el proveedor:", error);
      alert("Error al guardar el proveedor. Intenta de nuevo.");
    }
  };

  const readonly = role !== "Administrador" && proveedor; 

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: "#1a1a1a",
          borderRadius: "16px",
          border: "1px solid #333",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)",
          color: "#fff",
          p: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ background: "#FF6600", p: 3, display: "flex", alignItems: "center", gap: 2, position: "relative" }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "rgba(14, 14, 14, 1)", width: 48, height: 48 }}>
            <BusinessIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }}>
              {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(3, 3, 3, 0.8)", fontWeight: "bold" }}>
              {proveedor ? "Modificar los datos del proveedor" : "Registrar un nuevo proveedor para el gimnasio"}
            </Typography>
          </Box>
          <IconButton
            onClick={() => onClose()}
            sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: "#1a1a1a", color: "#fff", p: 3 }}>
        <Grid container spacing={3}>
          {/* Información del Proveedor */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "#2a2a2a", borderRadius: "12px", border: "1px solid #333" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PersonIcon sx={{ color: "#F8820B" }} />
                <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold" }}>
                  Información del Proveedor
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Nombre del Proveedor</Typography>
                  <TextField
                    fullWidth
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.name}
                    helperText={errors.name}
                    placeholder="Ej: Equipos GYM Pro"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                      },
                      "& .MuiInputBase-input": { color: "#000" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Color de Identificación</Typography>
                  <TextField
                    select
                    fullWidth
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.color}
                    helperText={errors.color}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                      },
                    }}
                  >
                    {colorOptions.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              bgcolor: c.color,
                              border: "2px solid #fff",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            }}
                          />
                          {c.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Información de Contacto */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "#2a2a2a", borderRadius: "12px", border: "1px solid #333" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PhoneIcon sx={{ color: "#F8820B" }} />
                <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold" }}>
                  Información de Contacto
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Número de Teléfono</Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    placeholder="5551234567"
                    inputProps={{ maxLength: 10 }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                      },
                      "& .MuiInputBase-input": { color: "#000" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Correo Electrónico</Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.email}
                    helperText={errors.email}
                    placeholder="proveedor@ejemplo.com"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                      },
                      "& .MuiInputBase-input": { color: "#000" },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ bgcolor: "#1a1a1a", p: 3, borderTop: "1px solid #333" }}>
        <Button
          onClick={() => onClose()}
          sx={{
            color: "#FF6600",
            borderColor: "#FF6600",
            "&:hover": { borderColor: "#FF6600", bgcolor: "#FF6600", color: "#fff", fontWeight: "bold" },
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        {(role === "Administrador" || !proveedor)&& (
          <>
            <Button
              onClick={handleSave}
              variant="contained"
              startIcon={proveedor ? <EditIcon /> : <AddIcon />}
              sx={{
                background: "#F8820B",
                color: "black",
                fontWeight: "bold",
                px: 3,
                borderRadius: "8px",
                "&:hover": {
                  borderColor: "#FF6600",
                  bgcolor: "#FF6600",
                  color: "black",
                  fontWeight: "bold",
                },
              }}
            >
              {proveedor ? "Actualizar" : "Registrar"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

ModalProveedor.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  proveedor: PropTypes.object,
  role: PropTypes.string.isRequired,
  refreshProveedores: PropTypes.func,
};

export default ModalProveedor;