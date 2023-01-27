import * as express from 'express';

import { authMiddleware } from '@middlewares/authMiddleware';
import { recaptchaMiddleware } from '@middlewares/recaptchaMiddleware';
import UserController from '@controllers/UserController';
import GroupController from '@controllers/GroupController';

const router = express.Router();

// * User
const userController = new UserController();

router.post('/user/store', userController.store.bind(userController));
router.post('/user/login', recaptchaMiddleware, userController.login.bind(userController));
router.post('/user/recovery-password', userController.verificationCodeLoggedOut.bind(userController));
router.patch('/user/recovery-logged-out', userController.recoveryPasswordLoggedOut.bind(userController));

router.use(authMiddleware);

router.delete('/user/delete', userController.delete.bind(userController));
router.put('/user/update', userController.update.bind(userController));
router.get('/user/statistics', userController.statistics.bind(userController));
router.get('/user/verification-code', userController.verificationCode.bind(userController));
router.patch('/user/recovery', userController.recoveryPassword.bind(userController));

// * Groups
const groupController = new GroupController();

router.post('/group/store', groupController.store.bind(groupController));
router.patch('/group/update', groupController.update.bind(groupController));
router.get('/group/index', groupController.index.bind(groupController));
router.get('/group/show', groupController.show.bind(groupController));
router.delete('/group/delete', groupController.delete.bind(groupController));

export default router;
