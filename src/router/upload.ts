import express from 'express';

import upload from '../api/v1/upload';

const router = express.Router();

router.post('/chapter', upload.chapter);

export default router;