/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignInDTO } from './dto/sign-in.dto';
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async signIn(body: SignInDTO) {
        try {

            const { email, phone, password } = body
            if(email && phone) throw new BadRequestException("Veuillez renseigner soit votre email ou votre numéro de téléphone")

            const user = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { email },
                        { phone }
                    ]
                }
            });

            if(!user) throw new NotAcceptableException(email ? "Email ou mot de passe incorrect" : "Numéro de téléphone ou mot de passe incorrect")

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) throw new NotAcceptableException(email ? "Email ou mot de passe incorrect" : "Numéro de téléphone ou mot de passe incorrect")

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
}
