import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers['cookie']) {
      throw new UnauthorizedException('User not authorized');
    }
    const token = req.headers['cookie'].split('=')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (decodedToken) {
        return true;
      }
      throw new UnauthorizedException('User not authorized');
    } catch (error) {
      console.error(error);
    }
  }
}
