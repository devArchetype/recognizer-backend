import * as express from 'express';

import { authMiddleware } from '@middlewares/authMiddleware';
import UserController from '@controllers/UserController';
import GroupController from '@controllers/GroupController';

const router = express.Router();

// * user routes
const userController = new UserController();
const groupController = new GroupController()

// Users
router.post('/user/store', userController.store.bind(userController));
router.post('/user/login', userController.login.bind(userController));

router.use(authMiddleware);
// Users
router.delete('/user/delete', userController.delete.bind(userController));

// Groups
router.post('/group/store', groupController.store.bind(groupController));
router.patch('/group/update', groupController.update.bind(groupController));
router.delete('/group/delete', groupController.delete.bind(groupController));

export default router;
