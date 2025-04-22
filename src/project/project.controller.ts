import {
  Controller,
  Post,
  UseGuards,
  Body,
  ValidationPipe,
  Get,
  Query,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectService } from './project.service';
import { IsAssignedToProjectGuard } from './guards/is-assigned-to-project.guard';
import { OneOfGuards } from 'src/utils/one-of.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  createProject(@Body(ValidationPipe) body: CreateProjectDto) {
    return this.projectService.createProject(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getProjects(
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Req() req: Request,
  ) {
    return this.projectService.getProjects(req['user'], skip, limit);
  }

  @Get(':id/tasks')
  @UseGuards(JwtAuthGuard, OneOfGuards(RoleGuard, IsAssignedToProjectGuard))
  @Roles('ADMIN')
  getTasks(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.getTasks(id);
  }
}
