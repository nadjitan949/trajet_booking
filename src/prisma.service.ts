import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Initialiser le pool de connexion pg
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });

    // 2. Créer l'adapter pour PostgreSQL
    const adapter = new PrismaPg(pool);

    // 3. Passer l'adapter au constructeur de PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
