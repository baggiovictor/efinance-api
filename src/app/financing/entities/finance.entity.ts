import { UsersEntity } from 'src/app/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'financing' })
export class FinancingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'amount_financed' })
  amountFinanced: number;

  @Column({ name: 'amount_of_times' })
  amountOfTimes: number;

  @Column()
  tax: number;

  @Column({ name: 'type_financed' })
  typeFinanced: string;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
