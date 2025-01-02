import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import userRepository from '../repositories/userRepository';
import { SMTPService } from '../services/smtpEmail';
import { generateAccessToken, generateRefreshToken } from '../services/jwtService';
import { ImageUploader } from '../services/s3Servives';
import { S3Client } from '@aws-sdk/client-s3';
import BlogRepository from '../repositories/BlogRepository';



const BlogStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

type BlogStatusType = keyof typeof BlogStatus;
const s3Client = new S3Client({ region: process.env.AWS_REGION });
const imageUploader = new ImageUploader(s3Client);

class UserController {
  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
   
      const existingUser = await userRepository.checkUser(email);
      if (existingUser) {
         res.status(400).json({ message: 'Email already exists' });
      }

    
      const hashedPassword = await bcrypt.hash(password, 10);
     const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log('Generated OTP:', otp);

     
      const user = await userRepository.createUser(name, email, hashedPassword);
      if (!user || !user.email) {
        throw new Error('Failed to create user: Email is null');
      }

   
      await userRepository.createOTP(otp, email);

      if (!process.env.MAIL_EMAIL) {
        throw new Error('Admin email is not configured');
      }

      const smtpService = new SMTPService();
      await smtpService.sendEmail({
        from: process.env.MAIL_EMAIL,
        to: user.email,
        subject: 'Welcome To Blogify, Our Blog Platform!',
        text: `Hi ${name}, welcome to our platform! We're excited to have you here. Your OTP is ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <p style="font-size: 16px; color: #333;">Hi ${name},</p>
            <p style="font-size: 14px; color: #333;">Welcome to our platform! We're excited to have you here.</p>
            <p style="font-size: 14px; color: #333;">Your OTP for verifying Two-Factor Authentication is:
              <strong style="color: #0066cc; font-size: 18px;">${otp}</strong>
            </p>
            <p style="font-size: 14px; color: #333;">Thank you for joining Blogify. We’re thrilled to have you on board!</p>
            <p style="font-size: 12px; color: #666;">Best regards,<br>The Blogify Team</p>
          </div>
        `,
      });

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  }

  async verifyOTP(req: Request, res: Response){
    try {
      console.log(req.body);
      
      const { email, otp } = req.body;
      

      const user = await userRepository.verifyOtp( otp, email );

           res.status(201).json(user);
    } catch (error) {
         console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  }


async loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    const existingUser = await userRepository.checkUser(email);
    if (!existingUser) {
       throw new Error('User with this email does not exist');

    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
       throw new Error('Invalid password');
    }

    const accessToken = generateAccessToken(existingUser.id);
    const refreshToken = generateRefreshToken(existingUser.id);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  }
  

  async createBlog(req: Request, res: Response) {
    const { heading, content, tag, status } = req.body;
       const buffer = req.file?.buffer;
    const mimeType = req.file?.mimetype.toString();
    console.log(mimeType,buffer);
    

    try {
      
      if (!buffer || !mimeType) {
        res.status(400).json({ error: 'No image uploaded.' });
        return;
      }

    
      const userId = (req as any).user.id
      
     
      
      if (!userId) {
      console.log("no user");
      
      }

      
      const imageKey = await imageUploader.uploadImageToS3(buffer, mimeType);
   
      
        const blogStatus = BlogStatus[status.toUpperCase() as BlogStatusType];

      if (!blogStatus) {
        res.status(400).json({ error: 'Invalid blog status.' });
        return;
      }

      const newBlogPost = await BlogRepository.createBlog(
        userId,
        heading,
        tag,
        content,
        imageKey,
        blogStatus
      );
    
       
      res.status(201).json({
        message: 'Blog post created successfully',
        blogPost: newBlogPost,
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  }



  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userRepository.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  }
  async getAllblogs(req: Request, res: Response) {
    console.log('iam callaed');
    
    try {
      const blogs = await BlogRepository.getAllBlogs();
      console.log(blogs);
      
      res.status(200).json(blogs);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  }
}

export default new UserController();
