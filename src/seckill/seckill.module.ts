import { Global, Module } from '@nestjs/common';
import { SecKillService } from './seckill.service.js';
import { SecKillController } from './seckill.controller.js';

@Module({
  controllers: [SecKillController],
  providers: [SecKillService],
})
export class SecKillModule {}