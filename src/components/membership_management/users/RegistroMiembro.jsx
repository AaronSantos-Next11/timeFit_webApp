import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Grid, TextField, Typography, Box, Grow } from "@mui/material";
import { Divider } from "antd";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"; // Importa el ícono de flecha

export default function RegistroMiembro({ isOpen, onClose }) {
  // Variables de datos generales
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [motherLastName, setMotherLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [rfc, setRfc] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");

  // Variables de dirección
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [colonia, setColonia] = useState("");
  const [street, setStreet] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [numExt, setNumExt] = useState("");
  const [numInt, setNumInt] = useState("");

  // Variables de membresía
  const [membershipType, setMembershipType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [tryner, setTryner] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Estilos para los TextField
  const textFieldStyle = {
    input: { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "white" },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "white" },
    },
    "& .MuiInputLabel-root": { color: "white" },
    "& .MuiInputLabel-root.Mui-focused": { color: "white" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      lastName,
      motherLastName,
      birthDate,
      rfc,
      email,
      phone,
      emergencyContact,
      emergencyContactName,
      country,
      state,
      city,
      colonia,
      street,
      zipCode,
      numExt,
      numInt,
      membershipType,
      startDate,
      tryner,
      paymentMethod,
    });
  };

  return (
    <Grow in={isOpen} timeout={500} unmountOnExit>
      <Box
        sx={{
          width: "70%",
          maxWidth: "1200px",
          margin: "0 auto",
          marginLeft: "10%",
          backgroundColor: "#363636",
          padding: "20px",
          borderRadius: "30px 30px 8px 8px",
          color: "white",
        }}
      >
        {/* box naranja para el texto */}
        <Box
          sx={{
            width: "calc(100% + 40px)",
            marginLeft: "-20px",
            marginTop: "-20px",
            backgroundColor: "#FF6600",
            borderRadius: "30px",
            padding: "10px",
            textAlign: "left",
            marginBottom: "20px",
            display: "flex", // Para alinear la flecha y el texto horizontalmente
            alignItems: "center", // Centra verticalmente la flecha y el texto
          }}
        >
          {/* Flecha */}
          <ArrowBackIosIcon
            sx={{
              color: "black", // Color de la flecha
              marginRight: "10px", // Espacio entre la flecha y el texto
              cursor: "pointer", // Cambia el cursor a "pointer" para indicar que es clickeable

            }}
            onClick={onClose} // Llama a la función onClose al hacer clic

          />
          <Typography variant="h6" color="black">
            Registro de nuevo miembro:
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom color="white">
            Datos Generales
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Apellido Paterno"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Apellido Materno"
                value={motherLastName}
                onChange={(e) => setMotherLastName(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="RFC"
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Correo"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Teléfono"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Contacto de Emergencia"
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Nombre del Contacto de Emergencia"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>
          <Divider style={{ backgroundColor: "white", margin: "20px 0" }} />
          <Typography variant="h4" gutterBottom color="white">
            Dirección
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="País"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Estado"
                value={state}
                onChange={(e) => setState(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Colonia"
                value={colonia}
                onChange={(e) => setColonia(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Calle"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Código Postal"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Número Exterior"
                value={numExt}
                onChange={(e) => setNumExt(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Número Interior"
                value={numInt}
                onChange={(e) => setNumInt(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>
          <Divider style={{ backgroundColor: "white", margin: "20px 0" }} />
          <Typography variant="h4" gutterBottom color="white">
            Membresía
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Tipo de Membresía"
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Fecha de Inicio"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Entrenador"
                value={tryner}
                onChange={(e) => setTryner(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                variant="standard"
                fullWidth
                label="Método de Pago"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={textFieldStyle}
              />
            </Grid>
          </Grid>

          <Box sx={{ marginTop: "20px" }}>
            <Button variant="contained" color="error" type="submit">
              Registrar
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={onClose}
              sx={{ marginLeft: "10px" }}
            >
              Cerrar
            </Button>
          </Box>
        </form>
      </Box>
    </Grow>
  );
}

RegistroMiembro.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};