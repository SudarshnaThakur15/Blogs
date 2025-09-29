import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateTokens = (user) => {
  const payload = { id: user._id, name: user.name, role: user.role };
  
  const accessToken = jwt.sign(payload, config.jwt.secret, { expiresIn: '2h' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

export const verifyToken = (token, secret = config.jwt.secret) => {
  return jwt.verify(token, secret);
};
