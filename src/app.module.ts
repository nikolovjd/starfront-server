import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { MapModule } from './map/map.module';
import { EmpireModule } from './empire/empire.module';
import { AuthCookieMiddleware } from './auth/middleware/auth-cookie.middleware';
import { BaseModule } from './base/base.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    SchedulerModule,
    MapModule,
    EmpireModule,
    BaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthCookieMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
