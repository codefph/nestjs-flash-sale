import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateSecKillOrder } from "./dto/create-order.dto.js";
import { randomUUID } from "crypto";

@Injectable()
export class SecKillService {
    constructor(private readonly prismaService:PrismaService){}

    async createOrder(dot: CreateSecKillOrder){
        // 判断秒杀活动是否存在
        const {userId,activityId} = dot;
         const activity = await this.prismaService.client.seckill_activities.findUnique({
            where:{id: BigInt(activityId) },
            include: {products:true}
        })
        if(!activity){
            throw new NotFoundException('秒杀活动不存在');
        }
        const now = new Date();
        if(now < activity.start_time){
            throw new NotFoundException('Activity has no started yet.');
        }
        if(now > activity.end_time){
            throw new NotFoundException('Activity has ended.');
        }
        const existOrder = await this.prismaService.client.orders.findFirst({
            where: {
                user_id: BigInt(userId),
                activity_id: BigInt(activityId),
                status:{not: 2}
            }
        })
        if(existOrder){
            throw new ConflictException('you have already participated');
        }

        // create transaction, create order create order items
        try {
            const result = await this.prismaService.client.$transaction(async (tx)=>{
                const updateResult = await tx.$executeRaw`
                    UPDATE seckill_activities
                    SET stock = stock - 1
                    WHERE id = ${activityId} and stock > 0
                `
                // .updateMany({
                //     where:{
                //         id: BigInt(activityId),
                //         stock: {gt:0}
                //     },
                //     data: {
                //         stock: {decrement : 1},
                //     },
                // })
                if(!updateResult){
                    throw new BadRequestException('Sold out')
                }
                const orderNo = `ORD${Date.now()}${randomUUID().slice(0, 8).toUpperCase()}`;
                const order = await this.prismaService.client.orders.create({
                    data:{
                        order_no: orderNo,
                        user_id: userId,
                        activity_id: activityId,
                        total_amount: activity.seckill_price,
                        status: 0,
                    }
                })
                // 3.4 创建订单明细
                await tx.order_items.create({
                    data: {
                        order_id: order.id,
                        product_id: activity.product_id,
                        quantity: 1,
                        price: activity.seckill_price,
                    },
                });
                return order;
            })
            return {
                code: 200,
                message: '秒杀成功，请尽快支付',
                data: {
                    orderNo: result.order_no,
                    totalAmount: result.total_amount.toString(),
                    status: result.status,
                    createdAt: result.created_at,
                },
            };
        } catch (error) {
            // 如果是业务异常（如售罄），直接抛出
            if (error instanceof BadRequestException) {
                throw error;
            }
            // 其他异常（数据库错误等）统一包装
            console.error('秒杀下单异常:', error);
            throw new BadRequestException('下单失败，请稍后重试');
        }
    }
    // get active activity list
    async getActiveActivities(){
        const now = new Date();
        const activities = await this.prismaService.client.seckill_activities.findMany({
            where: {
                start_time: { lte : now},
                end_time: { gte: now}
            },
            include:{products: true},
            orderBy:{start_time: 'asc'}
        })
        return activities.map((a) => ({
            activityId: a.id.toString(),
            productName: a.products.name,
            seckillPrice: a.seckill_price.toString(),
            originalPrice: a.products.price.toString(),
            stock: a.stock,
            startTime: a.start_time,
            endTime: a.end_time,
        }));
    }
}