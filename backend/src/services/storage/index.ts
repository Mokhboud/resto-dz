import { StorageProvider } from './types';
import { LocalStorageProvider } from './localProvider';
import { CloudinaryStorageProvider } from './cloudinaryProvider';

let provider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (provider) return provider;

  const type = process.env.STORAGE_PROVIDER || 'local';

  if (type === 'cloudinary') {
    provider = new CloudinaryStorageProvider();
    console.log('Storage: using Cloudinary');
  } else {
    provider = new LocalStorageProvider();
    console.log('Storage: using local disk');
  }

  return provider;
}

export type { StorageProvider, UploadedFile } from './types';
