// src/utils/token.js

// Obtiene el token desde localStorage o sessionStorage
export function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

// Decodifica el payload de un JWT (sin verificar firma)
export function decodeJwtPayload(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64 + "=".repeat((4 - b64.length % 4) % 4));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Comprueba si el token expiró (con margen de seguridad)
export function isTokenExpired(token, skewSec = 30) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp - skewSec;
}

// Limpia localStorage y sessionStorage
export function clearSession() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    console.error("Error clearing session storage");
  }
}
