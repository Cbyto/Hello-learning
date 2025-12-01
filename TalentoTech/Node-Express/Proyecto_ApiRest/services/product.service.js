import { ProductModel } from '../models/product.model.js';

export const ProductService = {
  getAllProducts: async () => {
    return await ProductModel.getAll();
  },
  getProductById: async (id) => {
    return await ProductModel.getById(id);
  },
  createProduct: async (data) => {
    return await ProductModel.create(data);
  },
  deleteProduct: async (id) => {
    return await ProductModel.delete(id);
  },

  getProductByEan: async (ean) => {
    return await ProductModel.getByEan(ean);
  }
};