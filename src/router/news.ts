import express from 'express';

import news from '@/api/v1/news';

const router = express.Router();

router.post('/manga', news.manga);
router.post('/chapter', news.chapter);

export default router;