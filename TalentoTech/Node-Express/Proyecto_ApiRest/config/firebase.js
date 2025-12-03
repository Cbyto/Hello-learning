import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccount;

// LÓGICA HÍBRIDA:
if (process.env.FIREBASE_CREDENTIALS) {
  // CASO 1: Estamos en Vercel (o Producción) y leemos desde la variable de entorno
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
} else {
  // CASO 2: Estamos en Local y leemos el archivo
  const rutaArchivo = path.join(__dirname, '../credenciales.json');
  if (fs.existsSync(rutaArchivo)) {
    serviceAccount = JSON.parse(fs.readFileSync(rutaArchivo, 'utf8'));
  } else {
    console.error("❌ No se encontraron credenciales de Firebase.");
  }
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const db = admin.firestore();
export const auth = admin.auth();