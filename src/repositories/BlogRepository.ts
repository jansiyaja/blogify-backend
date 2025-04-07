import mongoose from 'mongoose';
import BlogPost, { BlogStatus, IBlogPost } from '../Models/BlogPost';

class BlogRepository {
  async createBlog(
    
    author:string,
    heading: string,
    tag: string,
    content: any,
    coverImageUrl: string,
    status: BlogStatus
  ): Promise<IBlogPost> {
    try {
     
      const normalizedStatus = status ? status.toUpperCase() : BlogStatus.DRAFT;

      const newBlog = new BlogPost({
        author:author,
        heading,
        tag,
        content,
        coverImageUrl,
        status: normalizedStatus,
      });

      return await newBlog.save();
    } catch (error) {
      console.error('Error creating blog:', error);
      throw new Error('Error creating blog');
    }
  }



async getBlogById(id: string): Promise<IBlogPost> {
  try {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid Blog ID format');
    }
 const objectId = new mongoose.Types.ObjectId(id);
    const blog = await BlogPost.findById(objectId)
      .populate('author', 'name email image')
      .exec();

    if (!blog) {
      throw new Error('Blog not found');
    }

    return blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw new Error('Error fetching blog');
  }
}



  async updateBlog(
    id: string,
    updatedData: Partial<{
      heading?: string;
      tag?: string;
      content?: any;
      coverImageUrl?: string;
      status?: BlogStatus;
    }>
  ): Promise<IBlogPost> {
    try {
      const updatedBlog = await BlogPost.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      if (!updatedBlog) throw new Error('Blog not found');
      return updatedBlog;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw new Error('Error updating blog');
    }
  }

  async deleteBlog(id: string): Promise<IBlogPost> {
    try {
      const deletedBlog = await BlogPost.findByIdAndDelete(id);
      if (!deletedBlog) throw new Error('Blog not found');
      return deletedBlog;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw new Error('Error deleting blog');
    }
  }

async getAllBlogsByUser(authorId: string): Promise<IBlogPost[]> {
  try {

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      throw new Error('Invalid authorId');
    }
    const blogs = await BlogPost.find({ author: (authorId) });

  
    if (blogs.length === 0) {
      console.log('No blogs found for this author');
    }

    return blogs;
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    throw new Error('Error fetching user blogs');
  }
}


  async getAllBlogs(): Promise<IBlogPost[]> {
    try {
      return await BlogPost.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw new Error('Error fetching blogs');
    }
  }
}

export default new BlogRepository();
