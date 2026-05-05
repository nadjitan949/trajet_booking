import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller('admin/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    const res = await this.userService.getAllUsers();
    return res;
  }

  @Get('/details/:id')
  @HttpCode(HttpStatus.OK)
  async getOneUset(@Param('id', ParseIntPipe) id: number) {
    const res = await this.userService.getOneUser(id);
    return res;
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDTO) {
    const res = await this.userService.createUser(body);
    return res;
  }

  @Put('/update/:id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDTO,
  ) {
    const res = await this.userService.updateUser(id, body);
    return res;
  }

  @Patch('/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDTO) {
    const res = await this.userService.resetPassword(body);
    return res;
  }

  @Delete('/delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const res = await this.userService.deleteUser(id);
    return res;
  }
}
