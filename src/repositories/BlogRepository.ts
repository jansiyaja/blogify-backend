import prisma from '../prisma/prismaClient';
import { BlogStatus } from '@prisma/client'; 

class BlogRepository {
  async createBlog(
    authorId: number,
    heading: string,
    tag: string,
    content: any,
    coverImageUrl: string,
    status: BlogStatus 
  ) {
    try {
      const newBlog = await prisma.blogPost.create({
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
    } catch (error) {
      console.error('Error creating blog:', error);
      throw new Error('Error creating blog');
    }
  }

  async getBlogById(id: number) {
    try {
      const blog = await prisma.blogPost.findUnique({
        where: {
          id,
        },
      });
      if (!blog) {
        throw new Error('Blog not found');
      }
      return blog;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw new Error('Error fetching blog');
    }
  }

  async updateBlog(id: number, updatedData: Partial<{ 
    heading?: string; 
    tag?: string; 
    content?: any; 
    coverImageUrl?: string; 
    status?: BlogStatus 
  }>) {
    try {
      const updatedBlog = await prisma.blogPost.update({
        where: {
          id,
        },
        data: updatedData,
      });
      return updatedBlog;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw new Error('Error updating blog');
    }
  }

  async deleteBlog(id: number) {
    try {
      const deletedBlog = await prisma.blogPost.delete({
        where: {
          id,
        },
      });
      return deletedBlog;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw new Error('Error deleting blog');
    }
  }

  async getAllBlogsByUser(authorId: number) {
    try {
      const blogs = await prisma.blogPost.findMany({
        where: {
          authorId,
        },
      });
      return blogs;
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      throw new Error('Error fetching user blogs');
    }
    }
    async getAllBlogs() {
    try {
      const blogs = await prisma.blogPost.findMany({});
      return blogs;
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      throw new Error('Error fetching user blogs');
    }
  }
}

export default new BlogRepository();
