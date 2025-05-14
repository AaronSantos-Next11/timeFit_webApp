// LoginPage.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase-config";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import timefitLogo from "../../assets/timefit.svg";
import "./Login.css";

export default function Login({ onLogin }) {
  const [error, setError] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!emailRegex.test(email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      onLogin();
      navigate("/home");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      switch (err.code) {
        case "auth/user-not-found":
          setError("El correo electrónico no está registrado.");
          break;
        case "auth/wrong-password":
          setError("La contraseña es incorrecta.");
          break;
        case "auth/invalid-email":
          setError("El correo electrónico tiene un formato incorrecto.");
          break;
        case "auth/too-many-requests":
          setError("Demasiados intentos fallidos. Intente más tarde.");
          break;
        default:
          setError("Error al iniciar sesión. Verifique sus credenciales.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
      navigate("/home");
    } catch (err) {
      console.error("Error en autenticación con Google:", err);
      setError("Error al iniciar sesión con Google.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((v) => !v);
  };

  const openForgotModal = (e) => {
    e.preventDefault();
    setIsForgotPasswordOpen(true);
  };
  const closeForgotModal = () => setIsForgotPasswordOpen(false);

  return (
    <div className="login-container">
      <div className="login-image">
        <img
          src="https://escueladfitness.com/wp-content/uploads/2022/09/entrenador.jpg"
          alt="Entrenador en gimnasio"
        />
      </div>

      <div className="login-form">
        <div className="logo-container">
          <img src={timefitLogo} alt="Time Fit Logo" />
          <span>Time Fit / Admin</span>
        </div>

        <h1>Bienvenido de vuelta</h1>
        <p>
          Si aún no tienes cuenta, <Link to="/sign_up">regístrate aquí</Link>
        </p>
        <h4>Por favor, inicie sesión con su cuenta.</h4>

        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Escriba aquí su correo electrónico"
            required
            autoComplete="username"
          />

          <label>Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Escriba aquí su contraseña"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password-button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Mantener la sesión iniciada
            </label>
            <a href="#" onClick={openForgotModal}>
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
        </div>
      </div>

      {isForgotPasswordOpen && (
        <ForgotPasswordModal isOpen onClose={closeForgotModal} />
      )}
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

// ----------------------------------------------------------

function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const stopProp = (e) => e.stopPropagation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Por favor, ingrese su correo electrónico");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");
      await sendPasswordResetEmail(auth, email);
      setLoading(false);
      setStep(2);
    } catch (err) {
      setLoading(false);
      switch (err.code) {
        case "auth/invalid-email":
          setErrorMsg("El correo electrónico no es válido.");
          break;
        case "auth/user-not-found":
          setErrorMsg("No se encontró una cuenta con este correo.");
          break;
        case "auth/too-many-requests":
          setErrorMsg("Demasiados intentos. Intente más tarde.");
          break;
        default:
          setErrorMsg("Ocurrió un error. Intenta nuevamente.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={stopProp}>
        {step === 1 ? (
          <>
            <h2>Recuperar contraseña</h2>
            <p className="modal-description">
              Ingresa tu correo y recibirás un enlace para restablecer tu
              contraseña.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reset-email">Correo electrónico</label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo"
                  disabled={loading}
                />
              </div>
              {errorMsg && <p className="error-message">{errorMsg}</p>}
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="confirmation-container">
            <div className="confirmation-icon">✓</div>
            <h2>Correo enviado</h2>
            <p>
              Hemos enviado un enlace a <strong>{email}</strong>. Revisa tu
              bandeja de entrada.
            </p>
            <p className="note">
              Si no lo ves, revisa tu carpeta de spam.
            </p>
            <button className="close-button" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

ForgotPasswordModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
