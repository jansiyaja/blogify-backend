import express from 'express';
import userController from '../controllers/userController';

export const userRouter = express.Router();

userRouter.post('/register-user', userController.createUser);
