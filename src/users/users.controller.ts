import { Controller, Post, Body, Res } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Response } from 'express';

@Controller({ path: 'user' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { username, password, email, userType } = createUserDto;

    const userResponse = await admin.auth().createUser({
      email: email,
      password: password,
    });

    try {
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
        message: 'User not successfully created',
        error: 'Check that all required fields are imputed',
      });
    }
  }

  @Post('login')
  async login(@Body() { email, password }, @Res() res: Response) {
    try {
      const loggedInUser = await this.userService.login(email, password);
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
        data: loggedInUser,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Login failed',
        error: error.message,
      });
    }
  }
}
