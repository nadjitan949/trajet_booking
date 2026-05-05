/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignInDTO } from './dto/sign-in.dto';
import bcrypt from 'bcrypt'
import { SignUpDTO } from './dto/sign-up.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async signIn(body: SignInDTO) {
        try {

            const { email, phone, password } = body
            if (email && phone) throw new BadRequestException("Veuillez renseigner soit votre email ou votre numéro de téléphone")

            const user = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { phone }
                    ]
                }
            });

            if (!user) throw new NotAcceptableException(email ? "Email ou mot de passe incorrect" : "Numéro de téléphone ou mot de passe incorrect")

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) throw new NotAcceptableException(email ? "Email ou mot de passe incorrect" : "Numéro de téléphone ou mot de passe incorrect")

            const data = {
                success: true,
                message: "Bienvenu sur votre compte",
                user
            }

            return data

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

            const { email, phone, password } = body

            if (!email && !phone) {
                throw new BadRequestException("Vous devez fournir soit un email, soit un numéro de téléphone.");
            }
            const orConditions: Prisma.UserWhereInput[] = [];

            if (email) orConditions.push({ email });
            if (phone) orConditions.push({ phone });

            const where: Prisma.UserWhereInput = { OR: orConditions };

            const existingUser = await this.prisma.user.findFirst({
                where
            });

            if (existingUser) {
                if (email && existingUser.email === email) {
                    throw new ConflictException("Cet email est déjà utilisé.");
                }
                if (phone && existingUser.phone === phone) {
                    throw new ConflictException("Ce numéro de téléphone est déjà utilisé.");
                }
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const newUser = await this.prisma.user.create({ data: { ...body, password: hashPassword } })

            const data = {
                success: true,
                message: "Votre compte a été crée avec succes." + email ? " Un code à 6 chiffres a été envoyé sur votre mail" : " Un code à 6 chiffre a été envoyé à votre numéro de téléphone",
                newUser,
            }

            return data

        } catch (error) {
            console.log('Erreur', error);
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(
                `Erreur interne survenus: ${error}`,
            );
        }

    }
}
