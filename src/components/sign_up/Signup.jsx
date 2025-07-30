import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import timefitLogo from "../../assets/timefit.svg";

import "./SignUp.css";

export default function SignUp({ onSignUp }) {
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const validateUsername = (u) => u.length >= 3;
  const validateName = (n) => n.length >= 2;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function generarMatriculaProfesional(nombre, apellidos) {
  const fecha = new Date();
  const yy = String(fecha.getFullYear()).slice(-2);
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");

  const nombreClean = nombre.trim().toUpperCase().replace(/\s+/g, "");
  const apellidosClean = apellidos.trim().toUpperCase().replace(/\s+/g, "");

  const parteNombre = nombreClean.slice(0, 3).padEnd(3, "X");
  const parteApellido = apellidosClean.slice(0, 3).padEnd(3, "X");

  const fechaStr = `${yy}${mm}${dd}`;

  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let aleatorio = "";
  for (let i = 0; i < 4; i++) {
    aleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }

  return `ADM-${parteNombre}${parteApellido}${fechaStr}-${aleatorio}`;
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirm = e.target.confirmPassword.value;
    const matriculaAdmin = generarMatriculaProfesional(firstName, lastName);


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
          admin_code: matriculaAdmin, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al registrarse. Intente nuevamente.");
        return;
      }

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(data.admin));
      localStorage.setItem("token", data.token);

      setError("");
      onSignUp(); // Solo ejecutar el callback, AppRoutes manejará la redirección
    } catch (err) {
      console.error(err);
      setError("Error al registrarse. Intente nuevamente.");
    }
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
                type="password"
                name="password"
                placeholder="Ingrese una contraseña"
                required
              />
            </div>

            <label>Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repite tu contraseña"
                required
              />
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