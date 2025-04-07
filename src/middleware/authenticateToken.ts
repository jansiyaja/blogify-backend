import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../services/jwtService';

interface ExtendedRequest extends Request {
  user?: {
    id: string;
  };
}

export const authenticateToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokenFromHeader = req.headers.authorization?.split(' ')[1];

    if (!tokenFromHeader) {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ error: 'Access and Refresh tokens are required' });
        return;
      }

      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET || ''
        ) as { id: string };


        const newAccessToken = generateAccessToken(decodedRefreshToken.id); 
       

        res.status(200).json({ accessToken: newAccessToken });
        req.user = { id: String(decodedRefreshToken.id) }; 
        return next();
      } catch (error) {
        res.status(403).json({ error: 'Invalid refresh token' });
        return;
      }
    }

    const decoded = jwt.verify(tokenFromHeader, process.env.ACCESS_TOKEN_SECRET || '') as {
      id: string;
    };

    req.user = { id: decoded.id };
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Invalid or expired access token' });
      return;
    }
    res.status(500).json({ error: 'Unexpected server error' });
  }
};
