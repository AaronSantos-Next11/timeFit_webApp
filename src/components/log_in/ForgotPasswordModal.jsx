import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase-config"; // Adjust the import path
import './ForgotPassword.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); 
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Evitar que los clics dentro del modal cierren el modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar el correo electrónico
    if (!email) {
      setErrorMessage('Por favor, ingrese su correo electrónico');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Enviar correo de restablecimiento de contraseña con Firebase
      await sendPasswordResetEmail(auth, email);
      
      setIsLoading(false);
      setStep(2); 
      
    } catch (error) {
      setIsLoading(false);
      
      // Manejo de errores específicos de Firebase
      switch (error.code) {
        case 'auth/invalid-email':
          setErrorMessage('El correo electrónico no es válido.');
          break;
        case 'auth/user-not-found':
          setErrorMessage('No se encontró una cuenta con este correo electrónico.');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Demasiados intentos. Por favor, intente más tarde.');
          break;
        default:
          setErrorMessage(`Ocurrió un error al enviar el correo. Inténtelo nuevamente.`);
      }
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={handleModalClick}>
        {step === 1 ? (
          
          <>
            <h2>Recuperar contraseña</h2>
            <p className="modal-description">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  disabled={isLoading}
                />
              </div>
              
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              
              <div className="modal-buttons">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </div>
            </form>
          </>
        ) : (
          
          <>
            <div className="confirmation-container">
              <div className="confirmation-icon">✓</div>
              <h2>Correo enviado</h2>
              <p>
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
                Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
              </p>
              <p className="note">
                Si no encuentras el correo, revisa tu carpeta de spam.
              </p>
              <button className="close-button" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

ForgotPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ForgotPasswordModal;