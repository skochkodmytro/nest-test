import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ProjectService } from '../project.service';

@Injectable()
export class IsAssignedToProjectGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = parseInt(request.params.id);

    const isAssigned = await this.projectService.isUserAssignedToProject(
      user.id,
      projectId,
    );

    if (!isAssigned) {
      throw new ForbiddenException('User is not assigned to this project');
    }

    return true;
  }
}
