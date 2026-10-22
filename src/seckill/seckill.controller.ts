import { Body, Controller , Get, Post } from '@nestjs/common'
import { SecKillService } from './seckill.service.js';
import { CreateSecKillOrder } from './dto/create-order.dto.js';


@Controller('seckill')
export class SecKillController {
    constructor(private readonly secKillService: SecKillService) {}

    @Get('activities')
    getProduct(){
        return this.secKillService.getActiveActivities()
    }
    @Post('order')
    createOrder(@Body() dto:CreateSecKillOrder){
        return this.secKillService.createOrder(dto)
    }
}
