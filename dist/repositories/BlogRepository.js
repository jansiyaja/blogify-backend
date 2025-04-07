"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BlogPost_1 = __importStar(require("../Models/BlogPost"));
class BlogRepository {
    async createBlog(author, heading, tag, content, coverImageUrl, status) {
        try {
            const normalizedStatus = status ? status.toUpperCase() : BlogPost_1.BlogStatus.DRAFT;
            const newBlog = new BlogPost_1.default({
                author: author,
                heading,
                tag,
                content,
                coverImageUrl,
                status: normalizedStatus,
            });
            return await newBlog.save();
        }
        catch (error) {
            console.error('Error creating blog:', error);
            throw new Error('Error creating blog');
        }
    }
    async getBlogById(id) {
        try {
            const blog = await BlogPost_1.default.findById(id);
            if (!blog)
                throw new Error('Blog not found');
            return blog;
        }
        catch (error) {
            console.error('Error fetching blog:', error);
            throw new Error('Error fetching blog');
        }
    }
    async updateBlog(id, updatedData) {
        try {
            const updatedBlog = await BlogPost_1.default.findByIdAndUpdate(id, updatedData, {
                new: true,
            });
            if (!updatedBlog)
                throw new Error('Blog not found');
            return updatedBlog;
        }
        catch (error) {
            console.error('Error updating blog:', error);
            throw new Error('Error updating blog');
        }
    }
    async deleteBlog(id) {
        try {
            const deletedBlog = await BlogPost_1.default.findByIdAndDelete(id);
            if (!deletedBlog)
                throw new Error('Blog not found');
            return deletedBlog;
        }
        catch (error) {
            console.error('Error deleting blog:', error);
            throw new Error('Error deleting blog');
        }
    }
    async getAllBlogsByUser(authorId) {
        try {
            return await BlogPost_1.default.find({ authorId: new mongoose_1.default.Types.ObjectId(authorId) });
        }
        catch (error) {
            console.error('Error fetching user blogs:', error);
            throw new Error('Error fetching user blogs');
        }
    }
    async getAllBlogs() {
        try {
            return await BlogPost_1.default.find().sort({ createdAt: -1 });
        }
        catch (error) {
            console.error('Error fetching blogs:', error);
            throw new Error('Error fetching blogs');
        }
    }
}
exports.default = new BlogRepository();
