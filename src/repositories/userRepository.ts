import prisma from '../prisma/prismaClient';

class UserRepository {
 
  async createUser(name: string, email: string, password:string) {
    try {
      const user = await prisma.user.create({
        data: {
              name,
              email,
            password
          
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
}

export default new UserRepository();
