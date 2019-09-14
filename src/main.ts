import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import * as cluster from 'cluster';
import * as os from 'os';
import { AuthCookieMiddleware } from './auth/middleware/auth-cookie.middleware';

const numberOfCores = os.cpus().length;

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
  // TODO: CRITICAL: secret to config
  app.use(cookieParser('giga-secret-no-kidding'));

  await app.listen(3000);
}

interface IWorker {
  id: number;
  index: number;
  worker: any;
}

if (cluster.isMaster) {
  console.log(`Master PID: ${process.pid} is running`);

  const workerCount = numberOfCores;
  const workers: IWorker[] = [];

  for (let i = 0; i < workerCount; i++) {
    const worker = cluster.fork({
      WORKER_INDEX: i,
      WORKER_COUNT: workerCount,
    });

    workers.push({
      id: worker.id,
      index: i,
      worker,
    });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ID: ${worker.id} has died with CODE: ${code} SIGNAL: ${signal}`,
    );

    const deadWorker = workers.find(w => {
      return w.id === worker.id;
    });

    const newWorker = cluster.fork({
      WORKER_INDEX: deadWorker.index,
      WORKER_COUNT: workerCount,
    });

    deadWorker.id = newWorker.id;
    deadWorker.worker = newWorker;
  });
} else {
  console.log('PID: ', process.pid);
  bootstrap();
}
