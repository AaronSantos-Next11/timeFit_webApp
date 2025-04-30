// SignUp.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import timefitLogo from "../../assets/timefit.svg";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, googleProvider } from "../../firebase/firebase-config";

import "./SignUp.css";

export default function SignUp({ onSignUp }) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

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
      setError(
        "La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, una minúscula y un número"
      );
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
      const db = getFirestore();
      const uc = await createUserWithEmailAndPassword(auth, email, password);
      const user = uc.user;
      await setDoc(doc(db, "users", user.uid), {
        username,
        fullName: firstName,
        fullLastName: lastName,
        email,
        role: "admin",
        createdAt: new Date(),
      });
      localStorage.setItem("displayName", `${firstName} ${lastName}`);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);

      setError("");
      onSignUp();
      navigate("/home");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("El correo electrónico ya está registrado");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil");
      } else {
        setError("Error al registrarse. Intente nuevamente.");
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const uc = await signInWithPopup(auth, googleProvider);
      const user = uc.user;
      const db = getFirestore();
      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const snap = await getDocs(q);
      const [first = "Usuario", last = "Google"] = user.displayName
        ? user.displayName.split(" ")
        : [];
      const username = user.email.split("@")[0];

      if (snap.empty) {
        await setDoc(doc(db, "users", user.uid), {
          username,
          fullName: first,
          fullLastName: last,
          email: user.email,
          role: "admin",
          createdAt: new Date(),
          photoURL: user.photoURL,
        });
      }

      localStorage.setItem("displayName", `${first} ${last}`);
      localStorage.setItem("username", username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("photoURL", user.photoURL || "");

      onSignUp();
      navigate("/home");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Registro con Google cancelado");
      } else {
        setError("Error al registrarse con Google");
      }
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
                  placeholder="Escriba aquí  sus apellidos"
                  required
                />
              </div>
            </div>

            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="Escriba aquí su correo electronico"
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

            <div className="separator">o registrarte con</div>
            <div className="social-buttons">
              <button
                type="button"
                className="google-button"
                onClick={handleGoogleSignUp}
              >
                <span>
                  <GoogleIcon />
                </span>
                Registrarse con Google
              </button>
            </div>
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
