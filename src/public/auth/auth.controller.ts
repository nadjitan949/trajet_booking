import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  @HttpCode(HttpStatus.ACCEPTED)
  async signIn(@Body() body: SignInDTO) {
    const res = await this.authService.signIn(body);
    return res;
  }

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: SignUpDTO) {
    const res = await this.authService.signUp(body);
    return res;
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    const res = await this.authService.forgotPassword(body);
    return res;
  }
}
