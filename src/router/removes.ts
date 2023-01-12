import express from 'express';

import removes from '@/api/v1/removes';

const router = express.Router();

router.delete('/manga/:id', removes.manga);
router.delete('/chapter/:id', removes.chapter);

export default router;