import { v2 as cloudinary } from 'cloudinary';
import { StorageProvider, UploadedFile } from './types';
import streamifier from 'streamifier';

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
    console.log('[Cloudinary] Upload started. File size:', file.size, 'mimetype:', file.mimetype);

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
          if (error) {
            console.error('[Cloudinary] Upload error:', error);
            return reject(error);
          }
          if (!result) {
            console.error('[Cloudinary] Upload error: result is undefined');
            return reject(new Error('Cloudinary returned no result'));
          }
          console.log('[Cloudinary] Upload success. Public ID:', result.public_id);
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
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


