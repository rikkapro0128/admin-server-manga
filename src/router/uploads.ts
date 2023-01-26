import express from 'express';

import upload from '../api/v1/uploads';

const router = express.Router();

router.post('/chapter/:id', upload.chapter);
router.post('/avatar/manga/:id', upload.avatar);
router.post('/cover/manga/:id', upload.cover);

export default router;