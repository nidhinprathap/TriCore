import { Router } from 'express';
import auth from '../middleware/auth.js';
import { uploadMiddleware, uploadImage, getAssets, deleteAsset } from '../controllers/uploadController.js';

const router = Router();

router.use(auth);
router.post('/', uploadMiddleware, uploadImage);
router.get('/', getAssets);
router.delete('/:id', deleteAsset);

export default router;
