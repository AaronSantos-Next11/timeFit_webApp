// src/components/clients/ModalClient.jsx

import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Paper,
  Box,
  Avatar,
} from "@mui/material";

import {
  AccountCircle as UserIcon,
} from '@mui/icons-material';

// Estilos centralizados
const styles = {
  dialog: {
    "& .MuiDialog-paper": {
      backgroundColor: "#1d1c1c",
      borderRadius: "12px",
    },
  },
  header: {
        bgcolor: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
        color: '#fff',
        p: 0,
        position: 'relative',
        overflow: 'hidden'
  },
  content: {
    backgroundColor: "#1d1c1c",
    p: 3,
  },
  section: {
    p: 3,
    mb: 3,
    borderRadius: 3,
    backgroundColor: "#302e2e",
    border: "1px solid #404040",
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: 600,
    mb: 3,
    fontSize: "1.1rem",
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  fieldLabel: {
    color: "#F8820B",
    fontWeight: 600,
    mb: 1,
    fontSize: "1rem",
  },
  textField: {
    bgcolor: "#fff",
    borderRadius: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
    },
  },
  errorText: {
    color: "#f44336",
    fontSize: "0.75rem",
    marginTop: "4px",
    marginLeft: "14px",
  },
  actions: {
    backgroundColor: "#1d1c1c",
    p: 3,
    gap: 2,
  },
  cancelButton: {
    color: "#FF6600",
    borderColor: "#FF6600",
    "&:hover": {
      borderColor: "#F8820B",
      backgroundColor: "rgba(255, 102, 0, 0.1)",
    },
  },
  submitButton: {
    background: "linear-gradient(135deg, #F8820B 0%, #FF6600 100%)",
    color: "#fff",
    fontWeight: 600,
    "&:hover": {
      background: "linear-gradient(135deg, #FF6600 0%, #e55a00 100%)",
    },
  },
};

// Estado inicial del formulario
const initialFormState = {
  full_name: { first: "", last_father: "", last_mother: "" },
  birth_date: "",
  email: "",
  phone: "",
  rfc: "",
  emergency_contact: { name: "", phone: "" },
  membership_id: "",
  start_date: "",
  end_date: "",
  status: "Activo",
  payment: { method: "efectivo", amount: "", currency: "MXN" },
};

// Opciones de estado con colores
const statusOptions = [
  { value: "Activo", label: "🟢 Activo", color: "#4caf50" },
  { value: "Inactivo", label: "🔴 Inactivo", color: "#f44336" },
  { value: "Pendiente", label: "🟡 Pendiente", color: "#ff9800" },
  { value: "Vencido", label: "🟠 Vencido", color: "#ff5722" },
  { value: "Cancelado", label: "⚫ Cancelado", color: "#9e9e9e" },
  { value: "Debe", label: "🔵 Debe", color: "#2196f3" },
];

// Funciones de validación
const validatePhone = (phone) => {
  const phoneStr = phone.toString().trim();
  // Debe contener solo números y tener entre 10 y 15 dígitos
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phoneStr);
};

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

const validateAge = (birthDate) => {
  if (!birthDate) return false;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Ajustar la edad si aún no ha cumplido años este año
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age >= 18;
};

