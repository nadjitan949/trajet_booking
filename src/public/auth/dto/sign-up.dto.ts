import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  firstname!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le prenom est requis' })
  lastname!: string;

  @IsEmail({}, { message: 'Email non valide' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @IsNotEmpty({ message: 'Definissez un mot de passe pour ce compte' })
  password!: string;
}
