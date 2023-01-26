import express from 'express';

import gets from '@/api/v1/gets';

const router = express.Router();

router.get('/mangas-test', gets.mangasTest);
router.get('/mangas', gets.mangas);
router.get('/manga/:id', gets.manga);
router.get('/manga/:id/num-chapter-present', gets.getChapterPresentByManga);
router.get('/manga/:id/profile', gets.mangaProfile);
router.get('/chapter/:id', gets.chapter);
router.get('/chapter/:id/images', gets.chapterImages);

export default router;