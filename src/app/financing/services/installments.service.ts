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

  private createParcel(
    financing: FinancingEntity,
    parcelNumber: number,
    amortization: number,
    interest: number,
    installment: number,
    outstandingBalance: number,
  ): Partial<ParcelEntity> {
    return {
      financing,
      parcelNumber,
      type: parcelNumber % 2 === 0 ? 2 : 1,
      amortization,
      interest,
      installment,
      outstandingBalance,
    };
  }

  async calculateSAC(financing: FinancingEntity): Promise<ParcelEntity[]> {
    return this.calculateFinancing(
      financing,
      (outstandingBalance, annualRate, numberOfTimes, i) => {
        const amortization = outstandingBalance / numberOfTimes;
        const interest = (outstandingBalance * annualRate) / 12;
        const installment = amortization + interest;

        return this.createParcel(
          financing,
          i,
          amortization,
          interest,
          installment,
          outstandingBalance,
        );
      },
    );
  }

  async calculatePrice(financing: FinancingEntity): Promise<ParcelEntity[]> {
    return this.calculateFinancing(
      financing,
      (outstandingBalance, annualRate, numberOfTimes, i) => {
        const installment =
          (financing.amountFinanced * (annualRate / 12)) /
          (1 - Math.pow(1 + annualRate / 12, -numberOfTimes));
        const interest = (outstandingBalance * annualRate) / 12;
        const amortization = installment - interest;

        return this.createParcel(
          financing,
          i,
          amortization,
          interest,
          installment,
          outstandingBalance,
        );
      },
    );
  }

  private async calculateFinancing(
    financing: FinancingEntity,
    calculateParcelFn: (
      outstandingBalance: number,
      annualRate: number,
      numberOfTimes: number,
      i: number,
    ) => Partial<ParcelEntity>,
  ): Promise<ParcelEntity[]> {
    const parcels: Partial<ParcelEntity>[] = [];
    const financedAmount = financing.amountFinanced;
    const numberOfTimes = financing.amountOfTimes;
    const annualRate = financing.tax / 100;

    let outstandingBalance = financedAmount;

    for (let i = 1; i <= numberOfTimes; i++) {
      const parcel = calculateParcelFn(
        outstandingBalance,
        annualRate,
        numberOfTimes,
        i,
      );
      parcels.push(parcel);
      outstandingBalance -= parcel.amortization;
    }

    await this.parcelRepository.save(parcels as ParcelEntity[]);

    return parcels as ParcelEntity[];
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
