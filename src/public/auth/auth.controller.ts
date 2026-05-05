/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/sign-in')
    @HttpCode(HttpStatus.ACCEPTED)
    async signIn(@Body() body: SignInDTO) {
        const res = await this.authService.signIn(body)
        return res
    }
}
