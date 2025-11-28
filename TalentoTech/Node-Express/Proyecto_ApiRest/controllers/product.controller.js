import { ProductService } from '../services/product.service.js';

export const ProductController = {
  getAll: async (req, res) => {
    try {
      const products = await ProductService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      res.status(201).json({ message: "Producto creado", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.json({ message: "Producto eliminado" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};