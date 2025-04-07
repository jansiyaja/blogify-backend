import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  updatedAt: Date;
}

const OtpSchema: Schema<IOtp> = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TTL index for 5 minutes
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export default mongoose.model<IOtp>('Otp', OtpSchema);
