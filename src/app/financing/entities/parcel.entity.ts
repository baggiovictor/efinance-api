import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Generated,
} from 'typeorm';
import { FinancingEntity } from './finance.entity';

@Entity({ name: 'parcels', synchronize: true })
export class ParcelEntity {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  @Generated('uuid')
  id: string;

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
