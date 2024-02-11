import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import admin from 'firebase-admin';
// import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers['cookie']) {
      throw new UnauthorizedException('User not authorized');
    }
    const token = req.headers['cookie'].split('=')[1];

    try {
      const verify = async () => {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
      };
      if (verify) {
        return true;
      }
      throw new UnauthorizedException('User not authorized');
    } catch (error) {
      console.log(error);
    }
  }
}
