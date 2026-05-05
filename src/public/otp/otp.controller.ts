import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ValidateOtpDTO } from './dto/validate-otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('/verify')
  @HttpCode(HttpStatus.ACCEPTED)
  async verifyOtp(@Body() body: ValidateOtpDTO) {
    const res = await this.otpService.verifyOtp(body);
    return res;
  }
}
