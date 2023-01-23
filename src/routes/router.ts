import * as express from 'express';

import { authMiddleware } from '@middlewares/authMiddleware';
import { recaptchaMiddleware } from '@middlewares/recaptchaMiddleware';
import UserController from '@controllers/UserController';

const router = express.Router();

// * user routes
const userController = new UserController();
router.post('/user/store', userController.store.bind(userController));
router.post('/user/login', recaptchaMiddleware, userController.login.bind(userController));

router.use(authMiddleware);
router.delete('/user/delete', userController.delete.bind(userController));
router.put('/user/update', userController.update.bind(userController));

export default router;
