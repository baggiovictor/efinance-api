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
    let amortization;
    let interest;
    let installment;

    for (let i = 1; i <= numberOfTimes; i++) {
      if (financingType === 'SAC') {
        amortization = financedAmount / numberOfTimes;
        interest = outstandingBalance * annualRate;
        installment = amortization + interest;
      } else if (financingType === 'PRICE') {
        const coefficient =
          (annualRate * Math.pow(1 + annualRate, numberOfTimes)) /
          (Math.pow(1 + annualRate, numberOfTimes) - 1);
        installment = financedAmount * coefficient;
        interest = outstandingBalance * annualRate;
        amortization = installment - interest;
      }

      const parcel = new ParcelEntity();
      parcel.financing = financing;
      parcel.parcelNumber = i;
      parcel.type = i % 2 === 0 ? 2 : 1;
      parcel.amortization = amortization;
      parcel.interest = interest;
      parcel.installment = installment;
      parcel.outstandingBalance = outstandingBalance;

      parcels.push(parcel);

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
