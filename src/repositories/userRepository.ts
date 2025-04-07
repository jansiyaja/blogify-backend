
import mongoose from 'mongoose';
import User, { IUser } from '../Models/User';
import Otp, { IOtp } from '../Models/Otp';

class UserRepository {
  async createUser(name: string, email: string, password: string): Promise<IUser> {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new Error('Email is already taken');
      }

      const user = new User({ name, email, password });
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      const users = await User.find({}, {
        name: 1,
        email: 1,
        password: 1,
        createdAt: 1,
      });
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error fetching users');
    }
  }

  async checkUser(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Error checking user:', error);
      throw new Error('Error checking user');
    }
  }

  async createOTP(email: string, otp: string): Promise<IOtp> {
    try {
      const newOtp = new Otp({ email, otp });
      const savedOtp = await newOtp.save();
      console.log('OTP created:', savedOtp);
      return savedOtp;
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw new Error('Error creating OTP');
    }
  }

  async verifyOtp(email: string, otp: string): Promise<IOtp> {
    try {
      const otpRecord = await Otp.findOne({ email, otp });
      if (!otpRecord) throw new Error('Invalid OTP or email');
      return otpRecord;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Error verifying OTP');
    }
  }

  async loginUser(email: string, otp: string): Promise<IOtp> {
    try {
      const otpRecord = await Otp.findOne({ email, otp });
      if (!otpRecord) throw new Error('Invalid OTP or email');
      return otpRecord;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Error verifying OTP');
    }
  }

  async updateUser(id: string, updatedData: Partial<IUser>): Promise<IUser> {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedUser) throw new Error('User not found');
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error updating user');
    }
  }
}

export default new UserRepository();
