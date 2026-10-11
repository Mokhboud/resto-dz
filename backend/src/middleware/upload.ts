import multer from 'multer';
import { Request } from 'express';
import { AppError } from './errorHandler';

// Memory storage: keeps the file in RAM so the storage provider
// (local or Cloudinary) can handle it. Do NOT use diskStorage here —
// Render's free tier has an ephemeral filesystem that wipes on restart.
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.', 'INVALID_FILE_TYPE'));
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
});

export default uploadImage;
