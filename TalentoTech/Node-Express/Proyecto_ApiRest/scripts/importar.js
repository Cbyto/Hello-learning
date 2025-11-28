import XLSX from 'xlsx';
import { db } from '../config/firebase.js'; 	// Ahora importo la instancia Admin
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importarDatos = async () => {
  try {
    console.log("📂 Leyendo archivo Excel...");
    
    // 1. Leer el archivo
    const rutaArchivo = path.join(__dirname, '../productos.xlsx');
    const workbook = XLSX.readFile(rutaArchivo);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const datos = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`🔍 Procesando ${datos.length} productos con Admin SDK...`);

    // Referencia directa a la colección
    const collectionRef = db.collection("productos");
    
    let creados = 0;
    let actualizados = 0;

    for (const producto of datos) {
      // Limpieza de datos. OJO el excel exactamente asi los nombrs
      const productoLimpio = {
        codigo: String(producto.codigo),
        ean: String(producto.ean),
        nombre: producto.nombre,
        precioVta: Number(producto.preciovta),
        stock: Number(producto.stock),
        categoria: producto.categoria
      };

      // 2. Buscar si existe (Sintaxis Admin SDK)
      // Buscamos documentos donde el campo 'codigo' sea igual al del excel
      const snapshot = await collectionRef.where('codigo', '==', productoLimpio.codigo).get();

      if (!snapshot.empty) {
        // --- CASO: ACTUALIZAR ---
        // Tomamos el primer documento que coincida
        const docId = snapshot.docs[0].id;
        
        // .update() solo cambia los campos que le pase
        await collectionRef.doc(docId).update(productoLimpio);
        
        actualizados++;
        console.log(`   🔄 Actualizado: ${productoLimpio.codigo} - ${productoLimpio.nombre}`);
      } else {
        // --- CASO: CREAR ---
        // .add() crea un documento nuevo con ID automático
        await collectionRef.add(productoLimpio);
        
        creados++;
        console.log(`   ✅ Creado: ${productoLimpio.codigo} - ${productoLimpio.nombre}`);
      }
    }

    console.log(`-----------------------------------`);
    console.log(`🚀 ¡Listo! Importación finalizada.`);
    console.log(`🆕 Nuevos: ${creados} | 🔄 Actualizados: ${actualizados}`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  }
};

importarDatos();