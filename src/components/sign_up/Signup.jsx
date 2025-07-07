import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import timefitLogo from "../../assets/timefit.svg";

import "./SignUp.css";

export default function SignUp({ onSignUp }) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const validateUsername = (u) => u.length >= 3;
  const validateName = (n) => n.length >= 2;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirmPassword.value;

    if (!validateUsername(username)) {
      setError("Nombre de usuario debe tener al menos 3 caracteres.");
      return;
    }
    if (!validateName(firstName)) {
      setError("Nombre debe tener al menos 2 caracteres.");
      return;
    }
    if (!validateName(lastName)) {
      setError("Apellidos deben tener al menos 2 caracteres.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Ingrese un correo electrónico válido");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!termsAccepted) {
      setError("Debes aceptar los Términos y Condiciones");
      return;
    }

    try {
      const response = await fetch(`${API}/api/admins/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name: firstName,
          last_name: lastName,
          email,
          password,
          admin_code: "CRX2025", // código estático o genera uno dinámico si gustas
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al registrarse. Intente nuevamente.");
        return;
      }

      // Guardar en localStorage
      localStorage.setItem("admin", JSON.stringify(data.admin));
      localStorage.setItem("token", data.token);

      setError("");
      onSignUp(); // disparar la función de callback
      navigate("/home"); // redireccionar al dashboard
    } catch (err) {
      console.error(err);
      setError("Error al registrarse. Intente nuevamente.");
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") setShowPassword((v) => !v);
    else setShowConfirmPassword((v) => !v);
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="signup-form-content">
          <div className="logo-container">
            <img src={timefitLogo} alt="Time Fit Logo" />
            <span>Time Fit / Admin</span>
          </div>

          <h1>Regístrate</h1>
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <label>Elige un nombre de usuario</label>
            <input
              type="text"
              name="username"
              placeholder="Escriba aquí su nombre de usuario"
              required
            />

            <div className="name-row">
              <div>
                <label>Nombre(s)</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Escriba aquí su nombre(s)"
                  required
                />
              </div>
              <div>
                <label>Apellidos</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Escriba aquí sus apellidos"
                  required
                />
              </div>
            </div>

            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="Escriba aquí su correo electrónico"
              required
            />

            <label>Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Ingrese una contraseña"
                required
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={() => togglePasswordVisibility("password")}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            <label>Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                required
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            <div className="terms-container">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms">
                Acepto los <a href="/Condiction">Términos y Condiciones</a>
              </label>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="signup-button">
              Registrarse
            </button>
          </form>
        </div>
      </div>
      <div className="signup-image">
        <img
          src="https://st2.depositphotos.com/1017228/8310/i/450/depositphotos_83109326-stock-photo-fitness-man-standing-with-arms.jpg"
          alt="Entrenador en gimnasio"
        />
      </div>
    </div>
  );
}

SignUp.propTypes = {
  onSignUp: PropTypes.func.isRequired,
};
