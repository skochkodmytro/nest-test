import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RoleGuard extends JwtAuthGuard implements CanActivate {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const requiredRoles = this.getRoles(context);

    if (!requiredRoles || requiredRoles.length === 0) {
      throw new UnauthorizedException('No roles defined');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new UnauthorizedException('Insufficient role');
    }

    return true;
  }

  private getRoles(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    const roles = Reflect.getMetadata('roles', handler);

    if (!roles) {
      throw new UnauthorizedException('No roles defined');
    }

    return roles as string[];
  }
}
