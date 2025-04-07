"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../Models/User"));
const Otp_1 = __importDefault(require("../Models/Otp"));
class UserRepository {
    async createUser(name, email, password) {
        try {
            const existingUser = await User_1.default.findOne({ email });
            if (existingUser) {
                throw new Error('Email is already taken');
            }
            const user = new User_1.default({ name, email, password });
            return await user.save();
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error creating user');
        }
    }
    async getAllUsers() {
        try {
            const users = await User_1.default.find({}, {
                name: 1,
                email: 1,
                password: 1,
                createdAt: 1,
            });
            return users;
        }
        catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Error fetching users');
        }
    }
    async checkUser(email) {
        try {
            return await User_1.default.findOne({ email });
        }
        catch (error) {
            console.error('Error checking user:', error);
            throw new Error('Error checking user');
        }
    }
    async createOTP(email, otp) {
        try {
            const newOtp = new Otp_1.default({ email, otp });
            const savedOtp = await newOtp.save();
            console.log('OTP created:', savedOtp);
            return savedOtp;
        }
        catch (error) {
            console.error('Error creating OTP:', error);
            throw new Error('Error creating OTP');
        }
    }
    async verifyOtp(email, otp) {
        try {
            const otpRecord = await Otp_1.default.findOne({ email, otp });
            if (!otpRecord)
                throw new Error('Invalid OTP or email');
            return otpRecord;
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            throw new Error('Error verifying OTP');
        }
    }
    async loginUser(email, otp) {
        try {
            const otpRecord = await Otp_1.default.findOne({ email, otp });
            if (!otpRecord)
                throw new Error('Invalid OTP or email');
            return otpRecord;
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            throw new Error('Error verifying OTP');
        }
    }
    async updateUser(id, updatedData) {
        try {
            const updatedUser = await User_1.default.findByIdAndUpdate(id, updatedData, { new: true });
            if (!updatedUser)
                throw new Error('User not found');
            return updatedUser;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Error updating user');
        }
    }
}
exports.default = new UserRepository();
