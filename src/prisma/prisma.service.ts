import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '../lib/prisma.js'; // 指向你上面那份初始化文件

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // 把连接实例暴露出来
  public client = prisma;

  async onModuleInit() {
    await this.client.$connect();
    console.log('✅ Prisma 已连接到 MySQL');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}