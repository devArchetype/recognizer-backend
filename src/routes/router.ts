import * as express from 'express';

import { authMiddleware } from '@middlewares/authMiddleware';
import UserController from '@controllers/UserController';
import MemberController from '@controllers/MemberController';

const router = express.Router();

// * user routes
const userController = new UserController();
router.post('/user/store', userController.store.bind(userController));
router.post('/user/login', userController.login.bind(userController));

router.use(authMiddleware);
router.delete('/user/delete', userController.delete.bind(userController));

const memberController = new MemberController();
router.post('/member/store', memberController.store.bind(memberController));
router.delete('/member/delete/:id', memberController.delete.bind(memberController));

export default router;
