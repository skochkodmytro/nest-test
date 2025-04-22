import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }
}
