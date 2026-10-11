import { v2 as cloudinary } from 'cloudinary';
import { StorageProvider, UploadedFile } from './types';

export class CloudinaryStorageProvider implements StorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  async upload(file: Express.Multer.File, folder: string): Promise<UploadedFile> {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'resto-dz/' + folder,
          resource_type: 'image',
          transformation: [
            { width: 1600, height: 1600, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const thumbnailUrl = cloudinary.url(result.public_id, {
      width: 400,
      height: 400,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
      secure: true,
    });

    return {
      url: result.secure_url,
      thumbnailUrl,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format,
    };
  }

  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch {
      // Photo may not exist - ignore
    }
  }
}
