import * as express from 'express';
import UserController from 'src/app/controllers/UserController';

const router = express.Router();

// * controllers
const userController = new UserController();

// * user routes
router.get('/users/store', userController.store.bind(userController));

export default router;
