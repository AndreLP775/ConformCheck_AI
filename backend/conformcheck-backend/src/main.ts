import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://turbo-engine-975gvwqp95xq3prrw-4200.app.github.dev',
    methods: ['GET', 'POST'],
    credentials: false,
  });

  await app.listen(3000);
}
bootstrap();
