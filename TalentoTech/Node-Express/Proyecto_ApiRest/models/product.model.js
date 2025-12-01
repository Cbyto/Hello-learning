import { db } from '../config/firebase.js';

// En Admin SDK no usamos "collection(db, ...)", usamos "db.collection(...)"
const collectionRef = db.collection("productos"); // <--- Nombre exacto de la colección

export const ProductModel = {
  async getAll() {
    const snapshot = await collectionRef.get();
    if (snapshot.empty) return [];
    // Mapeamos los datos
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const doc = await collectionRef.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async create(productData) {
    const docRef = await collectionRef.add(productData);
    return { id: docRef.id, ...productData };
  },

  async delete(id) {
    await collectionRef.doc(id).delete();
    return { id };
  },

  async getByEan(ean) {
    // Usamos .where() para filtrar
    const snapshot = await collectionRef.where('ean', '==', ean).get();

    // Si no encuentra nada, devolvemos null
    if (snapshot.empty) return null;

    // Como el EAN debería ser único, tomamos el primer resultado (docs[0])
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
};