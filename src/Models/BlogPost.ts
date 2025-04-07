import mongoose, { Document, Schema } from 'mongoose';

export enum BlogStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface IBlogPost extends Document {
  id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  heading: string;
  tag: string;
  content: any;
  coverImageUrl: string;
  status: BlogStatus;
  image?: string;
  about?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema<IBlogPost> = new Schema({
    id:{type:Schema.Types.ObjectId},
 author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 heading: { type: String, required: true },
  tag: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  coverImageUrl: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(BlogStatus),
    default: BlogStatus.DRAFT,
  },
  image: { type: String },
  about: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
