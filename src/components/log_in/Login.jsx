import React from "react";
import "./Login.css";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { Link } from "react-router-dom";
import timefitLogo from "../../assets/timefit.svg";
import MicrosoftIcon from "@mui/icons-material/Microsoft";

// Importaciones de firebases
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase-config"; // Ajusta la ruta según tu estructura

import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = ({ onLogin }) => {
  const [error, setError] = React.useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  // Credenciales hardcodeadas (solo para pruebas)
  const validCredentials = [
    { email: "usuario1@example.com", password: "contraseña1" },
    { email: "usuario2@example.com", password: "contraseña2" },
    { email: "usuario3@example.com", password: "contraseña3" },
  ];

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      // Intenta iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setError("");

      // Obtén el token de identificación del usuario
      const token = await userCredential.user.getIdToken();

      // Almacena el token según la preferencia del usuario
      if (rememberMe) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }

      // Actualiza el estado de autenticación en la aplicación
      onLogin();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Correo o contraseña incorrectos.");
    }
  };

  // Autenticacion con google
  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("authToken", token); // Puedes ajustar si prefieres sessionStorage
      onLogin();
    } catch (error) {
      console.error("Error en autenticación con Google:", error);
      setError("Error al iniciar sesión con Google.");
    }
  };

  // Función para abrir el modal de recuperación de contraseña
  const openForgotPasswordModal = (e) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  };

  // Función para cerrar el modal
  const closeForgotPasswordModal = () => {
    setIsForgotPasswordOpen(false);
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="https://escueladfitness.com/wp-content/uploads/2022/09/entrenador.jpg" alt="Entrenador en gimnasio" />
        <button
          className="back-button"
          onClick={() => (window.location.href = "https://landing-page-time-fit.vercel.app/")}
        >
          ← Regresar a la página web
        </button>
      </div>

      <div className="login-form">
        <div className="logo-container">
          <img src={timefitLogo} alt="Time Fit Logo" />
          <span>Time Fit / Admin</span>
        </div>

        <h1>Bienvenido de vuelta</h1>
        <p>
          Si aún no tienes cuenta, <Link to="/sign_up">registrate aqui</Link>
        </p>

        <h4>Por favor, inicie sesión con su cuenta.</h4>

        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Escriba aquí su correo electrónico"
            required
            autocomplete="username"
          />

          <label>Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Escriba aquí su contraseña"
              required
              autocomplete="current-password"
            />
            <button type="button" className="toggle-password-button" onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Mantener la sesión iniciada
            </label>
            <a href="#" onClick={openForgotPasswordModal}>
              ¿Olvidó su contraseña?
            </a>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>

        <div className="separator">o iniciar sesión con</div>

        <div className="social-buttons">
          <button className="google-button" onClick={handleGoogleSignIn}>
            <span>
              <GoogleIcon />
            </span>
            Iniciar sesión con Google
          </button>
          <button className="microsoft-button">
            <span>
              <MicrosoftIcon />
            </span>
            Iniciar sesión con Microsoft
          </button>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={closeForgotPasswordModal} />
    </div>
  );
};

export default Login;
