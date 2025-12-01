# 📦 API REST - Catálogo de Productos

Esta API permite gestionar un **catálogo de productos** almacenados en **Firebase Firestore**, con:

- Endpoints públicos para consultar productos.
- Endpoints protegidos (con JWT) para crear y eliminar productos.
- Un script Node.js para importar productos desde Excel.
- Deploy obligatorio en **Vercel** (entorno serverless).

---

## 1. Información general

- **Nombre del proyecto:** proyecto_apirest  
- **Versión:** 1.0.0  
- **Backend:** Node.js + Express  
- **Base de datos:** Firebase Firestore (Admin SDK)  
- **Autenticación:**  
  - Login contra Firebase Auth (email/password)  
  - JWT propio para proteger endpoints privados  

### 1.1 Sobre Vercel

El deploy en **Vercel** implica:

- No se usa `index.js` como servidor tradicional.
- Se debe exportar funciones en `/api` (Serverless Functions).
- No existen procesos persistentes (no usar `node index.js`).
- El script Excel **no puede correr en Vercel** (solo local).

> **IMPORTANTE:** Esta documentación describe la API pensada desde Express, pero su implementación final en Vercel debe usar handlers serverless. Se mantiene igual a efectos académicos.

---

## 2. Variables de entorno

Agregar en Vercel y en `.env` local:

```env
API_KEY=API_KEY_DE_FIREBASE
JWT_SECRET=una_clave_segura
```

Además:

- Subir **credenciales Firebase Admin** como variables ENV (no se permiten archivos JSON en Vercel).

---

## 3. Endpoints de Autenticación

### **POST** `/auth/login`

Autentica un usuario en Firebase Auth y genera un token JWT.

**Body:**

```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

**Respuesta:**

```json
{
  "message": "Login exitoso",
  "token": "<jwt>",
  "email": "usuario@ejemplo.com"
}
```

---

## 4. Endpoints de Productos

**Prefijo:** `/api/products`

### **GET** `/api/products`

Lista todos los productos.

### **GET** `/api/products/:id`

Obtiene un producto por ID de Firestore.

### **GET** `/api/products/ean/:ean`

Busca un producto por su código de barras (EAN).

* **Parámetro:** `:ean` es el código numérico (ej: 
7712345678900).

* **Acceso:** Público.

### **POST** `/api/products` _(requiere JWT)_

Crea un nuevo producto:

```json
{
  "codigo": "1001",
  "ean": "779...",
  "nombre": "Producto",
  "precioVta": 1000,
  "stock": 10,
  "categoria": "General"
}
```

### **DELETE** `/api/products/:id` _(requiere JWT)_

Elimina un producto por ID.

---

## 5. Importación desde Excel (solo local)

Archivo: `scripts/importar.js`

Para ejecutar:

```bash
node scripts/importar.js
```

Formato esperado del Excel:

- codigo  
- ean  
- nombre  
- preciovta  
- stock  
- categoria  

> En Vercel **no se puede ejecutar este script**. Solo localmente.

---

## 6. Respuestas de error

| Código | Motivo |
|-------|--------|
| 400 | Petición inválida |
| 401 | Credenciales inválidas / falta token |
| 403 | Token inválido |
| 404 | Recurso no encontrado |
| 500 | Error interno |

---

## 7. Flujo de uso recomendado

1. (Opcional) Importar productos desde Excel localmente.  
2. Crear usuario en Firebase Auth.  
3. Hacer login, obtener token JWT.  
4. Consumir endpoints públicos.  
5. Consumir endpoints privados enviando `Authorization: Bearer <token>`.

---

## 8. Deploy en Vercel

Pasos generales:

1. Subir repo a GitHub.
2. Crear proyecto en Vercel �?Importar repo.
3. Configurar variables de entorno.
4. Mover rutas Express tradicionales a `/api/*.js` con export default.
5. Probar desde:  
   **https://vercel.app/api/products**

---
