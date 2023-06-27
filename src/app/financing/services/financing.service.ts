import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
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

    await this.parcelService.createParcels(createdFinancing);

    return createdFinancing;
  }

  async findAll() {
    return await this.financingRepository.find({
      select: [
        'id',
        'amountFinanced',
        'amountOfTimes',
        'tax',
        'typeFinanced',
        'userId',
      ],
    });
  }

  async findByUserId(userId: string): Promise<Partial<FinancingEntity>[]> {
    return await this.financingRepository.find({
      select: [
        'id',
        'amountFinanced',
        'amountOfTimes',
        'tax',
        'typeFinanced',
        'userId',
      ],
      where: { userId },
    });
  }

  async findOneOrFail(options: FindOneOptions<FinancingEntity>) {
    try {
      return await this.financingRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
