import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PreAUTHMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) 
        throw new BadRequestException(' Missing Authorization Headers ')
        
    
    next();
  }
}
