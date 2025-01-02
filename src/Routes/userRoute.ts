import express from 'express';
import userController from '../controllers/userController';
import { authenticateToken } from '../middleware/authenticateToken';
import { uploadBlogData } from '../services/multerService';

export const userRouter = express.Router();

userRouter.post('/register', userController.createUser);
userRouter.post('/otp-verification', userController.verifyOTP);
userRouter.post('/login', userController.loginUser);
userRouter.post('/blog', authenticateToken, uploadBlogData, userController.createBlog);
userRouter.get('/blog', uploadBlogData, userController.getAllblogs);
