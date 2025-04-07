
import dotenv from "dotenv";
import express from "express";
import { userRouter } from "./Routes/userRoute";
import cors from 'cors'
import errorHandler from "./middleware/errorhandler";



dotenv.config();
const app = express()
app.use(express.json()); 


  console.log(process.env.FRONTEND_URL);

  app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use('/users', userRouter);
 app.use(errorHandler)



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port} http://localhost:8000`);
});
