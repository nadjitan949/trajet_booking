import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDTO {
  @IsString()
  @IsEmail({}, { message: 'Email non valide' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty({ message: 'Veuillez renseigner votre mot de passe' })
  password!: string;
}
