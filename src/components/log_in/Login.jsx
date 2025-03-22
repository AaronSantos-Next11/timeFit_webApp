import React from "react";
import "./Login.css"; 

const Login = ({ onLogin }) => {
  const [error, setError] = React.useState("");

  // Credenciales hardcodeadas (solo para pruebas)
  const validCredentials = [
    { email: "usuario1@example.com", password: "contraseña1" },
    { email: "usuario2@example.com", password: "contraseña2" },
    { email: "usuario3@example.com", password: "contraseña3" },
  ];

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    // Validación básica de campos vacíos
    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    // Verifica si las credenciales coinciden con alguna de las hardcodeadas
    const isValidUser = validCredentials.some(
      (cred) => cred.email === email && cred.password === password
    );

    if (isValidUser) {
      setError(""); // Limpia el mensaje de error
      onLogin(); // Llama a onLogin para actualizar el estado de autenticación
    } else {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container">
      {/* Sección de la imagen */}
      <div className="login-image">
        <img
          src="https://escueladfitness.com/wp-content/uploads/2022/09/entrenador.jpg"
          alt="Entrenador en gimnasio"
        />
        <button className="back-button">← Regresar a la página web</button>
      </div>

      {/* Sección del formulario */}
      <div className="login-form">
        <h1>Bienvenido de vuelta</h1>
        <p>
          Si aún no tienes cuenta, <a href="#">regístrate aquí</a>
        </p>

        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit}>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Escriba aquí su correo electrónico"
            required 
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Escriba aquí su contraseña"
            required // Campo obligatorio
          />

          {/* Opciones adicionales */}
          <div className="login-options">
            <label>
              <input type="checkbox" /> Recordarme la contraseña
            </label>
            <a href="#">¿Olvidó su contraseña?</a>
          </div>

          {/* Mensaje de error */}
          {error && <p className="error-message">{error}</p>}

          {/* Botón de inicio de sesión */}
          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>

        {/* Separador */}
        <div className="separator">o iniciar sesión con</div>

        {/* Botones de redes sociales */}
        <div className="social-buttons">
          <button className="google-button">G Iniciar sesión con Google</button>
          <button className="microsoft-button">
            ⊞ Iniciar sesión con Microsoft
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;