import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); 
  const [error, setError] = useState('');
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
      setError('Por favor, ingrese su correo electrónico');
      return;
    }
    
    // Simulación de envío de correo de recuperación
    try {
      setIsLoading(true);
      setError('');
      
      
      setTimeout(() => {
        setIsLoading(false);
        setStep(2); 
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      setError('Ocurrió un error al enviar el correo. Inténtelo nuevamente.');
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
              
              {error && <p className="error-message">{error}</p>}
              
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

export default ForgotPasswordModal;