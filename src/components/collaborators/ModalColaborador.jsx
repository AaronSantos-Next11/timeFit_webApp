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
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Paper,
  Chip,
  MenuItem,
} from "@mui/material";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Error parsing JWT token:", e);
    return null;
  }
}

const ModalColaborador = ({
  open,
  onClose,
  modoEdicion = false,
  colaboradorEditar = null,
  onGuardadoExitoso = () => {},
}) => {
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    color: "Verde",
    working_hour: {
      days: [],
      start_time: "",
      end_time: "",
    },
  });

  const [errores, setErrores] = useState({});
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const decodedToken = token ? parseJwt(token) : null;
  const gym_id = decodedToken?.gym_id || decodedToken?.gym || null;

useEffect(() => {
  if (modoEdicion && colaboradorEditar) {
    const colaborator = colaboradorEditar.colaborator || colaboradorEditar;

    const {
      name,
      last_name,
      email,
      username,
      working_hour,
      color,
      _id,
    } = colaborator;

    setForm({
      name,
      last_name,
      email,
      username,
      password: "",
      color,
      working_hour: {
        days: working_hour?.days || [],
        start_time: working_hour?.start_time || "",
        end_time: working_hour?.end_time || "",
      },
      id: _id,
    });
  } else {
    setForm({
      name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      color: "Verde",
      working_hour: { days: [], start_time: "", end_time: "" },
    });
  }
}, [modoEdicion, colaboradorEditar]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleCheckboxChange = (day) => {
  let newDays;

  if (form.working_hour.days.includes(day)) {
    // Si ya está seleccionado, lo quitamos
    newDays = form.working_hour.days.filter((d) => d !== day);
  } else {
    // Si no está seleccionado, lo agregamos
    newDays = [...form.working_hour.days, day];
  }

  // Ordenamos los días según el orden de daysOfWeek
  newDays.sort((a, b) => daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b));

  setForm((prev) => ({
    ...prev,
    working_hour: { ...prev.working_hour, days: newDays },
  }));
};


  const handleTimeChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      working_hour: { ...prev.working_hour, [field]: value },
    }));
  };

  const validar = () => {
    const errs = {};
    if (!form.name) errs.name = "Nombre requerido";
    if (!form.last_name) errs.last_name = "Apellido requerido";
    if (!form.email) errs.email = "Correo requerido";
    if (!form.username) errs.username = "Usuario requerido";

    if (!modoEdicion && !form.password) {
      errs.password = "Contraseña requerida";
    } else if (form.password && form.password.length < 4) {
      errs.password = "La contraseña debe tener al menos 4 caracteres.";
    }

    if (!form.working_hour.days.length) errs.days = "Selecciona al menos un día";
    if (!form.working_hour.start_time) errs.start_time = "Hora de entrada requerida";
    if (!form.working_hour.end_time) errs.end_time = "Hora de salida requerida";
    if (
      form.working_hour.start_time &&
      form.working_hour.end_time &&
      form.working_hour.start_time > form.working_hour.end_time
    ) {
      errs.end_time = "La hora de salida debe ser posterior a la hora de entrada";
    }

    setErrores(errs);
    return Object.keys(errs).length === 0;
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

const handleGuardar = async () => {
  if (!validar()) return;

  const generarCodigoColaborador = (name, last_name, gym_id) => {
  const prefix = "colab";

  const nombres = name.trim().split(" ");
  const primerNombre = nombres[0] || "";
  const segundoNombre = nombres[1] || "";

  const apellidos = last_name.trim().split(" ");
  const primerApellido = apellidos[0] || "";
  const segundoApellido = apellidos[1] || "";

  const inicialesNombre = primerNombre.charAt(0).toUpperCase() + (segundoNombre ? segundoNombre.charAt(0).toUpperCase() : "");
  const inicialesApellido = primerApellido.charAt(0).toUpperCase() + (segundoApellido ? segundoApellido.charAt(0).toUpperCase() : "");

  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fecha = `${yyyy}${mm}${dd}`;

  const gymAbrev = gym_id ? gym_id.slice(0, 3).toUpperCase() : "GYM";

  return `${prefix}-${inicialesNombre}-${inicialesApellido}-${fecha}-${gymAbrev}`;
};


  const payload = modoEdicion
    ? {
        id: form.id,
        username: form.username,
        name: form.name,
        last_name: form.last_name,
        email: form.email,
        ...(form.colaborador_code ? { colaborator_code: form.colaborador_code } : {}),
        color: form.color,
        working_hour: { ...form.working_hour },
        ...(form.password ? { password: form.password } : {}),
      }
    : {
        username: form.username,
        name: form.name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        colaborator_code: generarCodigoColaborador(form.name, form.last_name, gym_id),
        color: form.color,
        working_hour: { ...form.working_hour },
        gym_id,
        role_id: "68681f0fecbb7626e767ca9a",
      };

    const endpoint = modoEdicion ? `${API}/api/colaborators/updated` : `${API}/api/colaborators/register`;

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    };

    try {
      const res = await fetch(endpoint, requestOptions);
      const data = await res.json();
      if (res.ok) {
        onGuardadoExitoso();
        onClose();
      } else {
        alert("Error: " + (data.message || "No se pudo guardar"));
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar el colaborador.");
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          overflow: "hidden",
          backgroundColor: "#121212",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "#FF6600",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1.4rem",
          padding: "20px 24px",
          textAlign: "center",
          boxShadow: "0 2px 10px rgba(255,102,0,0.3)",
        }}
      >
        {modoEdicion ? "✏️ Editar Colaborador" : "👤 Registrar Nuevo Colaborador"}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          backgroundColor: "#1d1c1cff",
          padding: "24px",
          borderTop: "none",
        }}
      >
        {/* Sección Información Personal */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#302e2eff",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#ffffffff",
              fontWeight: 600,
              mb: 2.5,
              fontSize: "1.1rem",
              borderBottom: "2px solid #FF6600",
              paddingBottom: "8px",
              display: "inline-block",
            }}
          >
            📋 Información Personal
          </Typography>

          <Grid container spacing={3}>
            {[
              { label: "Nombre", name: "name", icon: "👤" },
              { label: "Apellidos", name: "last_name", icon: "👤" },
              { label: "Correo electrónico", name: "email", icon: "📧" },
              { label: "Usuario", name: "username", icon: "🔑" },
            ].map(({ label, name, icon }) => (
              <Grid item xs={12} sm={6} key={name}>
                <Typography
                  sx={{
                    color: "#FF6600",
                    fontWeight: 600,
                    mb: 1,
                    fontSize: "0.9rem",
                  }}
                >
                  {icon} {label}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={`Ingrese ${label.toLowerCase()}`}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  error={!!errores[name]}
                  helperText={errores[name]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: "#ddd",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": {
                        borderColor: "#FF6600",
                        borderWidth: "2px",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#FF6600",
                        borderWidth: "2px",
                        boxShadow: "0 0 0 3px rgba(255,102,0,0.1)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#333",
                      fontSize: "0.95rem",
                    },
                  }}
                />
              </Grid>
            ))}

            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  color: "#FF6600",
                  fontWeight: 600,
                  mb: 1,
                  fontSize: "0.9rem",
                }}
              >
                🔒 {modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
              </Typography>
              <TextField
                fullWidth
                placeholder="Ingrese la contraseña"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={!!errores.password}
                helperText={errores.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: "#ddd",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FF6600",
                      borderWidth: "2px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF6600",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(255,102,0,0.1)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333",
                    fontSize: "0.95rem",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Color de Identificación</Typography>
              <TextField
                select
                fullWidth
                name="color"
                value={form.color}
                onChange={handleChange}
                disabled={false}
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

        {/* Sección Horario de Trabajo */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "#302e2eff",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#ffffffff",
              fontWeight: 600,
              mb: 2.5,
              fontSize: "1.1rem",
              borderBottom: "2px solid #FF6600",
              paddingBottom: "8px",
              display: "inline-block",
            }}
          >
            ⏰ Horario de Trabajo
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                color: "#FF6600",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              📅 Días laborales
            </Typography>

            <Paper
              sx={{
                p: 2.5,
                backgroundColor: "#424141ff",
                border: errores.days ? "2px solid #f44336" : "1px solid #302e2eff",
                borderRadius: 2,
                transition: "all 0.3s ease",
              }}
            >
              <Grid container spacing={1}>
                {daysOfWeek.map((day) => (
                  <Grid item xs={6} sm={4} md={3} key={day}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.working_hour.days.includes(day)}
                          onChange={() => handleCheckboxChange(day)}
                          sx={{
                            color: "#FF6600",
                            "&.Mui-checked": {
                              color: "#FF6600",
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: 22,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            color: "white",
                            fontSize: "0.9rem",
                            fontWeight: form.working_hour.days.includes(day) ? 600 : 400,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {day}
                        </Typography>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {errores.days && (
              <Typography color="error" variant="body2" sx={{ mt: 1, fontSize: "0.8rem" }}>
                {errores.days}
              </Typography>
            )}

            {/* Mostrar días seleccionados */}
            {form.working_hour.days.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    color: "white",
                    fontSize: "0.85rem",
                  }}
                >
                  Días seleccionados:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {form.working_hour.days.map((day) => (
                    <Chip
                      key={day}
                      label={day}
                      size="large"
                      sx={{
                        backgroundColor: "#fb6806ff",
                        color: "black",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  color: "#FF6600",
                  fontWeight: 600,
                  mb: 1,
                  fontSize: "0.9rem",
                }}
              >
                🕐 Hora de entrada
              </Typography>
              <TextField
                fullWidth
                type="time"
                InputLabelProps={{ shrink: true }}
                value={form.working_hour.start_time}
                onChange={(e) => handleTimeChange("start_time", e.target.value)}
                error={!!errores.start_time}
                helperText={errores.start_time}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: "#ddd",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FF6600",
                      borderWidth: "2px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF6600",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(255,102,0,0.1)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333",
                    fontSize: "0.95rem",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  color: "#FF6600",
                  fontWeight: 600,
                  mb: 1,
                  fontSize: "0.9rem",
                }}
              >
                🕐 Hora de salida
              </Typography>
              <TextField
                fullWidth
                type="time"
                InputLabelProps={{ shrink: true }}
                value={form.working_hour.end_time}
                onChange={(e) => handleTimeChange("end_time", e.target.value)}
                error={!!errores.end_time}
                helperText={errores.end_time}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: "#ddd",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FF6600",
                      borderWidth: "2px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF6600",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(255,102,0,0.1)",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "#333",
                    fontSize: "0.95rem",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#1d1c1cff",
          padding: "20px 24px",
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{ 
            color: "#FF6600",
            borderColor: "#FF6600",
            "&:hover": { borderColor: "#FF6600", bgcolor: "#FF6600", color: "#fff", fontWeight: "bold"}
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          size="large"
          sx={{
              background: "#F8820B",
              color: "black",
              fontWeight: "bold",
              px: 3,
              borderRadius: "8px",
              "&:hover": { 
               borderColor: "#FF6600", bgcolor: "#FF6600", color: "white", fontWeight: "bold",
              }
          }}
        >
          {modoEdicion ? "Guardar cambios" : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalColaborador.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modoEdicion: PropTypes.bool,
  colaboradorEditar: PropTypes.object,
  onGuardadoExitoso: PropTypes.func,
};

export default ModalColaborador;
