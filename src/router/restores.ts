import express from 'express';

import restores from '@/api/v1/restores';

const router = express.Router();

router.post('/manga/:id', restores.manga);
router.post('/chapter/:id', restores.chapter);

export default router;