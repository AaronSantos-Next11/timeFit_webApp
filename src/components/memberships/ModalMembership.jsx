import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Typography, MenuItem,
  Box, Paper, Chip, Avatar, IconButton
} from "@mui/material";
import {
  FitnessCenter as FitnessCenterIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Add as AddIcon,
  MonetizationOn as MoneyIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon
} from "@mui/icons-material";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const getPeriodByDays = (days) => {
  if (days <= 1) return "diario";
  if (days <= 7) return "semanal";
  if (days <= 15) return "quincenal";
  if (days <= 31) return "mensual";
  if (days <= 90) return "trimestral";
  return "anual";
};


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

const periods = ["quincenal", "mensual", "trimestral", "anual"];
const currencies = ["MXN", "USD", "EUR"];
const statuses = ["Activado", "Cancelado"];

const ModalMembership = ({ open, onClose, membershipId, role }) => {
  const [form, setForm] = useState({
    name_membership: "",
    description: "",
    price: "",
    duration_days: "",
    period: "",
    currency: "MXN",
    status: "Activado",
    color: "Verde",
    cantidad_usuarios: 0,
    porcentaje_uso: 0
  });

  const API = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem("token");
  const decoded = parseJwt(token);
  const gym_id = decoded?.gym_id;

  const [errors, setErrors] = useState({});

  const validate = () => {
  const newErrors = {};
  if (!form.name_membership.trim()) newErrors.name_membership = "Nombre requerido";
  if (!form.description.trim()) newErrors.description = "Descripción requerida";
  if (!form.price || form.price <= 0) newErrors.price = "Precio inválido";
  if (!form.duration_days || form.duration_days < 15) newErrors.duration_days = "Duración inválida (mínimo 15 días)";
  if (!form.period) newErrors.period = "Período requerido";
  if (!form.status) newErrors.status = "Estado requerido";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


useEffect(() => {
  if (membershipId) {
    fetch(`${API}/api/memberships/${membershipId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setForm({
          name_membership: data.name_membership || "",
          description: data.description || "",
          price: data.price || "",
          duration_days: data.duration_days || "",
          period: data.period || "",
          currency: data.currency || "MXN",
          status: data.status || "Activado",
          color: data.color || "Verde",
          cantidad_usuarios: data.cantidad_usuarios || 0,
          porcentaje_uso: data.porcentaje_uso || 0,
        })
      )
      .catch((err) => console.error("Error al obtener membresía", err));
  } else {
    setForm({
      name_membership: "",
      description: "",
      price: "",
      duration_days: "",
      period: "",
      currency: "MXN",
      status: "Activado" ,
      color: "Verde",
      cantidad_usuarios: 0,
      porcentaje_uso: 0,
    });
  }
}, [membershipId, open]);


  const handleChange = (e) => {
  const { name, value } = e.target;
  let updatedForm = { ...form, [name]: value };

  if (name === "duration_days") {
    const period = getPeriodByDays(Number(value));
    updatedForm.period = period;
  }
  if (name === "period") {
    // Autocompletar duración basada en el período seleccionado
    const periodDurations = {
      diario: 1,
      semanal: 7,
      quincenal: 15,
      mensual: 30,
      trimestral: 90,
      anual: 365,
    };
    updatedForm.duration_days = periodDurations[value] || "";
  }
  setForm(updatedForm);
};


const handleSave = () => {
  if (!validate()) return;

  const url = membershipId ? "/api/memberships/updated" : "/api/memberships/created";
  const payload = { ...form, gym_id, ...(membershipId && { id: membershipId }) };

  fetch(`${API}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) {
        // Intentamos leer el mensaje del backend
        let { message } = await res.json().catch(() => ({}));
        // Si no viene message, ponemos un genérico
        alert(message || "Primero registra tu gimnasio");
        return;
      }
      // Si todo fue OK, cerramos
      onClose();
    })
    .catch((err) => {
      console.error("Error al guardar membresía:", err);
      alert("Error al guardar. Intenta de nuevo.");
    });
};


  const readonly = role !== "Administrador";
  const selectedColor = colorOptions.find(c => c.value === form.color)?.color || "#4CAF50";

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: "#1a1a1a",
          borderRadius: "16px",
          border: "1px solid #333",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }
      }}
    >
      {/* Header mejorado */}
      <DialogTitle sx={{ 
        bgcolor: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)",
        color: "#fff",
        p: 0,
        position: "relative",
        overflow: "hidden"
      }}>
        <Box sx={{ 
          background: "#FF6600",
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          position: "relative"
        }}>
          <Avatar sx={{ 
            bgcolor: "rgba(255,255,255,0.2)", 
            color: "rgba(14, 14, 14, 1)",
            width: 48,
            height: 48
          }}>
            <FitnessCenterIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }}>
              {membershipId ? "Editar Membresía" : "Nueva Membresía"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(3, 3, 3, 0.8)", fontWeight: "bold" }}>
              {membershipId ? "Modificar los datos de la membresía" : "Registrar una nueva membresía para el gimnasio"}
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        bgcolor: "#1a1a1a", 
        color: "#fff",
        p: 3
      }}>
        <Grid container spacing={3}>
          {/* Información General */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: "#2a2a2a", 
              borderRadius: "12px",
              border: "1px solid #333"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <InfoIcon sx={{ color: "#F8820B" }} />
                <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold" }}>
                  Información General
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>
                    Nombre de la Membresía
                  </Typography>
                  <TextField
                    fullWidth
                    name="name_membership"
                    value={form.name_membership}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.name_membership}
                    helperText={errors.name_membership}
                    placeholder="Ej: Membresía Premium"
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" }
                      },
                      "& .MuiInputBase-input": { color: "#000" }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>
                    Color de Identificación
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    disabled={readonly}
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" }
                      }
                    }}
                  >
                    {colorOptions.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box sx={{ 
                            width: 20, 
                            height: 20, 
                            borderRadius: "50%", 
                            bgcolor: c.color,
                            border: "2px solid #fff",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                          }} />
                          {c.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>
                    Descripción
                  </Typography>
                  <TextField
                    fullWidth
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.description}
                    helperText={errors.description}
                    multiline
                    rows={3}
                    placeholder="Describe los beneficios y características de esta membresía..."
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" }
                      },
                      "& .MuiInputBase-input": { color: "#000" }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Precio y Duración */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: "#2a2a2a", 
              borderRadius: "12px",
              border: "1px solid #333"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <MoneyIcon sx={{ color: "#F8820B" }} />
                <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold" }}>
                  Precio y Duración
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>
                    Precio
                  </Typography>
                  <TextField
                    fullWidth
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.price }
                    helperText={errors.price}
                    placeholder="0.00"
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" }
                      },
                      "& .MuiInputBase-input": { color: "#000" }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>
                    Moneda
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    disabled={readonly}
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" }
                      }
                    }}
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>
                    Duración (días)
                  </Typography>
                  <TextField
                    fullWidth
                    name="duration_days"
                    type="number"
                    value={form.duration_days}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.duration_days }
                    helperText={errors.duration_days}
                    placeholder="30"
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" }
                      },
                      "& .MuiInputBase-input": { color: "#000" }
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Configuración */}
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: "#2a2a2a", 
              borderRadius: "12px",
              border: "1px solid #333"
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <ScheduleIcon sx={{ color: "#F8820B" }} />
                <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold" }}>
                  Configuración
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>
                    Período de Renovación
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    name="period"
                    value={form.period}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.period }
                    helperText={errors.period}
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" }
                      }
                    }}
                  >
                    {periods.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>
                    Estado
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    disabled={readonly}
                    error={!!errors.status }
                    helperText={errors.status}
                    sx={{ 
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "#fff",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "#e0e0e0" },
                        "&:hover fieldset": { borderColor: "#F8820B" },
                        "&.Mui-focused fieldset": { borderColor: "#F8820B" }
                      }
                    }}
                  >
                    {statuses.map((s) => (
                      <MenuItem key={s} value={s}>
                        <Chip 
                          label={s}
                          size="small"
                          color={s === "Activado" ? "success" : "error"}
                          variant="filled"
                        />
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Preview de la membresía */}
          {form.name_membership && (
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 2, 
                bgcolor: "#2a2a2a", 
                borderRadius: "12px",
                border: "1px solid #333"
              }}>
                <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold", mb: 2 }}>
                  Vista Previa
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: "#1a1a1a", 
                  borderRadius: "8px",
                  border: `2px solid ${selectedColor}`,
                  position: "relative"
                }}>
                  <Box sx={{ 
                    position: "absolute", 
                    top: -1, 
                    right: -1, 
                    bgcolor: selectedColor, 
                    width: 20, 
                    height: 20, 
                    borderRadius: "0 8px 0 8px"
                  }} />
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
                    {form.name_membership}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                    {form.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Typography variant="h5" sx={{ color: selectedColor, fontWeight: "bold" }}>
                      ${form.price} {form.currency}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ccc" }}>
                      / {form.period}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ 
        bgcolor: "#1a1a1a", 
        p: 3,
        borderTop: "1px solid #333"
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: "#FF6600",
            borderColor: "#FF6600",
            "&:hover": { borderColor: "#FF6600", bgcolor: "#FF6600", color: "#fff", fontWeight: "bold"}
          }}
          variant="outlined"
        >
          Cancelar
        </Button>
        {role === "Administrador" && (
          <Button 
            onClick={handleSave} 
            variant="contained"
            startIcon={membershipId ? <EditIcon /> : <AddIcon />}
            sx={{ 
              background: "#F8820B",
              color: "black",
              fontWeight: "bold",
              px: 3,
              borderRadius: "8px",
              "&:hover": { 
               borderColor: "#FF6600", bgcolor: "#FF6600", color: "black", fontWeight: "bold"
              }
            }}
          >
            {membershipId ? "Actualizar" : "Registrar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ModalMembership.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  membershipId: PropTypes.string,
  role: PropTypes.string.isRequired,
};

export default ModalMembership;