import { Router } from 'express';
import * as UsersController from '../controllers/user.controller';

const router = Router();

router.post('/login', UsersController.loginUser);

export default router;
