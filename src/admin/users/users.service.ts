import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany();

      const data = {
        success: true,
        message:
          users.length > 0
            ? 'Aucun utilisateur trouvé'
            : 'Liste des utilisateurs',
        users,
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }

  async getOneUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      const data = {
        success: true,
        message: "Details de l'utilisateur",
        user,
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }

  async createUser(body: CreateUserDTO) {
    try {
      const { email, phone, password } = body;

      const existEmail = await this.prisma.user.findUnique({
        where: { email },
      });
      const existPhone = await this.prisma.user.findUnique({
        where: { phone },
      });

      if (existEmail)
        throw new ConflictException(
          'Cet email est déjà associé à un autre compte',
        );
      if (existPhone)
        throw new ConflictException(
          'Ce numero de téléphone est déjà associé à un autre utilisateur',
        );

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await this.prisma.user.create({
        data: { ...body, password: hashPassword },
      });

      const data = {
        success: true,
        message: 'Nouvelle utilisateur crée',
        newUser,
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }

  async updateUser(id: number, body: UpdateUserDTO) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: body,
      });

      const data = {
        success: true,
        message: 'Compte mis à jour !',
        updatedUser,
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      await this.prisma.user.delete({ where: { id } });

      const data = {
        success: true,
        message: 'Compte supprimé',
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }

  async resetPassword(body: ResetPasswordDTO) {
    try {
      const { password, userId } = body;

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('Utilisateur introuvable');

      const hashPassword = await bcrypt.hash(password, 10);
      const updatedPassword = await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashPassword },
      });

      const data = {
        success: true,
        message: 'Mot de passe mis à jour !',
        updatedPassword,
      };

      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        `Erreur interne survenus: ${error}`,
      );
    }
  }
}
