import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { DatabaseService } from 'src/database/database.service';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, ...rest } = createUserDto;

    const existingUser = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.databaseService.user.create({
      data: {
        ...rest,
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async assignProjectToUser(userId: number, projectId: number) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    const project = await this.databaseService.project.findUnique({
      where: { id: projectId },
    });

    if (!user || !project) {
      throw new NotFoundException('User or project not found');
    }

    const existing = await this.databaseService.userProject.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Project already assigned to user');
    }

    return this.databaseService.userProject.create({
      data: {
        userId,
        projectId,
      },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    return user;
  }

  // async getTasks(user: User, skip = 0, limit = 10) {
  //   if (!user) {
  //     throw new UnauthorizedException('User not found');
  //   }

  //   const tasks = await this.databaseService.task.findMany({
  //     where: {
  //       userId: user.id,
  //     },
  //     skip,
  //     take: limit,
  //   });

  //   return tasks;
  // }
}
