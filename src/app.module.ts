import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TestResolverModule } from './test-resolver/test-resolver.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    SchedulerModule,
    TestResolverModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
