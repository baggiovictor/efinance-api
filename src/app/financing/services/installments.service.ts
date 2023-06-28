import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParcelEntity } from '../entities/parcel.entity';
import { FinancingEntity } from '../entities/finance.entity';

@Injectable()
export class ParcelService {
  constructor(
    @InjectRepository(ParcelEntity)
    private parcelRepository: Repository<ParcelEntity>,
  ) {}

  async createParcels(financing: FinancingEntity): Promise<ParcelEntity[]> {
    const parcels: ParcelEntity[] = [];

    const financedAmount = financing.amountFinanced;
    const numberOfTimes = financing.amountOfTimes;
    const annualRate = financing.tax / 100; // Convert rate to decimal
    const financingType = financing.typeFinanced;

    let outstandingBalance = financedAmount;

    for (let i = 1; i <= numberOfTimes; i++) {
      let amortization: number;
      let interest: number;
      let installment: number;

      if (financingType === 'SAC') {
        amortization = outstandingBalance / numberOfTimes;
        interest = outstandingBalance * (annualRate / 12);
        installment = amortization + interest;
      } else if (financingType === 'PRICE') {
        interest = (outstandingBalance * annualRate) / 12;
        installment =
          (financedAmount * (annualRate / 12)) /
          (1 - Math.pow(1 + annualRate / 12, -numberOfTimes));
        amortization = installment - interest;
      }

      const parcel: Partial<ParcelEntity> = {
        financing,
        parcelNumber: i,
        type: i % 2 === 0 ? 2 : 1,
        amortization,
        interest,
        installment,
        outstandingBalance,
      };

      parcels.push(parcel as any);

      outstandingBalance -= amortization;
    }

    await this.parcelRepository.save(parcels);

    return parcels;
  }

  async findAllByFinancingId(id: any): Promise<ParcelEntity[]> {
    const parcels = await this.parcelRepository.find({
      where: { financing: { id } },
      order: {
        parcelNumber: 'ASC',
      },
    });

    if (!parcels || parcels.length === 0) {
      throw new NotFoundException(
        'No parcels found for the specified financing',
      );
    }

    return parcels;
  }
}
