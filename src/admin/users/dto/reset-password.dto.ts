import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsNumber({}, { message: "L'id doit être un nombre" })
  @IsNotEmpty({ message: 'Veuillez indiquer le compte' })
  userId!: number;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au minumum 8 caractères',
  })
  @IsNotEmpty({ message: 'Veuillez definir le nouveau mot de passe !' })
  password!: string;
}
