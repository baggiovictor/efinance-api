// financing.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancingEntity } from '../entities/finance.entity';
import { ParcelService } from './installments.service';
import { CreateFinancingDto } from '../dtos/create-financing.dto';

@Injectable()
export class FinancingService {
  constructor(
    @InjectRepository(FinancingEntity)
    private financingRepository: Repository<FinancingEntity>,
    private parcelService: ParcelService,
  ) {}

  async createFinancing(
    financing: CreateFinancingDto,
  ): Promise<Partial<FinancingEntity>> {
    const createdFinancing = await this.financingRepository.save(financing);

    // Chamar o serviço ParcelService para calcular e salvar as parcelas
    await this.parcelService.createParcels(createdFinancing);

    return createdFinancing;
  }
}
