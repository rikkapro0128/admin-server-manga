import express from 'express';

import gets from '@/api/v1/gets';

const router = express.Router();

router.get('/manga/:id', gets.manga);
router.get('/manga/:id/profile', gets.mangaProfile);
router.get('/chapter/:id', gets.chapter);
router.get('/chapter/:id/images', gets.chapterImages);

export default router;