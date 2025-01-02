import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../services/jwtService';

interface ExtendedRequest extends Request {
  user?: {
    id: number;
 
  };
}

export const authenticateToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokenFromHeader = req.headers.authorization?.split(' ')[1]; 
    console.log(tokenFromHeader);
    

    if (!tokenFromHeader) {
      const refreshToken =  req.body.refreshToken; 

      if (!refreshToken) {
        console.error('Access and Refresh tokens are missing');
        res.status(401).json({ error: 'Access and Refresh tokens are required' });
        return;
      }

      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET || ''
        ) as { id: number };

     
        const newAccessToken = generateAccessToken(decodedRefreshToken.id);

        res.status(200).json({ accessToken: newAccessToken }); 
        req.user = { id: decodedRefreshToken.id }; 

        console.info('New access token generated from refresh token');
        return next();
      } catch (error) {
        console.error('Invalid refresh token', error);
        res.status(403).json({ error: 'Invalid refresh token' });
        return;
      }
    }

    const decoded = jwt.verify(tokenFromHeader, process.env.ACCESS_TOKEN_SECRET || '') as {
      id: number;
   
    };

console.log("deoceded",decoded);


    req.user = { id: decoded.id};

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('Access token invalid or expired');
      res.status(401).json({ error: 'Invalid or expired access token' });
      return;
    }

    console.error('Unexpected error in token authentication', error);
    res.status(500).json({ error: 'Unexpected server error' });
  }
};
