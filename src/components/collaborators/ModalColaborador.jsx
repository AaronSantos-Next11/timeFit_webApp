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
} from "@mui/material";

const daysOfWeek = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
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
      const {
        name,
        last_name,
        email,
        username,
        working_hour,
        _id,
      } = colaboradorEditar;

      setForm({
        name,
        last_name,
        email,
        username,
        password: "",
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
        working_hour: {
          days: [],
          start_time: "",
          end_time: "",
        },
      });
    }
  }, [modoEdicion, colaboradorEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (day) => {
    const newDays = form.working_hour.days.includes(day)
      ? form.working_hour.days.filter((d) => d !== day)
      : [...form.working_hour.days, day];
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

  const handleGuardar = async () => {
    if (!validar()) return;

    const payload = modoEdicion
      ? {
          id: form.id,
          username: form.username,
          name: form.name,
          last_name: form.last_name,
          email: form.email,
          working_hour: {
            days: form.working_hour.days,
            start_time: form.working_hour.start_time,
            end_time: form.working_hour.end_time,
          },
          ...(form.password ? { password: form.password } : {}),
        }
      : {
          username: form.username,
          name: form.name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          working_hour: {
            days: form.working_hour.days,
            start_time: form.working_hour.start_time,
            end_time: form.working_hour.end_time,
          },
          gym_id,
          role_id: "68681f0fecbb7626e767ca9a",
        };

    const endpoint = modoEdicion
      ? `${API}/api/colaborators/updated`
      : `${API}/api/colaborators/register`;

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "#000000ff",
          backgroundColor: "#FF6600",
          borderBottom: "1px solid #444",
        }}
      >
        {modoEdicion ? "Editar colaborador" : "Registrar nuevo colaborador"}
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ backgroundColor: "#2a2a2a", color: "#fff", borderTop: "1px solid #444" }}
      >
        <Grid container spacing={2}>
          {[{ label: "Nombre", name: "name" },
            { label: "Apellidos", name: "last_name" },
            { label: "Correo electrónico", name: "email" },
            { label: "Usuario", name: "username" }
          ].map(({ label, name }) => (
            <Grid item xs={6} key={name}>
              <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, mt: 1 }}>
                {label}
              </Typography>
              <TextField
                fullWidth
                placeholder={`Ingrese ${label.toLowerCase()}`}
                name={name}
                value={form[name]}
                onChange={handleChange}
                error={!!errores[name]}
                helperText={errores[name]}
                InputProps={{
                  sx: {
                    color: "black",
                    "&::placeholder": { color: "#999" },
                  },
                }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffffff",
                    "& fieldset": { borderColor: "#555" },
                    "&:hover fieldset": { borderColor: "#F8820B" },
                    "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                  },
                }}
              />
            </Grid>
          ))}

          <Grid item xs={6}>
            <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5 }}>
              Contraseña
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
              InputProps={{
                sx: {
                  color: "black",
                  "&::placeholder": { color: "#999" },
                },
              }}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffffff",
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#F8820B" },
                  "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: "#F8820B", fontWeight: "bold" }}>
              Días laborales
            </Typography>
            <Grid container spacing={1}>
              {daysOfWeek.map((day) => (
                <Grid item key={day}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.working_hour.days.includes(day)}
                        onChange={() => handleCheckboxChange(day)}
                        sx={{
                          color: "#F8820B",
                          "&.Mui-checked": {
                            color: "#F8820B",
                          },
                          "& .MuiSvgIcon-root": {
                            fill: "#F8820B",
                          },
                        }}
                      />
                    }
                    label={<Typography sx={{ color: "#fff" }}>{day}</Typography>}
                  />
                </Grid>
              ))}
            </Grid>
            {errores.days && (
              <Typography color="error" variant="body2">
                {errores.days}
              </Typography>
            )}
          </Grid>

          <Grid item xs={6} sx={{ mt: 2 }}>
            <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 0.5 }}>
              Hora de entrada
            </Typography>
            <TextField
              fullWidth
              type="time"
              InputLabelProps={{ shrink: true }}
              value={form.working_hour.start_time}
              onChange={(e) => handleTimeChange("start_time", e.target.value)}
              error={!!errores.start_time}
              helperText={errores.start_time}
              InputProps={{ sx: { color: "black" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffffff",
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#F8820B" },
                  "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                },
              }}
            />
          </Grid>

          <Grid item xs={6} sx={{ mt: 2, mb: 2 }}>
            <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 0.5 }}>
              Hora de salida
            </Typography>
            <TextField
              fullWidth
              type="time"
              InputLabelProps={{ shrink: true }}
              value={form.working_hour.end_time}
              onChange={(e) => handleTimeChange("end_time", e.target.value)}
              error={!!errores.end_time}
              helperText={errores.end_time}
              InputProps={{ sx: { color: "black" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffffff",
                  "& fieldset": { borderColor: "#555" },
                  "&:hover fieldset": { borderColor: "#F8820B" },
                  "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: "#2a2a2a" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#F8820B",
            color: "#F8820B",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#FF6600",
              color: "#fff",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          variant="contained"
          sx={{
            backgroundColor: "#F8820B",
            color: "#000",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#FF6600",
              color: "#fff",
            },
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
