export interface UploadedFile {
  url: string;
  thumbnailUrl: string;
  publicId: string;
  size: number;
  format: string;
}

export interface StorageProvider {
  upload(file: Express.Multer.File, folder: string): Promise<UploadedFile>;
  delete(publicId: string): Promise<void>;
}
