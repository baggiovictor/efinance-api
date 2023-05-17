import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FinancingEntity } from './finance.entity';

@Entity()
export class ParcelEntity {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => FinancingEntity, (financing) => financing.id)
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
