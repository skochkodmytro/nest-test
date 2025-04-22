import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Project, Task, User } from '@prisma/client';

import { DatabaseService } from 'src/database/database.service';

import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createProject(createProjectDto: CreateProjectDto) {
    return this.databaseService.project.create({
      data: createProjectDto,
    });
  }

  async getProjects(user: User, skip = 0, limit = 10) {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const whereClause =
      user.role === 'ADMIN'
        ? {}
        : {
            users: {
              some: {
                userId: user.id,
              },
            },
          };

    const [projects, total] = await this.databaseService.$transaction([
      this.databaseService.project.findMany({
        where: whereClause,
        skip,
        take: limit,
      }),
      this.databaseService.project.count({ where: whereClause }),
    ]);

    return {
      data: projects,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async isUserAssignedToProject(
    userId: number,
    projectId: number,
  ): Promise<boolean> {
    const project = await this.databaseService.userProject.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    console.log(project);

    return !!project;
  }

  async getProjectById(id: number): Promise<Project | null> {
    const project = await this.databaseService.project.findUnique({
      where: { id },
    });

    return project;
  }

  async getTasks(projectId: number, skip = 0, limit = 10): Promise<Task[]> {
    const tasks = await this.databaseService.task.findMany({
      where: { projectId },
      skip,
      take: limit,
    });

    if (!tasks) {
      throw new NotFoundException('Tasks not found');
    }

    return tasks;
  }
}
