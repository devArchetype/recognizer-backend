import * as express from 'express';

import { authMiddleware } from '@middlewares/authMiddleware';
import UserController from '@controllers/UserController';

const router = express.Router();

// * user routes
const userController = new UserController();
router.post('/user/store', userController.store.bind(userController));
router.post('/user/login', userController.login.bind(userController));
router.get('/user/index', authMiddleware, userController.getProfile.bind(userController));

export default router;
