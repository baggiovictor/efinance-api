// parcel.service.ts

import { Injectable } from '@nestjs/common';
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
      parcel.financing = financing; // Assign the corresponding financing to the parcel
      parcel.parcelNumber = i;
      parcel.type = i % 2 === 0 ? 2 : 1;
      parcel.amortization = amortization;
      parcel.interest = interest;
      parcel.installment = installment;
      parcel.outstandingBalance = outstandingBalance;

      parcels.push(parcel);

      outstandingBalance -= amortization;
    }

    // Save the parcels in the database
    await this.parcelRepository.save(parcels);

    return parcels;
  }
}
