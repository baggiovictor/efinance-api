// financing.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { FinancingService } from '../services/financing.service';
import { CreateFinancingDto } from '../dtos/create-financing.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Financing')
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
