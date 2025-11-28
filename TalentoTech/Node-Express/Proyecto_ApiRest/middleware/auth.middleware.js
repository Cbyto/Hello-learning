import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const header = req.header('Authorization') || "";
  const token = header.split(" ")[1]; // Formato "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token no provisto" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
};