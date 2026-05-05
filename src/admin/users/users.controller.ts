import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('admin/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    const res = await this.userService.getAllUsers();
    return res;
  }
}
