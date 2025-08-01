// LoginPage.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import timefitLogo from "../../assets/timefit.svg";
import "./Login.css";

export default function Login({ onLogin }) {
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!emailRegex.test(email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }
    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    try {
      // 1) Intentar login como admin
      const loginAdmin = await fetch(`${API}/api/admins/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (loginAdmin.ok) {
        const data = await loginAdmin.json();
        // El servidor devuelve `token` y `admin`
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.admin));
        onLogin(); // Solo ejecutar el callback, AppRoutes manejará la redirección
        return;
      }

      // 2) Intentar login como colaborador
      const loginColab = await fetch(`${API}/api/colaborators/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (loginColab.ok) {
        const data = await loginColab.json();
        // El servidor devuelve `token` y `colaborator`
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.colaborator));
        onLogin(); // Solo ejecutar el callback, AppRoutes manejará la redirección
        return;
      }

      // 3) Si ambos fallan
      const errorData = await loginColab.json();
      setError(errorData.message || "Credenciales inválidas.");
    } catch (err) {
      console.error("Error de red o servidor:", err);
      setError("Error de red. Intenta más tarde.");
    }
  };

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
              type="password"
              name="password"
              placeholder="Escriba aquí su contraseña"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};