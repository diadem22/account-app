import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import sequelizeConnection from './config/index';

async function bootstrap() {
  // Initialize Sequelize and test the database connection
  try {
    await sequelizeConnection.sequelizeConnection.authenticate();
    console.log('Database connection has been established successfully.');

    // Create the Nest.js application
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    console.log('Nest application is running on port 3000');
    console.log('${process.env.DATABASE_NAME}');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

bootstrap();
