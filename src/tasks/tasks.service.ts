import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, Prisma } from '@prisma/client';

import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  async createTask(
    createTaskDto: Prisma.TaskUncheckedCreateInput,
  ): Promise<Task> {
    const user = await this.userService.findUserById(createTaskDto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = await this.projectService.getProjectById(
      createTaskDto.projectId,
    );

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const task = await this.databaseService.task.create({
      data: createTaskDto,
    });

    return task;
  }
}
