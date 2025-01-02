"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const smtpEmail_1 = require("../services/smtpEmail");
const jwtService_1 = require("../services/jwtService");
const s3Servives_1 = require("../services/s3Servives");
const client_s3_1 = require("@aws-sdk/client-s3");
const BlogRepository_1 = __importDefault(require("../repositories/BlogRepository"));
const BlogStatus = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    ARCHIVED: "ARCHIVED",
};
const s3Client = new client_s3_1.S3Client({ region: process.env.AWS_REGION });
const imageUploader = new s3Servives_1.ImageUploader(s3Client);
class UserController {
    async createUser(req, res) {
        const { name, email, password } = req.body;
        try {
            const existingUser = await userRepository_1.default.checkUser(email);
            if (existingUser) {
                res.status(400).json({ message: "Email already exists" });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const user = await userRepository_1.default.createUser(name, email, hashedPassword);
            if (!user || !user.email) {
                throw new Error("Failed to create user: Email is null");
            }
            await userRepository_1.default.createOTP(otp, email);
            if (!process.env.MAIL_EMAIL) {
                throw new Error("Admin email is not configured");
            }
            const smtpService = new smtpEmail_1.SMTPService();
            await smtpService.sendEmail({
                from: process.env.MAIL_EMAIL,
                to: user.email,
                subject: "Welcome To Blogify, Our Blog Platform!",
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
            res.status(201).json({ message: "User created successfully", user });
        }
        catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: "Error creating user" });
        }
    }
    async verifyOTP(req, res) {
        try {
            const { email, otp } = req.body;
            const user = await userRepository_1.default.verifyOtp(otp, email);
            res.status(201).json(user);
        }
        catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Error fetching users" });
        }
    }
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const existingUser = await userRepository_1.default.checkUser(email);
            if (!existingUser) {
                res.status(401).json({ error: "User with this email does not exist" });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(password, existingUser.password);
            if (!isMatch) {
                res.status(401).json({ error: "Invalid password" });
            }
            const accessToken = (0, jwtService_1.generateAccessToken)(existingUser?.id);
            const refreshToken = (0, jwtService_1.generateRefreshToken)(existingUser?.id);
            res.status(200).json({
                message: "Login successful",
                user: {
                    id: existingUser?.id,
                    email: existingUser?.email,
                    name: existingUser?.name,
                    image: existingUser?.image,
                    about: existingUser?.about,
                },
                tokens: {
                    accessToken,
                    refreshToken,
                },
            });
        }
        catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    async createBlog(req, res) {
        const { heading, content, tag, status } = req.body;
        const buffer = req.file?.buffer;
        const mimeType = req.file?.mimetype.toString();
        try {
            if (!buffer || !mimeType) {
                res.status(400).json({ error: "No image uploaded." });
                return;
            }
            const userId = req.user.id;
            if (!userId) {
                console.log("no user");
            }
            const imageKey = await imageUploader.uploadImageToS3(buffer, mimeType);
            const blogStatus = BlogStatus[status.toUpperCase()];
            if (!blogStatus) {
                res.status(400).json({ error: "Invalid blog status." });
                return;
            }
            const newBlogPost = await BlogRepository_1.default.createBlog(userId, heading, tag, content, imageKey, blogStatus);
            res.status(201).json({
                message: "Blog post created successfully",
                blogPost: newBlogPost,
            });
        }
        catch (error) {
            console.error("Error creating blog post:", error);
            res.status(500).json({ error: "Failed to create blog post" });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            if (!userId) {
                res.status(400).json({ error: "User ID not found" });
                return;
            }
            const buffer = req.file?.buffer;
            const mimeType = req.file?.mimetype.toString();
            if (!buffer || !mimeType) {
                res.status(400).json({ error: "No image uploaded." });
                return;
            }
            const image = await imageUploader.uploadImageToS3(buffer, mimeType);
            const data = { ...req.body, image };
            await userRepository_1.default.updateUser(userId, data);
            res.status(200).json({ message: 'Profile updated successfully' });
        }
        catch (error) {
            console.error("Error updating profile:", error);
            res.status(500).json({ error: "Error updating profile" });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await userRepository_1.default.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Error fetching users" });
        }
    }
    async getAllblogs(req, res) {
        try {
            const blogs = await BlogRepository_1.default.getAllBlogs();
            res.status(200).json(blogs);
        }
        catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Error fetching users" });
        }
    }
    async getSingleBlog(req, res) {
        const id = Number(req.query.id);
        try {
            const blog = await BlogRepository_1.default.getBlogById(id);
            res.status(200).json(blog);
        }
        catch (error) {
            console.error("Error fetching blog:", error);
            res.status(500).json({ error: "Error fetching blog" });
        }
    }
    async deleteBlog(req, res) {
        const id = Number(req.query.id);
        try {
            const blog = await BlogRepository_1.default.deleteBlog(id);
            res.status(200).json(blog);
        }
        catch (error) {
            console.error("Error fetching blog:", error);
            res.status(500).json({ error: "Error fetching blog" });
        }
    }
    async editBlog(req, res) {
        const id = Number(req.query.id);
        const { data } = req.body;
        try {
            const blog = await BlogRepository_1.default.updateBlog(id, data);
            res.status(200).json(blog);
        }
        catch (error) {
            console.error("Error fetching blog:", error);
            res.status(500).json({ error: "Error fetching blog" });
        }
    }
    async getAllUserBlogs(req, res) {
        const id = Number(req.query.id);
        try {
            const blog = await BlogRepository_1.default.getAllBlogsByUser(id);
            res.status(200).json(blog);
        }
        catch (error) {
            console.error("Error fetching blog:", error);
            res.status(500).json({ error: "Error fetching blog" });
        }
    }
}
exports.default = new UserController();
