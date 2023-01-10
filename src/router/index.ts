import express from 'express';

import uploads from '@/router/uploads';
import news from '@/router/news';

const router = express.Router();

router.use('/upload', uploads);
router.use('/new', news);

export default router;