import * as express from 'express';
import UserController from '@controllers/UserController';

const router = express.Router();

// * user routes
const userController = new UserController();
router.get('/users/store', userController.store.bind(userController));

export default router;
