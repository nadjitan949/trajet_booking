import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime automatiquement les champs non définis dans le DTO
      forbidNonWhitelisted: true, // Renvoie une erreur si des champs inconnus sont envoyés
      transform: true, // Transforme automatiquement les données en instances de classe
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
