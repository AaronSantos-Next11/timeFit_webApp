import React from "react";
import "./Login.css"; // Importamos los estilos


const Login = () => {
  return (
    <div className="login-container">
      {/* Sección de la imagen */}
      <div className="login-image">
        <img src="https://escueladfitness.com/wp-content/uploads/2022/09/entrenador.jpg" alt="Entrenador en gimnasio" />
        <button className="back-button">← Regresar a la página web</button>
      </div>

      {/* Sección del formulario */}
      <div className="login-form">
        <h1>Bienvenido de vuelta</h1>
        <p>Si aún no tienes cuenta, <a href="#">regístrate aquí</a></p>

        <label>Correo electrónico</label>
        <input type="email" placeholder="Escriba aquí su correo electrónico" />

        <label>Contraseña</label>
        <input type="password" placeholder="Escriba aquí su contraseña" />

        {/* ✅ Alineación corregida del checkbox */}
        <div className="login-options">
          <label>
            <input type="checkbox" /> Recordarme la contraseña
          </label>
          <a href="#">¿Olvidó su contraseña?</a>
        </div>

        <button className="login-button">Iniciar sesión</button>

        <div className="separator">o iniciar sesión con</div>

        {/* Botones de redes sociales */}
        <div className="social-buttons">
          <button className="google-button">G Iniciar sesión con Google</button>
          <button className="microsoft-button">⊞ Iniciar sesión con Microsoft</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
