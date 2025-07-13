import React, { useState, useEffect } from "react";
import { Box, Button, Card, Grid, IconButton, Typography, Alert, Avatar } from "@mui/material";
import { CloudUpload, Delete, WarningAmber } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

const GymRegistration = () => {
  const API = import.meta.env.VITE_API_URL;

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    opening_time: "",
    closing_time: "",
    address: {
      street: "",
      colony: "",
      avenue: "",
      codigoPostal: "",
      city: "",
      state: "",
      country: "",
    },
    logo_url: "",
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState({ show: false, type: "success", text: "" });
  const [errors, setErrors] = useState({});
  const [roleName, setRoleName] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Estado para encabezado usuario
  const [admin, setAdmin] = useState(null);

  // Leer usuario admin/colaborador y rol
  useEffect(() => {
    try {
      const adminDataString = localStorage.getItem("admin") || sessionStorage.getItem("admin");
      const adminObj = adminDataString ? JSON.parse(adminDataString) : null;
      setAdmin(adminObj);
      setRoleName(adminObj?.role?.role_name || "");
    } catch {
      setAdmin(null);
      setRoleName("");
    }
  }, []);

  // Funciones para encabezado
  const getInitials = (username) => (username ? username.slice(0, 2).toUpperCase() : "");
  const getDisplayName = (name, last_name) => {
    if (!name || !last_name) return "Usuario";
    return `${name.split(" ")[0]} ${last_name.split(" ")[0]}`;
  };

  const usernameInitials = admin ? getInitials(admin.username) : "";
  const displayName = admin ? getDisplayName(admin.name, admin.last_name) : "Usuario";

  // Cargar datos del gimnasio en carga o recarga
  useEffect(() => {
    const loadGym = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAlertData({ show: true, type: "error", text: "No autorizado. Por favor, inicia sesión." });
          return;
        }
        const headers = new Headers({ Authorization: `Bearer ${token}` });
        const resp = await fetch(`${API}/api/gyms/mygym`, { headers });
        if (resp.ok) {
          const g = await resp.json();

          // Guardar en estado adaptando la estructura con "C.P"
          setFormData({
            id: g._id || g.id || "",
            name: g.name || "",
            opening_time: g.opening_time || "",
            closing_time: g.closing_time || "",
            address: {
              street: g.address?.street || "",
              colony: g.address?.colony || "",
              avenue: g.address?.avenue || "",
              codigoPostal: g.address?.codigoPostal || "",
              city: g.address?.city || "",
              state: g.address?.state || "",
              country: g.address?.country || "",
            },
            logo_url: g.logo_url || "",
          });
          setLogoPreview(g.logo_url || "");
        } else {
          setAlertData({ show: true, type: "error", text: "Error al cargar datos del gimnasio" });
        }
      } catch (e) {
        console.error(e);
        setAlertData({ show: true, type: "error", text: "Error al cargar datos." });
      }
    };

    loadGym();
  }, [API]);

  // Validar formulario
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.opening_time) newErrors.opening_time = "La hora de apertura es obligatoria";
    if (!formData.closing_time) newErrors.closing_time = "La hora de cierre es obligatoria";
    if (!formData.logo_url) newErrors.logo_url = "Debe subir una imagen del logo";

    if (formData.opening_time && formData.closing_time && formData.opening_time >= formData.closing_time) {
      newErrors.closing_time = "La hora de cierre debe ser después de la hora de apertura";
    }

    const addr = formData.address;
    ["street", "colony", "avenue", "codigoPostal", "city", "state", "country"].forEach((key) => {
      if (!addr[key]) newErrors[`address.${key}`] = "Campo obligatorio";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Autocompletar dirección por código postal (usando API SEPOMEX para México)
  const onCPChange = async (e) => {
    const cp = e.target.value;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        codigoPostal: cp,
      },
    }));

    if (/^\d{5}$/.test(cp)) {
      try {
        const resp = await fetch(`https://api-sepomex.hckdrk.mx/query/info_cp/${cp}?type=simplified`);
        const data = await resp.json();
        if (data?.response) {
          const r = data.response;
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              colony: r.asentamiento || "",
              city: r.municipio || "",
              state: r.estado || "",
              country: "México",
              avenue: prev.address.avenue || "", // No modificar avenue al autocomplete
              street: prev.address.street || "", // Tampoco street
            },
          }));
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors["address.colony"];
            delete newErrors["address.city"];
            delete newErrors["address.state"];
            delete newErrors["address.country"];
            return newErrors;
          });
        }
      } catch (e) {
        console.error("Error API código postal:", e);
      }
    }
  };

  // Manejo campos simples
  const handleField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));
  const handleAddrField = (key, value) =>
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));

  // Manejo archivo logo
  const handleLogoFile = (e) => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      setAlertData({ show: true, type: "error", text: "Archivo no es imagen" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
      setFormData((prev) => ({ ...prev, logo_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    if (!isAdmin) return;
    setLogoPreview("");
    setFormData((prev) => ({ ...prev, logo_url: "" }));
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setAlertData({ show: false, type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlertData({ show: true, type: "error", text: "No autorizado. Inicia sesión." });
        setLoading(false);
        return;
      }

      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });

      const endpoint = formData.id ? `${API}/api/gyms/updated` : `${API}/api/gyms/created`;

      const body = JSON.stringify({
        id: formData.id,
        name: formData.name,
        opening_time: formData.opening_time,
        closing_time: formData.closing_time,
        address: {
          street: formData.address.street,
          colony: formData.address.colony,
          avenue: formData.address.avenue,
          codigoPostal: formData.address.codigoPostal,
          city: formData.address.city,
          state: formData.address.state,
          country: formData.address.country,
        },
        logo_url: formData.logo_url,
      });

      const resp = await fetch(endpoint, { method: "POST", headers, body });
      const text = await resp.text();
      if (resp.ok) {
        setAlertData({
          show: true,
          type: "success",
          text: formData.id ? `Gimnasio actualizado con exito` : `Gracias por registrar tu gimnasio, ${displayName}`,
        });
      } else {
        throw new Error(text);
      }
    } catch (e) {
      setAlertData({ show: true, type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    setLoading(true);
    setAlertData({ show: false, type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlertData({ show: true, type: "error", text: "No autorizado. Inicia sesión." });
        setLoading(false);
        return;
      }

      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });

      const body = JSON.stringify({ id: formData.id });

      const resp = await fetch(`${API}/api/gyms/delete`, { method: "POST", headers, body });
      const text = await resp.text();

      if (resp.ok) {
        setAlertData({ show: true, type: "success", text: "Gimnasio eliminado correctamente." });
        setFormData({
          id: "",
          name: "",
          opening_time: "",
          closing_time: "",
          address: {
            street: "",
            colony: "",
            avenue: "",
            codigoPostal: "",
            city: "",
            state: "",
            country: "",
          },
          logo_url: "",
        });
        setLogoPreview("");
      } else {
        throw new Error(text);
      }
    } catch (e) {
      setAlertData({ show: true, type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  // Si es administrador o colaborador
  const isAdmin = roleName === "Administrador";

  const handlePaste = (e) => {
    if (!isAdmin) return;

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        readFileAsDataURL(file);
        e.preventDefault();
        break;
      }
    }
  };

  const handleDragOver = (e) => {
    if (!isAdmin) return;
    e.preventDefault();
    // Puedes añadir estilos para indicar drop activo si quieres
  };

  const handleDrop = (e) => {
    if (!isAdmin) return;

    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        readFileAsDataURL(file);
      } else {
        setAlertData({ show: true, type: "error", text: "Solo se permiten archivos de imagen." });
      }
    }
  };

  const readFileAsDataURL = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
      setFormData((prev) => ({ ...prev, logo_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Componente encabezado personalizado
  const HeaderComponent = () => (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
      <Grid item>
        <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 30 }}>
          Gimnsasio
        </Typography>
        {isAdmin ? (
          <Typography variant="body2" sx={{ color: "#ccc", marginTop: 1 }}>
            Puedes registrar o modificar los datos de tu gimnasio
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: "#ccc", marginTop: 1 }}>
            Puedes consultar la información del gimnasio que te pertenece
          </Typography>
        )}
      </Grid>
      <Grid item sx={{ display: "flex", alignItems: "center", gap: 1, marginLeft: "15px" }}>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ color: "#F8820B", fontWeight: "bold", fontSize: 20 }}>{displayName}</Typography>
          <Typography variant="body2" sx={{ color: "#ccc", fontSize: 15 }}>
            {roleName}
          </Typography>
        </Box>
        <Avatar sx={{ width: 50, height: 50, bgcolor: "#ff4300", fontWeight: "bold" }}>{usernameInitials}</Avatar>
      </Grid>
    </Grid>
  );

  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
      <HeaderComponent />

      <Grid container spacing={4} sx={{ marginTop: -1 }}>
        {/* Datos básicos */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              bgcolor: "#38393bff",
              borderRadius: 2,
              boxShadow: "0 0 10px #000",
              p: 2,
            }}
          >
            <Typography sx={{ color: "#ffffffff", fontWeight: "bold", mb: 2, fontSize: 18 }}>
              Datos del Gimnasio
            </Typography>

            {/* Labels fuera de inputs */}
            <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>
              Nombre del Gym
            </Typography>
            <input
              type="text"
              value={formData.name}
              disabled={!isAdmin}
              onChange={(e) => handleField("name", e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: errors.name ? "2px solid red" : "1px solid #ccc",
                backgroundColor: !isAdmin ? "#eee" : "white",
                color: !isAdmin ? "#555" : "black",
                marginBottom: 25,
              }}
              placeholder="Nombre del gimnasio"
            />
            {errors.name && <Typography sx={{ color: "red", mb: 1 }}>{errors.name}</Typography>}

            <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>
              Hora de Apertura
            </Typography>
            <input
              type="time"
              value={formData.opening_time}
              disabled={!isAdmin}
              onChange={(e) => handleField("opening_time", e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: errors.opening_time ? "2px solid red" : "1px solid #ccc",
                backgroundColor: !isAdmin ? "#eee" : "white",
                color: !isAdmin ? "#555" : "black",
                marginBottom: 25,
              }}
            />
            {errors.opening_time && <Typography sx={{ color: "red", mb: 1 }}>{errors.opening_time}</Typography>}

            <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>
              Hora de Cierre
            </Typography>
            <input
              type="time"
              value={formData.closing_time}
              disabled={!isAdmin}
              onChange={(e) => handleField("closing_time", e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                border: errors.closing_time ? "2px solid red" : "1px solid #ccc",
                backgroundColor: !isAdmin ? "#eee" : "white",
                color: !isAdmin ? "#555" : "black",
                marginBottom: 25,
              }}
            />
            {errors.closing_time && <Typography sx={{ color: "red", mb: 1 }}>{errors.closing_time}</Typography>}
          </Card>
        </Grid>

        {/* Imagen del logo */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              bgcolor: "#38393bff",
              borderRadius: 2,
              boxShadow: "0 0 10px #000",
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 2, fontSize: 18 }}>Imagen del Logo</Typography>

            {/* Solo mostrar input file a admin */}
            {isAdmin && (
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ mb: 2, fontWeight: "bold", width: "100%", marginBottom: 3 }}
                disabled={loading}
              >
                Seleccionar Imagen
                <input hidden accept="image/*" type="file" onChange={handleLogoFile} disabled={loading} />
              </Button>
            )}

            <Box
              onPaste={handlePaste}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                width: "100%",
                height: 225,
                borderRadius: 2,
                border: "2px dashed #777",
                position: "relative",
                overflow: "hidden",
                bgcolor: "#444",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: isAdmin ? "pointer" : "default",
              }}
            >
              {logoPreview ? (
                <>
                  <Box
                    component="img"
                    src={logoPreview}
                    alt="Logo gimnasio"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {isAdmin && (
                    <IconButton
                      aria-label="Eliminar logo"
                      onClick={removeLogo}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        color: "#ff0000ff",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </>
              ) : (
                <Typography sx={{ color: "#777" }}>
                  {isAdmin ? "Selecciona una imagen o arrástrala aquí" : "No hay imagen seleccionada"}
                </Typography>
              )}
            </Box>

            {errors.logo_url && <Typography sx={{ color: "red", mt: 1 }}>{errors.logo_url}</Typography>}
          </Card>
        </Grid>

        {/* Dirección */}
        <Grid item xs={12}>
          <Card
            sx={{
              bgcolor: "#38393bff",
              borderRadius: 2,
              boxShadow: "0 0 10px #000",
              p: 2,
            }}
          >
            <Typography sx={{ color: "#ffffffff", fontWeight: "bold", mb: 2, fontSize: 18 }}>
              Dirección del Gimnasio
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>Calle</Typography>
                <input
                  type="text"
                  value={formData.address.street}
                  disabled={!isAdmin}
                  onChange={(e) => handleAddrField("street", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: errors["address.street"] ? "2px solid red" : "1px solid #ccc",
                    backgroundColor: !isAdmin ? "#eee" : "white",
                    color: !isAdmin ? "#555" : "black",
                    marginBottom: 15,
                  }}
                  placeholder="Ej: C. Azaleas"
                />
                {errors["address.street"] && (
                  <Typography sx={{ color: "red", mb: 1 }}>{errors["address.street"]}</Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>Avenida</Typography>
                <input
                  type="text"
                  value={formData.address.avenue}
                  disabled={!isAdmin}
                  onChange={(e) => handleAddrField("avenue", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: errors["address.avenue"] ? "2px solid red" : "1px solid #ccc",
                    backgroundColor: !isAdmin ? "#eee" : "white",
                    color: !isAdmin ? "#555" : "black",
                    marginBottom: 15,
                  }}
                  placeholder="Ej: Av. del Paraíso"
                />
                {errors["address.avenue"] && (
                  <Typography sx={{ color: "red", mb: 1 }}>{errors["address.avenue"]}</Typography>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>
                  Código Postal
                </Typography>
                <input
                  type="text"
                  value={formData.address.codigoPostal}
                  disabled={!isAdmin}
                  onChange={onCPChange}
                  maxLength={5}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: errors["address.codigoPostal"] ? "2px solid red" : "1px solid #ccc",
                    backgroundColor: !isAdmin ? "#eee" : "white",
                    color: !isAdmin ? "#555" : "black",
                    marginBottom: 15,
                  }}
                  placeholder="Ej: 77723"
                />
                {errors["address.codigoPostal"] && (
                  <Typography sx={{ color: "red", mb: 1 }}>{errors["address.codigoPostal"]}</Typography>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>Colonia</Typography>
                <input
                  type="text"
                  value={formData.address.colony}
                  disabled={!isAdmin}
                  onChange={(e) => handleAddrField("colony", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: errors["address.colony"] ? "2px solid red" : "1px solid #ccc",
                    backgroundColor: !isAdmin ? "#eee" : "white",
                    color: !isAdmin ? "#555" : "black",
                    marginBottom: 15,
                  }}
                  placeholder="Ej: Misión de las Flores"
                />
                {errors["address.colony"] && (
                  <Typography sx={{ color: "red", mb: 1 }}>{errors["address.colony"]}</Typography>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>Ciudad</Typography>
                <input
                  type="text"
                  value={formData.address.city}
                  disabled={!isAdmin}
                  onChange={(e) => handleAddrField("city", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: errors["address.city"] ? "2px solid red" : "1px solid #ccc",
                    backgroundColor: !isAdmin ? "#eee" : "white",
                    color: !isAdmin ? "#555" : "black",
                    marginBottom: 15,
                  }}
                  placeholder="Ej: Playa del Carmen"
                />
                {errors["address.city"] && (
                  <Typography sx={{ color: "red", mb: 1 }}>{errors["address.city"]}</Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>Estado</Typography>
                <input
                  type="text"
                  value={formData.address.state}
                  disabled={!isAdmin}
                  onChange={(e) => handleAddrField("state", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: errors["address.state"] ? "2px solid red" : "1px solid #ccc",
                    backgroundColor: !isAdmin ? "#eee" : "white",
                    color: !isAdmin ? "#555" : "black",
                    marginBottom: 25,
                  }}
                  placeholder="Ej: Quintana Roo"
                />
                {errors["address.state"] && (
                  <Typography sx={{ color: "red", mb: 1 }}>{errors["address.state"]}</Typography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography sx={{ color: "#F8820B", fontWeight: "bold", mb: 0.5, marginBottom: 1 }}>País</Typography>
                <input
                  type="text"
                  value={formData.address.country}
                  disabled={!isAdmin}
                  onChange={(e) => handleAddrField("country", e.target.value)}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: errors["address.country"] ? "2px solid red" : "1px solid #ccc",
                    backgroundColor: !isAdmin ? "#eee" : "white",
                    color: !isAdmin ? "#555" : "black",
                    marginBottom: 25,
                  }}
                  placeholder="Ej: México"
                />
                {errors["address.country"] && (
                  <Typography sx={{ color: "red", mb: 1 }}>{errors["address.country"]}</Typography>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Errores / alertas justo debajo del formulario y antes de los botones */}
      <Box sx={{ width: "100%", mt: 3, mb: 2 }}>
        {alertData.show && (
          <Alert
            severity={alertData.type}
            sx={{ width: "100%" }}
            iconMapping={{ warning: <WarningAmber fontSize="inherit" /> }}
            onClose={() => setAlertData({ ...alertData, show: false })}
          >
            {alertData.text}
          </Alert>
        )}
      </Box>

      {isAdmin && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", width: "100%" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                fontWeight: "bold",
                minWidth: 180,
                bgcolor: "#F8820B",
                color: "black",
                "&:hover": {
                  bgcolor: "#ff4300", // Color al hacer hover
                  color: "#fff",
                },
              }}
            >
              {formData.id ? "Actualizar Gimnasio" : "Registrar Gimnasio"}
            </Button>

            {formData.id && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteClick}
                disabled={loading}
                sx={{
                  fontWeight: "bold",
                  minWidth: 180,
                  "&:hover": {
                    bgcolor: "#ff0000ff", // Color al hacer hover
                    color: "#fff",
                  },
                }}
              >
                Eliminar Gimnasio
              </Button>
            )}
          </Box>
        </Box>
      )}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            bgcolor: "#2f2f30ff", // fondo oscuro como el card
            color: "#fff", // texto blanco
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "#2f2f30ff", color: "#F8820B", fontWeight: "bold" }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#ddd" }}>
            ¿Estás seguro de eliminar el gimnasio? Se borrarán también productos, membresías y colaboradores
            relacionados.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#2f2f30ff" }}>
          <Button
            onClick={handleCancelDelete}
            disabled={loading}
            sx={{
              color: "#F8820B",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#444", color: "#ffb74d" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={loading}
            autoFocus
            sx={{
              fontWeight: "bold",
              color: "#ff6f61",
              "&:hover": { bgcolor: "#ff0000cc", color: "#fff" },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Colaboradores sólo ven datos */}
    </Grid>
  );
};

export default GymRegistration;
