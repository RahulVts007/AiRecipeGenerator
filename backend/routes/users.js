import express from 'express';
const router = express.Router();

import authMiddleware from '../middleware/auth.js';
import * as userController from '../controllers/userController.js'

// All routes are protected
router.use(authMiddleware);

router.get('/profile' , userController.getProfile);
router.get('/')
