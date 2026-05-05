import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ValidateOtpDTO } from './dto/validate-otp.dto';
import bcrypt from 'bcrypt';
import { OtpSources } from 'generated/prisma/enums';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  async verifyOtp(body: ValidateOtpDTO) {
    try {
      const { email, phone, code, password } = body;
      if (!email && !phone)
        throw new BadRequestException(
          'Vous devez fournir soit un email, soit un numéro de téléphone.',
        );

      const identifier = email ?? phone;
      const otp = await this.prisma.otp.findFirst({
        where: { user: identifier },
      });

      if (!otp)
        throw new NotAcceptableException(
          email
            ? 'Email ou code OTP incorrect'
            : 'Numéro de téléphone ou code OTP incorrect',
        );

      const isMatch = await bcrypt.compare(code, otp.code);
      if (!isMatch)
        throw new NotAcceptableException(
          email
            ? 'Email ou code OTP incorrect'
            : 'Numéro de téléphone ou code OTP incorrect',
        );

      if (otp.source === OtpSources.SIGNUP) {
        if (!password) {
          throw new BadRequestException(
            'Le mot de passe est requis pour la création du compte.',
          );
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prisma.user.create({
          data: {
            firstname: body.firstname!,
            lastname: body.lastname!,
            email: body.email,
            phone: body.phone,
            password: hashPassword,
          },
        });

        const data = {
          success: true,
          message: 'Votre compte a été crée avec succes',
          newUser,
        };

        await this.prisma.otp.deleteMany({ where: { user: email || phone } });

        return data;
      }
    } catch (error) {
      console.log('Erreur', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }
}
