import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductService } from './service/product.service.js';
import { ProductController } from './controller/product.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
@Module({
  imports: [PrismaModule],
  controllers: [AppController,ProductController],
  providers: [AppService,ProductService],
})
export class AppModule {}
