import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './admin/users/users.module';
import { AuthModule } from './public/auth/auth.module';
import { OtpModule } from './public/otp/otp.module';

@Module({
  imports: [UsersModule, AuthModule, OtpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
