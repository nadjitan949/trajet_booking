import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Email invalide' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
