import { Controller, Get, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('admin/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/all')
  @HttpCode(200)
  async getAllUsers() {
    const res = await this.userService.getAllUsers();
    return res;
  }
}
