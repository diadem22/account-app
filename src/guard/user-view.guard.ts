import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import admin from 'firebase-admin';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UserViewGuard implements CanActivate {
  constructor(private sequelize: Sequelize) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['cookie'].split('=')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      const user = await this.sequelize.models.User.findOne({
        attributes: ['userType', 'id'],
        where: { uuid: decodedToken.uid },
      });
      const account = await this.sequelize.models.Account.findOne({
        attributes: ['id', 'user_id'],
        where: { id: req.params.account_id },
      });
      if (user.dataValues.userType === 'B') {
        return true;
      } else if (
        account.dataValues.id == req.params.account_id &&
        account.dataValues.user_id == user.dataValues.id
      ) {
        return true;
      }
      throw new UnauthorizedException('User not authorized');
    } catch (error) {
      console.error(error);
    }
  }
}
