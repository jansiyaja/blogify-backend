
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; 
import userRepository from '../repositories/userRepository';


class UserController {
  async createUser(req: Request, res: Response) {
      const {name,email,password } = req.body;
      
      
      try {
          
     const existingUser = await userRepository.checkUser(email)
    if (existingUser) {
       res.status(400).json({ message: 'Email already exists' });
          }
          
     const hashedPassword = await bcrypt.hash(password, 10); 
        
      const user = await userRepository.createUser(name, email,hashedPassword);
     res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error creating user' });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userRepository.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  }

  
}

export default new UserController();
