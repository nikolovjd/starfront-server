import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const authCookie = req.signedCookies.auth;
    if (authCookie) {
      (req.body as any).refreshToken = authCookie;
    }
    next();
  }
}
