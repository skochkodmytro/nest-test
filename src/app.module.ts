import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';
import { JwtMiddleware } from './auth/middlewares/jwt.middleware';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
    ProjectModule,
    ConfigModule.forRoot(),
    TasksModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
