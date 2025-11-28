import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const apiKey = process.env.API_KEY; 
	
	// ------------------
    // console.log("----------------DEBUG----------------");
    // console.log("1. Email recibido:", email);
    // console.log("2. API Key leída:", apiKey); // ¿Sale undefined? ¿Sale la clave? ¿Qué mier sale?
    // console.log("3. URL generada:", `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`);
    // console.log("-------------------------------------");
    // ------------------

    try {
      // --- PASO 1: Petición directa a la API REST de Google ---
      // Esta URL es el endpoint oficial de Firebase para loguear con email/password
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      });

      const data = await response.json();

      // Si Google responde con error, lanzamos una excepción
      if (!response.ok) {
        throw new Error(data.error.message || "Error desconocido");
      }

      // --- PASO 2: Generar nuestro propio Token ---
      // Nota: Firebase ya te devuelve un 'idToken' en 'data.idToken'.
      // Pero para cumplir requerimiento de firmar el propio token:
      
      const token = jwt.sign(
        { 
          email: data.email, 
          uid: data.localId 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' }
      );

      res.json({ 
        message: "Login exitoso",
        token: token,
        email: data.email
      });

    } catch (error) {
      console.error("Error login:", error.message);
      
      let msg = "Error de autenticación";
      
      // Mapeamos los errores de la API REST a mensajes entendibles
      if (error.message.includes('INVALID_PASSWORD') || error.message.includes('INVALID_LOGIN_CREDENTIALS')) {
        msg = "Credenciales inválidas";
      } else if (error.message.includes('EMAIL_NOT_FOUND')) {
        msg = "Usuario no encontrado";
      } else if (error.message.includes('INVALID_KEY')) {
         msg = "Error de configuración del servidor (API Key inválida)";
      }

      res.status(401).json({ message: msg, detail: error.message });
    }
  }
};