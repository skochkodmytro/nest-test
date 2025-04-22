import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [DatabaseModule, AuthModule],
})
export class UserModule {}
