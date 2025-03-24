import React, { useState } from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";
import timefitLogo from "../../assets/timefit.svg";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Importaciones de Firebase (ajustar según configuración)
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase-config";
import { getFirestore, doc, setDoc, query, collection, where, getDocs } from "firebase/firestore";

const SignUp = ({ onSignUp }) => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Enhanced validation functions
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*(\*?[a-zA-Z0-9]+)*$/;
    
    return username && 
           username.length >= 6 && 
           usernameRegex.test(username) && 
           username.charAt(0) !== '0';
  };

  const validateName = (name) => {
    const nameRegex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/;
    
    return name && 
           nameRegex.test(name) && 
           name.length >= 2;
  };

  const validateSurname = (surname) => {
    const surnameRegex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/;
    
    return surname && 
           surnameRegex.test(surname) && 
           surname.length >= 2;
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value.trim();
    const fullFirstName = e.target.firstName.value.trim();
    const fullLastName = e.target.lastName.value.trim();
    
    // Take only the first word for first name and last name
    const firstName = fullFirstName.split(' ')[0];
    const lastName = fullLastName.split(' ')[0];
    
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Check if email already exists
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      setError("El correo electrónico ya está registrado");
      return;
    }

    // Validate Username
    if (!validateUsername(username)) {
      setError("Nombre de usuario inválido. Debe comenzar con una letra, tener al menos 6 caracteres y contener solo letras y números.");
      return;
    }

    // Validate First Name
    if (!validateName(firstName)) {
      setError("Nombre inválido. Debe contener solo letras, comenzar con mayúscula y tener al menos 2 caracteres.");
      return;
    }

    // Validate Last Name
    if (!validateSurname(lastName)) {
      setError("Apellidos inválidos. Deben contener solo letras, comenzar con mayúscula y tener al menos 2 caracteres.");
      return;
    }

    // Validate Email
    if (!emailRegex.test(email)) {
      setError("Ingrese un correo electrónico válido");
      return;
    }

    // Validate Password
    if (!passwordRegex.test(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, incluir letras, números y un símbolo especial");
      return;
    }

    // Check Password Match
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Terms Acceptance
    if (!termsAccepted) {
      setError("Debe aceptar los Términos y Condiciones");
      return;
    }

    try {
      // Registro con Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add additional user information to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        firstName: firstName,
        lastName: lastName,
        fullFirstName: fullFirstName,
        fullLastName: fullLastName,
        email: email
      });

      // Store user details in localStorage
      localStorage.setItem("displayName", `${firstName} ${lastName}`);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("username", username);

      setError("");
      onSignUp();
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
      const token = await user.getIdToken();

      // Split display name into first name and last name
      const nameParts = user.displayName ? user.displayName.split(' ') : ['Usuario', ''];
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts[1] : '';

      // Store Google user details in localStorage
      localStorage.setItem("displayName", `${firstName} ${lastName}`.trim());
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      localStorage.setItem("photoURL", user.photoURL || "");
      localStorage.setItem("authToken", token);

      // Optional: Add Google user to Firestore
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        photoURL: user.photoURL
      }, { merge: true });

      onSignUp();
    } catch (error) {
      console.error("Error en registro con Google:", error);
      setError("Error al registrarse con Google");
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
          src="https://escueladfitness.com/wp-content/uploads/2022/09/entrenador.jpg"
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
              <button type="button" className="microsoft-button">
                <span>
                  <MicrosoftIcon />
                </span>
                Registrarse con Microsoft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;