import { Controller, Post, Body, Res, UsePipes } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { UserValidationPipe } from '../joi/joi-validation.pipe';
import { createUserSchema, loginSchema } from '../schemas/user.schema';
import { Response } from 'express';

@Controller({ path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new UserValidationPipe(createUserSchema))
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { username, password, email, userType } = createUserDto;

    try {
      const userResponse = await admin.auth().createUser({
        email: email,
        password: password,
      });

      const user = await this.userService.createUser(
        username,
        password,
        email,
        userType,
        userResponse.uid,
      );

      res.status(200).json({
        message: 'User successfully created',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        message: 'User not created',
        error: error.message,
      });
    }
  }

  @Post('login')
  @UsePipes(new UserValidationPipe(loginSchema))
  async login(@Body() { email, password }, @Res() res: Response) {
    try {
      const loggedInUser = await this.userService.login(email, password);

      if (!loggedInUser || loggedInUser == null) {
        res.status(400).json({
          message: 'Login failed',
          error: 'User not found',
        });
      }
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const token = await userCredential.user.getIdToken();

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
      res.status(200).json({
        message: 'User successfully logged in',
        data: {
          username: loggedInUser.username,
          email: loggedInUser.email,
          user_id: loggedInUser.id,
        },
      });
    } catch (error) {
      res.status(403).json({
        message: 'Login failed',
        error: error.message,
      });
    }
  }
}
