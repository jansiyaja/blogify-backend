"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
class UserRepository {
    async createUser(name, email, password) {
        try {
            const existingUser = await prismaClient_1.default.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new Error('Email is already taken');
            }
            const user = await prismaClient_1.default.user.create({
                data: {
                    name,
                    email,
                    password,
                },
            });
            return user;
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error creating user');
        }
    }
    async getAllUsers() {
        try {
            const users = await prismaClient_1.default.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                    createdAt: true,
                },
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
            const user = await prismaClient_1.default.user.findUnique({
                where: { email },
            });
            return user;
        }
        catch (error) {
            console.error('Error checking user:', error);
            throw new Error('Error checking user');
        }
    }
    async createOTP(email, otp) {
        try {
            const newOTP = await prismaClient_1.default.otp.create({
                data: {
                    email,
                    otp,
                },
            });
            console.log('OTP created:', newOTP);
            return newOTP;
        }
        catch (error) {
            console.error('Error creating OTP:', error);
            throw error;
        }
    }
    async verifyOtp(email, otp) {
        try {
            const otpRecord = await prismaClient_1.default.otp.findFirst({
                where: {
                    email,
                    otp,
                },
            });
            if (!otpRecord) {
                throw new Error('Invalid OTP or email');
            }
            return otpRecord;
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            throw new Error('Error verifying OTP');
        }
    }
    async loginUser(email, otp) {
        try {
            const otpRecord = await prismaClient_1.default.otp.findFirst({
                where: {
                    email,
                    otp,
                },
            });
            if (!otpRecord) {
                throw new Error('Invalid OTP or email');
            }
            return otpRecord;
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            throw new Error('Error verifying OTP');
        }
    }
    async updateUser(id, updatedData) {
        try {
            const updatedUser = await prismaClient_1.default.user.update({
                where: {
                    id,
                },
                data: updatedData,
            });
            return updatedUser;
        }
        catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Error updating user');
        }
    }
}
exports.default = new UserRepository();
