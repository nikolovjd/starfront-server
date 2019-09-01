import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentBuilder = new DocumentBuilder()
    .setTitle('Starfront')
    .setDescription('Starfront API')
    .setVersion('1.0.0')
    .setBasePath('api')
    .setSchemes('http', 'https')
    .addBearerAuth('Authorization', 'header');

  SwaggerModule.setup(
    'documentation',
    app,
    SwaggerModule.createDocument(app, documentBuilder.build()),
  );

  Logger.log('Swagger enabled', 'Main');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
