import PropTypes from "prop-types";
import { useState } from "react";
import { Button, Grid, TextField, Typography, Box, Grow } from "@mui/material";
import { Divider } from "antd";
import NorthIcon from "@mui/icons-material/North"; // Importa el ícono de flecha
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";

export default function RegistroMiembro({ isOpen, onClose, addUser }) {
  const [isClosing, setIsClosing] = useState(false);

  const [openRegistradoExito, setOpenRegistradoExito] = React.useState(false);

  // Función para abrir el Snackbar
  const RegistradoExito = () => {
    setOpenRegistradoExito(true); // Abre el Snackbar al presionar el botón
  };

  // Función para cerrar el Snackbar
  const cerrarSnack = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenRegistradoExito(false); // Cierra el Snackbar
  };

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
  const [endDate, setEndDate] = useState("");
  const [tryner, setTryner] = React.useState("");

  // variables de pago
  const [paymentMethod, setPaymentMethod] = React.useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");

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
    const newUser = {
      miembro: `${name} ${lastName} ${motherLastName}`,
      id: `#${Math.floor(Math.random() * 1000)}`, // Genera un ID aleatorio
      correo: email,
      telefono: phone,
      fecha: new Date().toLocaleDateString(), // Fecha actual
      estatus: "Activo",
    };

    addUser(newUser); // Agrega el nuevo usuario
    RegistradoExito(); // Muestra el mensaje de éxito
    onClose(); // Cierra el modal
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500); // Ajusta el tiempo para que coincida con la duración de la animación
  };

  return (
    <>
      {/* Fondo oscuro con animación */}
      <Grow in={isOpen && !isClosing} timeout={500} unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1200, // Asegura que esté por encima de todo
          }}
        >
          {/* Modal con animación */}
          <Grow in={isOpen && !isClosing} timeout={500} unmountOnExit>
            <Box
              sx={{
                width: "70%",
                maxWidth: "1200px",
                maxHeight: "90vh", // Altura máxima del modal

                backgroundColor: "#363636",
                padding: "20px",
                borderRadius: "30px 30px 8px 8px",
                color: "white",
              }}
            >
              {/* Box naranja para el texto */}
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
                <NorthIcon
                  sx={{
                    color: "black", // Color de la flecha
                    marginRight: "10px", // Espacio entre la flecha y el texto
                    cursor: "pointer", // Cambia el cursor a "pointer" para indicar que es clickeable
                    transform: "rotate(-90deg)", // Rota el ícono 90 grados hacia la izquierda
                  }}
                  onClick={handleClose} // Llama a la función handleClose al hacer clic
                />
                <Typography variant="h6" color="black">
                  Registro de nuevo miembro:
                </Typography>
              </Box>
              <Box
                sx={{
                  maxHeight: "calc(90vh - 100px)", // Altura máxima del contenido
                  padding: "20px",
                  overflowY: "auto", // Permite el desplazamiento vertical
                }}
              >
                <form onSubmit={handleSubmit}>
                  {/* Datos generales */}
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        variant="standard"
                        fullWidth
                        label="Nombre del Contacto de Emergencia"
                        value={emergencyContactName}
                        onChange={(e) =>
                          setEmergencyContactName(e.target.value)
                        }
                        sx={textFieldStyle}
                        color="warning"
                      />
                    </Grid>
                  </Grid>

                  {/* Datos de direccion */}
                  <Divider
                    style={{ backgroundColor: "white", margin: "20px 0" }}
                  />
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
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
                        color="warning"
                      />
                    </Grid>
                  </Grid>
                  <Divider
                    style={{ backgroundColor: "white", margin: "20px 0" }}
                  />

                  {/* CUESTIONARIO DE MEMBRESIAS */}
                  <Typography variant="h4" gutterBottom color="white">
                    Membresía
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={4}>
                      <FormControl
                        variant="standard"
                        fullWidth
                        sx={{ ...textFieldStyle }}
                        color="warning"
                      >
                        <InputLabel id="demo-simple-select-label">
                          Tipo de Membresía
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={membershipType}
                          label="Tipo de Membresía"
                          onChange={(e) => setMembershipType(e.target.value)}
                          sx={textFieldStyle}
                          color="warning"
                        >
                          <MenuItem value={"1"} color="warning">
                            Gym Rookie
                          </MenuItem>
                          <MenuItem value={"2"}>Iron Warrior</MenuItem>
                          <MenuItem value={"3"}>Titan Pro</MenuItem>
                          <MenuItem value={"4"}>Lord</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        variant="standard"
                        fullWidth
                        label="Inicio de Membresía"
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
                        label="Fin de Membresía"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl
                        variant="standard"
                        fullWidth
                        sx={{ ...textFieldStyle }}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Entrenador
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={tryner}
                          label="Entrenador"
                          onChange={(e) => setTryner(e.target.value)}
                          sx={textFieldStyle}
                        >
                          <MenuItem value={"Entrenador 1"}>
                            Entrenador 1
                          </MenuItem>
                          <MenuItem value={"Entrenador 2"}>
                            Entrenador 2
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* INFORMACION DE PAGO */}
                  <Divider
                    style={{ backgroundColor: "white", margin: "20px 0" }}
                  />
                  <Typography variant="h4" gutterBottom color="white">
                    Informacion de pago
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={4}>
                      <FormControl
                        variant="standard"
                        fullWidth
                        sx={{ ...textFieldStyle }}
                      >
                        <InputLabel id="demo-simple-select-label">
                          Método de Pago
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={paymentMethod}
                          label="Método de Pago"
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          sx={textFieldStyle}
                        >
                          <MenuItem value={"Tarjeta de Crédito"}>
                            Tarjeta de Crédito
                          </MenuItem>
                          <MenuItem value={"Tarjeta de Debito"}>
                            Tarjeta de Debito
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        variant="standard"
                        fullWidth
                        label="Nombre de la tarjeta"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        variant="standard"
                        fullWidth
                        label="Número de tarjeta"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        variant="standard"
                        fullWidth
                        label="Fecha de Expiración"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        sx={textFieldStyle}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        variant="standard"
                        fullWidth
                        label="CVV"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        sx={textFieldStyle}
                      />
                    </Grid>
                  </Grid>

                  {/* BOTONES */}

                  <Box sx={{ marginTop: "20px" }}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#F8820B",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "#da7635",
                        },
                      }}
                      type="submit"
                    >
                      Registrar
                    </Button>

                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={handleClose}
                      sx={{
                        color: "white",
                        border: "1px solid #F8820B",
                        backgroundColor: "black",
                        "&:hover": {
                          backgroundColor: "#F8820B",
                          color: "white",
                        },
                        marginLeft: "10px",
                      }}
                    >
                      Cerrar
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </Grow>
        </Box>
      </Grow>
      {/* Snackbar para mostrar el mensaje de éxito */}
      <Snackbar
        open={openRegistradoExito}
        autoHideDuration={12000}
        onClose={cerrarSnack}
        message="Registrado con éxito"
      />
    </>
  );
}

RegistroMiembro.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
};