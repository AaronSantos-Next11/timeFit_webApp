import React, { useState } from "react";
import PropTypes from "prop-types";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import timefitLogo from "../../assets/timefit.svg";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Firebase imports
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase-config";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const SignUp = ({ onSignUp }) => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{6,}$/;
    return usernameRegex.test(username);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?$/;
    return name && nameRegex.test(name) && name.length >= 2;
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get form values
    const username = e.target.username.value.trim();
    const fullName = e.target.firstName.value.trim();
    const fullLastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Validate inputs
    if (!validateUsername(username)) {
      setError("Nombre de usuario inválido. Debe tener al menos 6 caracteres y contener letras, números o guiones bajos.");
      return;
    }

    if (!validateName(fullName)) {
      setError("Nombre inválido. Debe comenzar con mayúscula y tener al menos 2 caracteres.");
      return;
    }

    if (!validateName(fullLastName)) {
      setError("Apellidos inválidos. Deben comenzar con mayúscula y tener al menos 2 caracteres.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Ingrese un correo electrónico válido");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, incluir letras, números y un símbolo especial");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!termsAccepted) {
      setError("Debe aceptar los Términos y Condiciones");
      return;
    }

    try {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      
      // Check if email already exists
      const emailQuery = query(usersRef, where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        setError("El correo electrónico ya está registrado");
        return;
      }

      // Check if username already exists
      const usernameQuery = query(usersRef, where("username", "==", username));
      const usernameSnapshot = await getDocs(usernameQuery);
      
      if (!usernameSnapshot.empty) {
        setError("El nombre de usuario ya está en uso");
        return;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        fullName: fullName,
        fullLastName: fullLastName,
        email: email,
        role: "admin",
        createdAt: new Date()
      });

      // Store information in localStorage
      localStorage.setItem("displayName", `${fullName} ${fullLastName}`);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);

      // Clear errors
      setError("");
      
      // Call login function and navigate
      onSignUp();
      navigate("/home");

    } catch (error) {
      console.error("Error al registrarse:", error);
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("El correo electrónico ya está registrado");
          break;
        case "auth/invalid-email":
          setError("El correo electrónico no es válido");
          break;
        default:
          setError("Error al registrarse. Intente nuevamente.");
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const db = getFirestore();
      
      // Check if the user already exists
      const userQuery = query(collection(db, "users"), where("email", "==", user.email));
      const userSnapshot = await getDocs(userQuery);

      // Default names if not available
      const fullName = user.displayName?.split(' ')[0] || 'Usuario';
      const fullLastName = user.displayName?.split(' ')[1] || 'Google';
      const username = user.email.split('@')[0];

      if (userSnapshot.empty) {
        // Create document if it doesn't exist
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          fullName: fullName,
          fullLastName: fullLastName,
          email: user.email,
          role: "admin",
          createdAt: new Date(),
          photoURL: user.photoURL
        });
      }

      // Store information in localStorage
      localStorage.setItem("displayName", `${fullName} ${fullLastName}`);
      localStorage.setItem("username", username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("photoURL", user.photoURL || "");

      onSignUp();
      navigate("/home");

    } catch (error) {
      console.error("Error en registro con Google:", error);
      
      // More descriptive error handling
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Registro con Google cancelado");
      } else {
        setError("Error al registrarse con Google");
      }
    }
  };

  const togglePasswordVisibility = (type) => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-image">
        <img
          src="https://st2.depositphotos.com/1017228/8310/i/450/depositphotos_83109326-stock-photo-fitness-man-standing-with-arms.jpg"
          alt="Entrenador en gimnasio"
        />
        <button
          className="back-button"
          onClick={() => (window.location.href = "https://landing-page-time-fit.vercel.app/")}
        >
          ← Regresar a la página web
        </button>
      </div>

      <div className="signup-form">
        <div className="signup-form-content">
          <div className="logo-container">
            <img src={timefitLogo} alt="Time Fit Logo" />
            <span>Time Fit / Admin</span>
          </div>

          <h1>Regístrate</h1>
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Inicie sesión aquí</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <label>Elija un nombre de usuario</label>
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
                  placeholder="Escriba aquí su nombre"
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

            <label>Elija una contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Escriba aquí su contraseña"
                required
              />
              <button 
                type="button" 
                className="toggle-password-button" 
                onClick={() => togglePasswordVisibility('password')}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            <label>Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Escriba nuevamente su contraseña"
                required
              />
              <button 
                type="button" 
                className="toggle-password-button" 
                onClick={() => togglePasswordVisibility('confirmPassword')}
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
    </div>
  );
};

SignUp.propTypes = {
  onSignUp: PropTypes.func.isRequired
};

export default SignUp;