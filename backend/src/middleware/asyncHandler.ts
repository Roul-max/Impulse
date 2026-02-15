import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: (req: any, res: any, next: NextFunction) => Promise<any>) =>
  (req: any, res: any, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;