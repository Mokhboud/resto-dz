import { StorageProvider } from './types';
import { LocalStorageProvider } from './localProvider';
import { CloudinaryStorageProvider } from './cloudinaryProvider';

let provider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (provider) return provider;

  // Defensive parse: strip quotes, trim whitespace, lowercase.
  const raw = process.env.STORAGE_PROVIDER || 'local';
  const type = raw.trim().toLowerCase().replace(/["']/g, '');

  console.log('[Storage] Raw STORAGE_PROVIDER =', JSON.stringify(raw));
  console.log('[Storage] Normalized provider =', type);
  console.log(
    '[Storage] Cloudinary credentials:',
    process.env.CLOUDINARY_CLOUD_NAME ? 'cloud_name=SET' : 'cloud_name=MISSING',
    process.env.CLOUDINARY_API_KEY ? 'api_key=SET' : 'api_key=MISSING',
    process.env.CLOUDINARY_API_SECRET ? 'api_secret=SET' : 'api_secret=MISSING'
  );

  try {
    if (type === 'cloudinary') {
      provider = new CloudinaryStorageProvider();
      console.log('[Storage] Using Cloudinary');
    } else {
      provider = new LocalStorageProvider();
      console.log('[Storage] Using local disk');
    }
  } catch (err) {
    console.error('[Storage] Failed to initialize provider:', err);
    throw err;
  }

  return provider;
}

export type { StorageProvider, UploadedFile } from './types';
