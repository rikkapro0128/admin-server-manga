import express from 'express';

import upload from '../api/v1/uploads';

const router = express.Router();

router.post('/chapter', upload.chapter);
router.post('/avatar/manga', upload.avatar);
router.post('/cover/manga', upload.cover);

export default router;