import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';

import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [DatabaseModule, UserModule, ProjectModule],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
