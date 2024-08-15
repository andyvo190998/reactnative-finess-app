import express from 'express';
import { fetchPhotos, fetchVideos } from '../controllers/training.js';

const router = express.Router();

router.get("/videos", fetchVideos);
router.get("/photos", fetchPhotos);

export default router;