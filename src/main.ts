import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import itemsPool from './config';
import { initializeApp } from 'firebase/app';
import firebase_admin from 'firebase-admin';
import dotenv from 'dotenv';
import express from 'express';
// import { UserController } from './users/users.controller';
// import { AccountController } from './account/account.controller';
// import firebase from 'firebase';

// import credentials from './auth/service_account.json';
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

  // admin.initializeApp();

  firebase_admin.initializeApp({
    credential: firebase_admin.credential.applicationDefault(),
  });

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  };

  // Initialize Firebase
  initializeApp(firebaseConfig);

  // admin.initializeApp({
  //   credential: admin.credential.cert({
  //     projectId: credentials.project_id,
  //     privateKey: credentials.private_key,
  //     clientEmail: credentials.client_email,
  //   }),
  // });

  const app = await NestFactory.create(AppModule);
  app.use(express.json());

  app.listen(3000, () => {
    console.log(`Server is listening on port  ${process.env.PORT}....`);
  });
}

bootstrap();
