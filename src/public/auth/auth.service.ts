import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignInDTO } from './dto/sign-in.dto';
import bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/sign-up.dto';
import { OtpSources, Prisma } from 'generated/prisma/client';
import crypto from 'node:crypto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(body: SignInDTO) {
    try {
      const { email, phone, password } = body;
      if (email && phone)
        throw new BadRequestException(
          'Veuillez renseigner soit votre email ou votre numéro de téléphone',
        );

      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });

      if (!user)
        throw new NotAcceptableException(
          email
            ? 'Email ou mot de passe incorrect'
            : 'Numéro de téléphone ou mot de passe incorrect',
        );

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        throw new NotAcceptableException(
          email
            ? 'Email ou mot de passe incorrect'
            : 'Numéro de téléphone ou mot de passe incorrect',
        );

      const data = {
        success: true,
        message: 'Bienvenu sur votre compte',
        user,
      };

      return data;
    } catch (error) {
      console.log('Erreur', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }

  async signUp(body: SignUpDTO) {
    try {
      const { email, phone } = body;

      if (!email && !phone) {
        throw new BadRequestException(
          'Vous devez fournir soit un email, soit un numéro de téléphone.',
        );
      }
      const orConditions: Prisma.UserWhereInput[] = [];

      if (email) orConditions.push({ email });
      if (phone) orConditions.push({ phone });

      const where: Prisma.UserWhereInput = { OR: orConditions };

      const existingUser = await this.prisma.user.findFirst({
        where,
      });

      if (existingUser) {
        if (email && existingUser.email === email) {
          throw new ConflictException('Cet email est déjà utilisé.');
        }
        if (phone && existingUser.phone === phone) {
          throw new ConflictException(
            'Ce numéro de téléphone est déjà utilisé.',
          );
        }
      }

      const randomValue = crypto.randomInt(0, 1000000);
      const otp = randomValue.toString().padStart(6, '0');
      const hashOtp = await bcrypt.hash(otp, 10);

      await this.prisma.otp.deleteMany({ where: { user: email || phone } });
      await this.prisma.otp.create({
        data: {
          source: OtpSources.SIGNUP,
          user: email ? email : phone ? phone : 'source inconnus',
          code: hashOtp,
        },
      });

      const destination = email ? 'votre mail' : 'votre numéro de téléphone';
      const message = `Un code a été envoyé à ${destination}. Veuillez le vérifier pour finaliser votre inscription.`;

      const data = {
        success: true,
        message: message,
        otp,
      };

      return data;
    } catch (error) {
      console.log('Erreur', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }

  async forgotPassword(body: ForgotPasswordDTO) {
    try {
      const { email, phone } = body;

      if (!email && !phone)
        throw new BadRequestException(
          'Vous devez fournir soit un email, soit un numéro de téléphone.',
        );

      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });

      if (!user)
        throw new NotAcceptableException(
          email
            ? 'Aucun compte trouvé avec cet email'
            : 'Aucun compte trouvé avec ce numéro de téléphone',
        );

      const randomValue = crypto.randomInt(0, 1000000);
      const otp = randomValue.toString().padStart(6, '0');
      const hashOtp = await bcrypt.hash(otp, 10);
      await this.prisma.otp.deleteMany({ where: { user: email || phone } });
      await this.prisma.otp.create({
        data: {
          source: OtpSources.FORTGOT_PASSWORD,
          user: email ? email : phone ? phone : 'source inconnus',
          code: hashOtp,
        },
      });

      const destination = email ? 'votre mail' : 'votre numéro de téléphone';
      const message = `Un code de réinitialisation a été envoyé à ${destination}. Veuillez le vérifier pour finaliser la réinitialisation de votre mot de passe.`;

      const data = {
        success: true,
        message: message,
        otp,
      };

      return data;
    } catch (error) {
      console.log('Erreur', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }
}
