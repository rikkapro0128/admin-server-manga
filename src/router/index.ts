import express from 'express';

import gets from '@/router/gets';
import news from '@/router/news';
import uploads from '@/router/uploads';
import updates from '@/router/updates';
import removes from '@/router/removes';
import restores from '@/router/restores';

const router = express.Router();

router.use('/get', gets);
router.use('/upload', uploads);
router.use('/update', updates);
router.use('/new', news);
router.use('/remove', removes);
router.use('/restore', restores);

export default router;