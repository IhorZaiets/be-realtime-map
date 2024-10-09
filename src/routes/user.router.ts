import { Router } from 'express';
import { UsersController } from '../controllers';

const router = Router();

router.post('/login', UsersController.loginUser);

export default router;
