import express from 'express';
import { userVerification } from '../middleware/auth.middleware.js';
import { getInsights } from '../controllers/insights.controller.js';

const router = express.Router();
router.use(userVerification);
router.get('/', getInsights);

export default router;
