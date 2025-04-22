import { Module } from '@nestjs/common';

import { DatabaseService } from 'src/database/database.service';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { IsAssignedToProjectGuard } from './guards/is-assigned-to-project.guard';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, DatabaseService, IsAssignedToProjectGuard],
  exports: [ProjectService, IsAssignedToProjectGuard],
})
export class ProjectModule {}
