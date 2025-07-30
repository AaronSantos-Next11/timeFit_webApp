import React from 'react';
import { Link } from 'react-router-dom';
import './Condiction.css'; // Asegúrate de crear este archivo CSS

export default function Condiction() {
  return (
    <div className="condiction-container">
      <div className="condiction-content">
        <div className="header">
          <h1>Términos y Condiciones</h1>
          <Link to="/sign_up" className="back-button">
            ← Regresar al Registro
          </Link>
        </div>
        
        <div className="terms-content">
          <section>
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al utilizar los servicios de Time Fit, usted acepta estar sujeto a estos 
              términos y condiciones. Si no está de acuerdo con alguna parte de estos 
              términos, no debe utilizar nuestros servicios.
            </p>
          </section>

          <section>
            <h2>2. Uso del Servicio</h2>
            <p>
              Time Fit proporciona servicios de gestión de gimnasios y centros de fitness. 
              El uso de nuestros servicios está sujeto a las siguientes condiciones:
            </p>
            <ul>
              <li>Debe proporcionar información precisa y actualizada</li>
              <li>Es responsable de mantener la confidencialidad de su cuenta</li>
              <li>No debe usar el servicio para fines ilegales o no autorizados</li>
            </ul>
          </section>

          <section>
            <h2>3. Privacidad y Protección de Datos</h2>
            <p>
              Nos comprometemos a proteger su información personal de acuerdo con 
              las leyes de protección de datos aplicables. Su información será 
              utilizada únicamente para los fines establecidos en nuestra política 
              de privacidad.
            </p>
          </section>

          <section>
            <h2>4. Responsabilidades del Usuario</h2>
            <p>
              Como usuario administrador de Time Fit, usted es responsable de:
            </p>
            <ul>
              <li>Mantener la seguridad de su cuenta y credenciales</li>
              <li>Usar el sistema de manera responsable y ética</li>
              <li>Cumplir con todas las regulaciones locales aplicables</li>
              <li>Notificar cualquier uso no autorizado de su cuenta</li>
            </ul>
          </section>

          <section>
            <h2>5. Limitación de Responsabilidad</h2>
            <p>
              Time Fit no será responsable por daños indirectos, incidentales o 
              consecuentes que puedan surgir del uso de nuestros servicios.
            </p>
          </section>

          <section>
            <h2>6. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier 
              momento. Las modificaciones entrarán en vigor inmediatamente después 
              de su publicación.
            </p>
          </section>

          <section>
            <h2>7. Contacto</h2>
            <p>
              Si tiene preguntas sobre estos términos y condiciones, puede 
              contactarnos a través de nuestros canales oficiales de soporte.
            </p>
          </section>
        </div>

        <div className="footer">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES')}</p>
          <Link to="/sign_up" className="accept-button">
            He leído y acepto los términos
          </Link>
        </div>
      </div>
    </div>
  );
}