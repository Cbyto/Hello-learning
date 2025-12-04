# README - Proyecto API REST (Node.js + Firebase + Vercel)

## 📌 Descripción del proyecto

Este proyecto implementa una **API REST** para gestionar un **catálogo de productos**, utilizando:

- **Node.js + Express**
- **Firebase Firestore** como base de datos
- **Firebase Auth** para autenticación
- **JWT propio** para proteger endpoints privados
- **XLSX** para importación masiva de productos desde Excel
- **Vercel** para deploy (serverless)

La API permite:

- Consultar productos (público)
- Crear y eliminar productos (requiere autenticación)
- Importar productos desde un archivo Excel (solo local)

---

## 🚀 Tecnologías utilizadas

### 🖥️ Frontend (Web)
* **Interfaz Unificada:** Servida directamente por Express (`/`).
* **Buscador Inteligente:** Búsqueda rápida por ID interno o Código de Barras (EAN).
* **Panel de Administración:** Sistema de Login para acceder a funciones protegidas.
* **Gestión Visual:** Creación y eliminación de productos desde la web.
* **Tecnologías:** HTML5, Javascript Vanilla, TailwindCSS.

### ⚙️ Backend (API)
* **Runtime:** Node.js + Express.
* **Base de Datos:** Firebase Firestore (Admin SDK).
* **Seguridad:** Autenticación JWT y Variables de Entorno.
* **Carga Masiva:** Script de importación de Excel con lógica "Upsert".
* **Deploy:** Optimizado para Vercel (Serverless).

---

## 📁 Estructura del proyecto

```
Proyecto_ApiRest/
│
├── api/                 # Rutas adaptadas para Vercel
│
├── controllers/         # Lógica de autenticación y productos
├── models/              # Modelo Producto
├── services/            # CRUD para Firestore
├── scripts/
│   └── importar.js      # Script para cargar productos desde Excel
│
├── index.js             # Servidor Express (modo desarrollo local)
├── firebase.js          # Configuración Firebase Admin
│
├── package.json
├── .env
├── index.html
└── API_Documentacion.md
```

---

## 🔐 Autenticación

La API usa dos mecanismos:

1. **Firebase Auth** → para validar email/password  
2. **JWT propio**  → firmado con `JWT_SECRET`  

### Login

```
POST /auth/login
```

Body:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "message": "Login exitoso",
  "token": "<jwt>",
  "email": "usuario@ejemplo.com"
}
```

Endpoints privados requieren:

```
Authorization: Bearer <token>
```

---

## 📦 Endpoints principales

### Público

#### GET `/api/products`
Lista todos los productos.

#### GET `/api/products/:id`
Obtiene un producto por ID.

#### GET `/api/products/ean/:ean`
Obtiene un producto por EAN.

---

### Privado (requiere JWT)

#### POST `/api/products`
Crea un producto.

#### DELETE `/api/products/:id`
Elimina un producto existente.

---

## 📥 Importación desde Excel (solo local)

Script:

```
scripts/importar.js
```

Ejecutar:

```bash
node scripts/importar.js
```

El Excel debe contener:

| codigo | ean | nombre | preciovta | stock | categoria |
|--------|-----|--------|-----------|--------|-----------|

> Esto no funciona en Vercel (serverless).

---

## ⚙️ Variables de entorno

`.env`:

```env
PORT=3000
API_KEY=API_KEY_FIREBASE
JWT_SECRET=una_clave_segura
```

En **Vercel**, se cargan en *Environment Variables*.

---

## 🌐 Deploy en Vercel

1. Subir el proyecto a GitHub  
2. Crear proyecto en Vercel  
3. Importar repo  
4. Configurar variables de entorno  
5. Colocar endpoints bajo `/api` para serverless  

La API quedará disponible en:

```
🔗 https://tt-api-productos.vercel.app/api/products
```

Su versión WEB disponible en:
```
🔗 https://tt-api-productos.vercel.app/
```

---

## 📚 Documentación completa

Ver archivo:

```
API_Documentacion.md
```

---

## 🧪 Testing

- Yaak  
- Thunder Client  
- Curl  

---
