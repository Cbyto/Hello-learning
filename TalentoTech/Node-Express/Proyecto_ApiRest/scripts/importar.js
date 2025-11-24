import XLSX from 'xlsx';
import { db } from '../config/firebase.js'; // Reutilizamos conexión existente
import { collection, addDoc } from "firebase/firestore";
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para manejar rutas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importarDatos = async () => {
  try {
    console.log("📂 Leyendo archivo Excel...");
    
    // 1. Leer el archivo (Asumiendo que está en la raíz del proyecto)
    const rutaArchivo = path.join(__dirname, '../productos.xlsx');
    const workbook = XLSX.readFile(rutaArchivo);
    
    // 2. Obtener la primera hoja
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // 3. Convertir a JSON (Array de objetos)
    const datos = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`✅ Se encontraron ${datos.length} productos para importar.`);

    // 4. Subir a Firebase
    const productsCollection = collection(db, "productos");
    
    let cont = 0;
    for (const producto of datos) {
      // Convertimos los datos numéricos por seguridad
      const productoLimpio = {
        codigo: String(producto.codigo),
        ean: String(producto.ean),
        nombre: producto.nombre,
        precioVta: Number(producto.precioVta),
        stock: Number(producto.stock),
        categoria: producto.categoria
      };

      await addDoc(productsCollection, productoLimpio);
      cont++;
      console.log(`   -> Importado: ${producto.nombre}`);
    }

    console.log(`🚀 ¡Listo! Se importaron ${cont} productos a Firebase.`);
    process.exit(0); 	// Terminar el proceso

  } catch (error) {
    console.error("❌ Error al importar:", error);
    process.exit(1);
  }
};

importarDatos();