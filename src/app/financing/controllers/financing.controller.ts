// financing.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { FinancingService } from '../services/financing.service';
import { CreateFinancingDto } from '../dtos/create-financing.dto';

@Controller('financing')
export class FinancingController {
  constructor(private financingService: FinancingService) {}

  @Post()
  async createFinancing(@Body() financing: CreateFinancingDto) {
    const createdFinancing = await this.financingService.createFinancing(
      financing,
    );
    return createdFinancing;
  }
}
