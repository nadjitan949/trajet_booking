import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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
}
