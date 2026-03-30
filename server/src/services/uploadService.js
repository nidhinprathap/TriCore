import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import config from '../config/env.js';

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

export const processAndSaveImage = async (file) => {
  const uploadDir = path.resolve(config.uploadDir);
  await ensureDir(uploadDir);

  const safeName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '-');
  const filename = `${Date.now()}-${safeName}`;
  const filepath = path.join(uploadDir, filename);

  const metadata = await sharp(file.buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(filepath);

  return {
    filename,
    originalName: file.originalname,
    url: `/uploads/${filename}`,
    mimeType: 'image/jpeg',
    size: metadata.size,
    width: metadata.width,
    height: metadata.height,
  };
};
