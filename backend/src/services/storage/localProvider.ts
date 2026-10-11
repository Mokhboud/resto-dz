import fs from 'fs';
import path from 'path';
import { StorageProvider, UploadedFile } from './types';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, folder: string): Promise<UploadedFile> {
    const subDir = path.join(this.uploadDir, folder);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    const filePath = path.join(subDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    const relativeUrl = '/uploads/' + folder + '/' + filename;

    return {
      url: relativeUrl,
      thumbnailUrl: relativeUrl,
      publicId: filename,
      size: file.size,
      format: ext.replace('.', ''),
    };
  }

  async delete(publicId: string): Promise<void> {
    try {
      const filePath = path.join(this.uploadDir, 'restaurants', publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // File may not exist - ignore
    }
  }
}