// Subcomponente memoizado para evitar remontajes innecesarios
const FormField = memo(function FormField({
  label,
  value,
  onChange,
  type,
  select,
  options,
  icon,
  xs = 12,
  sm = 6,
  error,
  helperText,
}) {
  return (
    <Grid item xs={xs} sm={sm}>
      <Box>
        <Typography sx={styles.fieldLabel}>
          {icon && <span style={{ marginRight: 4 }}>{icon}</span>}
          {label}
        </Typography>
        <TextField
          fullWidth
          select={select}
          type={type || "text"}
          InputLabelProps={type === "date" ? { shrink: true } : {}}
          value={value}
          onChange={onChange}
          sx={styles.textField}
          size="small"
          error={error}
        >
          {select &&
            options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
        </TextField>
        {helperText && (
          <Typography sx={styles.errorText}>
            {helperText}
          </Typography>
        )}
      </Box>
    </Grid>
  );
});

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  select: PropTypes.bool,
  options: PropTypes.array,
  icon: PropTypes.node,
  xs: PropTypes.number,
  sm: PropTypes.number,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default function ModalClient({
  open,
  onClose,
  modoEdicion = false,
  clientEditar = null,
  onGuardadoExitoso = () => {},
}) {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [memberships, setMemberships] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Función para resetear el formulario
  const resetForm = () => {
    setForm(initialFormState);
    setErrors({});
  };

  // Carga inicial: datos y listas
  useEffect(() => {
    if (open) {
      if (modoEdicion && clientEditar) {
        // Para modo edición, establecer el membership_id correctamente
        const membershipId = typeof clientEditar.membership_id === 'object' 
          ? clientEditar.membership_id._id 
          : clientEditar.membership_id;

        setForm({
          ...clientEditar,
          membership_id: membershipId || "",
          birth_date: clientEditar.birth_date?.slice(0, 10) || "",
          start_date: clientEditar.start_date?.slice(0, 10) || "",
          end_date: clientEditar.end_date?.slice(0, 10) || "",
        });
      } else {
        // Si no es modo edición, resetear el formulario
        resetForm();
      }
      setErrors({});

      // Cargar membresías activas
      (async () => {
        try {
          const res = await fetch(`${API}/api/memberships`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const all = await res.json();
            setMemberships(all.filter((m) => m.status === "Activado"));
          }
        } catch (error) {
          console.error("Error cargando membresías:", error);
        }
      })();
    }
  }, [open, modoEdicion, clientEditar, API, token]);

  // Recalcula la fecha de vencimiento y autocompletado de precio
  useEffect(() => {
    const sel = memberships.find((m) => m._id === form.membership_id);
    if (sel && !modoEdicion) { // Solo autocompletar precio si no estamos editando
      setForm((prev) => {
        const newForm = { ...prev };
        
        // Autocompletar precio
        newForm.payment.amount = sel.price.toString();
        newForm.payment.currency = sel.currency;
        
        // Recalcular fecha de vencimiento si hay fecha de inicio
        if (prev.start_date && sel.duration_days) {
          const d = new Date(prev.start_date);
          d.setDate(d.getDate() + sel.duration_days);
          newForm.end_date = d.toISOString().slice(0, 10);
        }
        
        return newForm;
      });
    }
  }, [form.membership_id, memberships, modoEdicion]);

  // Recalcula solo la fecha de vencimiento cuando cambia la fecha de inicio
  useEffect(() => {
    const sel = memberships.find((m) => m._id === form.membership_id);
    if (form.start_date && sel?.duration_days) {
      const d = new Date(form.start_date);
      d.setDate(d.getDate() + sel.duration_days);
      setForm((f) => ({ ...f, end_date: d.toISOString().slice(0, 10) }));
    }
  }, [form.start_date, form.membership_id, memberships]);

  // Manejador genérico de cambios
  const handleChange = (path) => (e) => {
    let value = e.target.value;
    
    // Validación especial para campos de teléfono
    if (path === "phone" || path === "emergency_contact.phone") {
      // Solo permitir números, eliminar cualquier carácter no numérico
      value = value.replace(/\D/g, '');
      // Limitar a 15 dígitos máximo
      if (value.length > 15) {
        value = value.slice(0, 15);
      }
    }
    
    setForm((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[path]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[path];
        return newErrors;
      });
    }
  };

  // Helper para leer valores anidados
  const get = (path) =>
    path.split(".").reduce((obj, key) => obj?.[key] ?? "", form);

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar campos obligatorios
    if (!form.full_name.first.trim()) {
      newErrors["full_name.first"] = "El nombre es obligatorio";
    }

    if (!form.full_name.last_father.trim()) {
      newErrors["full_name.last_father"] = "El apellido paterno es obligatorio";
    }

    if (!form.birth_date) {
      newErrors["birth_date"] = "La fecha de nacimiento es obligatoria";
    } else if (!validateAge(form.birth_date)) {
      newErrors["birth_date"] = "El cliente debe ser mayor de edad (18 años o más)";
    }

    // Validar email
    if (!form.email.trim()) {
      newErrors["email"] = "El email es obligatorio";
    } else if (!validateEmail(form.email)) {
      newErrors["email"] = "El formato del email no es válido";
    }

    // Validar teléfono principal
    if (!form.phone.trim()) {
      newErrors["phone"] = "El teléfono es obligatorio";
    } else if (!validatePhone(form.phone)) {
      newErrors["phone"] = "El teléfono debe contener solo números (10-15 dígitos)";
    }

    // Validar teléfono de emergencia (solo si se proporciona)
    if (form.emergency_contact.phone.trim() && !validatePhone(form.emergency_contact.phone)) {
      newErrors["emergency_contact.phone"] = "El teléfono debe contener solo números (10-15 dígitos)";
    }

    if (!form.membership_id) {
      newErrors["membership_id"] = "Debe seleccionar una membresía";
    }

    if (!form.start_date) {
      newErrors["start_date"] = "La fecha de inicio es obligatoria";
    }

    // Validar que la fecha de vencimiento no sea anterior a la fecha de inicio
    if (form.start_date && form.end_date) {
      const startDate = new Date(form.start_date);
      const endDate = new Date(form.end_date);
      
      if (endDate < startDate) {
        newErrors["end_date"] = "La fecha de vencimiento no puede ser anterior a la fecha de inicio";
      }
    }

    if (!form.payment.amount || parseFloat(form.payment.amount) <= 0) {
      newErrors["payment.amount"] = "El monto debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío de formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let url, method, body;
      
      if (modoEdicion) {
        // Para modo edición, usar POST a /updated con el ID en el body
        url = `${API}/api/clients/updated`;
        method = "POST";
        body = JSON.stringify({
          id: clientEditar._id,
          ...form
        });
      } else {
        // Para crear cliente, usar POST a /created
        url = `${API}/api/clients/created`;
        method = "POST";
        body = JSON.stringify(form);
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body
      });
      
      if (response.ok) {
        onGuardadoExitoso();
        onClose();
        resetForm(); // Resetear formulario después del éxito
      } else {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error("Error guardando cliente:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Manejar el cierre del modal
  const handleClose = () => {
    onClose();
    if (!modoEdicion) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth sx={styles.dialog}>
      <DialogTitle sx={styles.header}>
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
            <UserIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black' }}>
        {modoEdicion ? "✏️ Editar Cliente" : "Registrar Nuevo Cliente"}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(3, 3, 3, 0.8)', fontWeight: 'bold' }}>
                      {modoEdicion ? 'Modificar los datos del cliente' : 'Registra un nuevo cliente con los datos importantes dentro tu gimnasio'}
        </Typography>
        </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={styles.content}>
        {/* Datos Personales */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            👤 Información Personal
          </Typography>
          <Grid container spacing={3}>
            <FormField
              label="Nombre"
              value={get("full_name.first")}
              onChange={handleChange("full_name.first")}
              error={!!errors["full_name.first"]}
              helperText={errors["full_name.first"]}
            />
            <FormField
              label="Apellido Paterno"
              value={get("full_name.last_father")}
              onChange={handleChange("full_name.last_father")}
              error={!!errors["full_name.last_father"]}
              helperText={errors["full_name.last_father"]}
            />
            <FormField
              label="Apellido Materno"
              value={get("full_name.last_mother")}
              onChange={handleChange("full_name.last_mother")}
            />
            <FormField
              label="Fecha de Nacimiento"
              type="date"
              value={get("birth_date")}
              onChange={handleChange("birth_date")}
              error={!!errors["birth_date"]}
              helperText={errors["birth_date"]}
            />
          </Grid>
        </Paper>
        {/* Contacto */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            📧 Información de Contacto
          </Typography>
          <Grid container spacing={3}>
            <FormField
              type="email"
              label="Correo Electrónico"
              value={get("email")}
              onChange={handleChange("email")}
              xs={12}
              sm={8}
              error={!!errors["email"]}
              helperText={errors["email"]}
            />
            <FormField
              label="Teléfono"
              value={get("phone")}
              onChange={handleChange("phone")}
              xs={12}
              sm={4}
              error={!!errors["phone"]}
              helperText={errors["phone"]}
            />
            <FormField
              label="RFC"
              value={get("rfc")}
              onChange={handleChange("rfc")}
              xs={12}
              sm={4}
            />
            <FormField
              label="Contacto Emergencia"
              value={get("emergency_contact.name")}
              onChange={handleChange("emergency_contact.name")}
              xs={12}
              sm={4}
            />
            <FormField
              label="Teléfono Emergencia"
              value={get("emergency_contact.phone")}
              onChange={handleChange("emergency_contact.phone")}
              xs={12}
              sm={4}
              error={!!errors["emergency_contact.phone"]}
              helperText={errors["emergency_contact.phone"]}
            />
          </Grid>
        </Paper>
        {/* Membresía */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            🎯 Membresía
          </Typography>
          <Grid container spacing={3}>
            <FormField
              label="Tipo de Membresía"
              select
              options={memberships.map((m) => ({
                value: m._id,
                label: m.name_membership,
              }))}
              value={form.membership_id}
              onChange={handleChange("membership_id")}
              xs={12}
              sm={4}
              error={!!errors["membership_id"]}
              helperText={errors["membership_id"]}
            />
            <FormField
              label="Fecha Inicio"
              type="date"
              value={get("start_date")}
              onChange={handleChange("start_date")}
              xs={12}
              sm={4}
              error={!!errors["start_date"]}
              helperText={errors["start_date"]}
            />
            <FormField
              label="Fecha Vencimiento"
              type="date"
              value={get("end_date")}
              onChange={handleChange("end_date")}
              xs={12}
              sm={4}
              error={!!errors["end_date"]}
              helperText={errors["end_date"]}
            />
          </Grid>
        </Paper>
        {/* Estado y Pago */}
        <Paper elevation={3} sx={styles.section}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            💳 Estado y Pago
          </Typography>
          <Grid container spacing={3}>
            <FormField
              label="Estado del Cliente"
              select
              options={statusOptions}
              value={form.status}
              onChange={handleChange("status")}
              xs={12}
              sm={3}
            />
            <FormField
              label="Método de Pago"
              select
              options={[{ value: "efectivo", label: "Efectivo" }]}
              value={form.payment.method}
              onChange={handleChange("payment.method")}
              xs={12}
              sm={3}
            />
            <FormField
              label="Monto"
              type="number"
              value={form.payment.amount}
              onChange={handleChange("payment.amount")}
              xs={6}
              sm={3}
              error={!!errors["payment.amount"]}
              helperText={errors["payment.amount"]}
            />
            <FormField
              label="Moneda"
              select
              options={[
                { value: "MXN", label: "MXN" },
                { value: "USD", label: "USD" },
              ]}
              value={form.payment.currency}
              onChange={handleChange("payment.currency")}
              xs={6}
              sm={3}
            />
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions sx={styles.actions}>
        <Button onClick={handleClose} variant="outlined" sx={styles.cancelButton}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={styles.submitButton}>
          {modoEdicion ? "Guardar Cambios" : "Registrar Cliente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ModalClient.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modoEdicion: PropTypes.bool,
  clientEditar: PropTypes.object,
  onGuardadoExitoso: PropTypes.func,
};