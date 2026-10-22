import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductModule } from './product/product.module.js';
import { SecKillModule } from './seckill/seckill.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
@Module({
  imports: [PrismaModule,SecKillModule,ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
