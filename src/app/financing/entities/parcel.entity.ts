// parcel.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FinancingEntity } from './finance.entity';

@Entity()
export class ParcelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => FinancingEntity, (financing) => financing.amountOfTimes)
  @JoinColumn({ name: 'financing_id' })
  financing: FinancingEntity;

  @Column()
  parcelNumber: number;

  @Column()
  type: number;

  @Column()
  amortization: number;

  @Column()
  interest: number;

  @Column()
  installment: number;

  @Column()
  outstandingBalance: number;
}
