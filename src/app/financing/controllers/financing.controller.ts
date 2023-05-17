import {
  Controller,
  Post,
  Body,
  Get,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { FinancingService } from '../services/financing.service';
import { CreateFinancingDto } from '../dtos/create-financing.dto';
import { ApiTags } from '@nestjs/swagger';
import { ParcelService } from '../services/installments.service';

@ApiTags('Financing')
@Controller('financing')
export class FinancingController {
  constructor(
    private financingService: FinancingService,
    private readonly parcelService: ParcelService,
  ) {}

  @Post()
  async createFinancing(@Body() financing: CreateFinancingDto) {
    const createdFinancing = await this.financingService.createFinancing(
      financing,
    );
    return createdFinancing;
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.financingService.findOneOrFail({ where: { id } });
  }

  @Get()
  async getAll() {
    return this.financingService.findAll();
  }

  @Get(':id/parcelas')
  async getParcelsByFinancingId(@Param('id') id: string) {
    return await this.parcelService.findAllByFinancingId(id);
  }
}
