import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import itemsPool from './config/';
import userRoute from './routes/users.routes';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
// import runMigrations from 'node-pg-migrate';

async function bootstrap() {
  // Connect to the database
  try {
    await itemsPool.itemsPool.connect();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return;
  }

  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.use('/user', userRoute);

  app.listen(3000, () => {
    console.log(`Server is listening on port  ${process.env.PORT}....`);
  });
}

bootstrap();
