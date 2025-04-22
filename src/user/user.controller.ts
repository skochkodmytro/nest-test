import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';

import { CreateUserDto } from './dto/create-user.dto';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  createUser(@Body(ValidationPipe) body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Post(':userId/assign-project/:projectId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('ADMIN')
  async assignProjectToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    return this.userService.assignProjectToUser(userId, projectId);
  }

  // @Get('tasks')
  // @UseGuards(JwtAuthGuard)
  // getTasks(@Req() req: Request) {
  //   return this.userService.getTasks(req['user']);
  // }
}
