import { importarDBF } from './src/importacion_dbf.js';
import { procesarProductos } from './src/logica.js';

async function ejecutar() {
  // 1. Importar DBF
  await importarDBF('./path/to/archivo.dbf');

  // 2. Procesar productos (calcular precios)
  await procesarProductos();

  console.log('Proceso completado');
}

ejecutar().catch(console.error);
