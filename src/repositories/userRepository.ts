import prisma from '../prisma/prismaClient';

class UserRepository {
 
async createUser(name: string, email: string, password: string) {
  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email is already taken');
    }

    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}



  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          password:true,
          createdAt: true,
        },
      });
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Error fetching users');
    }
  }

 
  async checkUser(email: string) {
    try {
      const user = await prisma.user.findUnique({
       where: { email }, 
      });
      return user; 
    } catch (error) {
      console.error('Error checking user:', error);
      throw new Error('Error checking user');
    }
  }

async createOTP(email: string, otp: string) {
  try {
    const newOTP = await prisma.otp.create({
      data: {
        email,
        otp,
      },
    });
    console.log('OTP created:', newOTP);
    return newOTP;
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw error;
  }
}
async verifyOtp(email: string, otp: string) {
  try {
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        otp,
      },
    });

    if (!otpRecord) {
      throw new Error('Invalid OTP or email');
    }

    return otpRecord;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Error verifying OTP');
  }
  }
  async loginUser(email: string, otp: string) {
  try {
    const otpRecord = await prisma.otp.findFirst({
      where: {
        email,
        otp,
      },
    });

    if (!otpRecord) {
      throw new Error('Invalid OTP or email');
    }

    return otpRecord;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Error verifying OTP');
  }
  }
  async updateUser(id: number, updatedData: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: updatedData,
      });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error updating user');
    }
  }



}

export default new UserRepository();
