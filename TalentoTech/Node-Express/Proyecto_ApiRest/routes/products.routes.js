import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

// PÚBLICAS (Cualquiera puede ver el catálogo)
router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getById);
// No puedo poner /:ean porque se puede confundir con id, no se sabe si es id o ean
router.get('/products/ean/:ean', ProductController.getByEan);

// PRIVADAS (Solo con Token se puede modificar)
router.post('/products', verifyToken, ProductController.create); 
router.delete('/products/:id', verifyToken, ProductController.delete);

export default router;