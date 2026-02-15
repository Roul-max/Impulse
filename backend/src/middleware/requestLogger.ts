import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const requestLogger = (req: any, res: any, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      if (process.env.NODE_ENV === 'development') {
         // Console handled by Winston console transport
      }
      logger.warn(message, { 
          ip: req.ip, 
          method: req.method, 
          url: req.originalUrl, 
          status: res.statusCode,
          duration 
      });
    } else {
      logger.info(message, { 
          ip: req.ip, 
          method: req.method, 
          url: req.originalUrl, 
          status: res.statusCode, 
          duration 
      });
    }
  });

  next();
};

export default requestLogger;