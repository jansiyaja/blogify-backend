import express from 'express';
import userController from '../controllers/userController';
import { authenticateToken } from '../middleware/authenticateToken';
import { uploadBlogData, uploadProfileImage } from '../services/multerService';

export const userRouter = express.Router();

userRouter.post('/register', userController.createUser);
userRouter.post('/otp-verification', userController.verifyOTP);
userRouter.post('/login', userController.loginUser);
userRouter.post('/blog', authenticateToken, uploadBlogData, userController.createBlog);
userRouter.get('/blog', uploadBlogData, userController.getAllblogs);
userRouter.get('/singleblog', authenticateToken, userController.getSingleBlog);
userRouter.get('/usersblog', authenticateToken, userController.getAllUserBlogs);
userRouter.post('/profile', authenticateToken, uploadProfileImage,userController.updateProfile);
userRouter.post('/deleteBlog', authenticateToken,userController.deleteBlog);

