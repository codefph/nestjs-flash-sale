import { Controller , Get } from '@nestjs/common'
import { ProductService } from './product.service.js';


@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('get')
    getProduct(){
        return this.productService.findAllProducts()
    }
}