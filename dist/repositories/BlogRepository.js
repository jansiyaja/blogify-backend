"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
class BlogRepository {
    async createBlog(authorId, heading, tag, content, coverImageUrl, status) {
        try {
            const newBlog = await prismaClient_1.default.blogPost.create({
                data: {
                    authorId,
                    heading,
                    tag,
                    content,
                    coverImageUrl,
                    status,
                },
            });
            return newBlog;
        }
        catch (error) {
            console.error('Error creating blog:', error);
            throw new Error('Error creating blog');
        }
    }
    async getBlogById(id) {
        try {
            const blog = await prismaClient_1.default.blogPost.findUnique({
                where: {
                    id,
                },
            });
            if (!blog) {
                throw new Error('Blog not found');
            }
            return blog;
        }
        catch (error) {
            console.error('Error fetching blog:', error);
            throw new Error('Error fetching blog');
        }
    }
    async updateBlog(id, updatedData) {
        try {
            const updatedBlog = await prismaClient_1.default.blogPost.update({
                where: {
                    id,
                },
                data: updatedData,
            });
            return updatedBlog;
        }
        catch (error) {
            console.error('Error updating blog:', error);
            throw new Error('Error updating blog');
        }
    }
    async deleteBlog(id) {
        try {
            const blog = await prismaClient_1.default.blogPost.findUnique({
                where: { id },
            });
            if (!blog) {
                throw new Error("Blog post not found");
            }
            const deletedBlog = await prismaClient_1.default.blogPost.delete({
                where: { id },
            });
            return deletedBlog;
        }
        catch (error) {
            console.error('Error deleting blog:', error);
            throw new Error('Error deleting blog');
        }
    }
    async getAllBlogsByUser(authorId) {
        try {
            const blogs = await prismaClient_1.default.blogPost.findMany({
                where: {
                    authorId,
                },
            });
            return blogs;
        }
        catch (error) {
            console.error('Error fetching user blogs:', error);
            throw new Error('Error fetching user blogs');
        }
    }
    async getAllBlogs() {
        try {
            const blogs = await prismaClient_1.default.blogPost.findMany({});
            return blogs;
        }
        catch (error) {
            console.error('Error fetching user blogs:', error);
            throw new Error('Error fetching user blogs');
        }
    }
}
exports.default = new BlogRepository();
