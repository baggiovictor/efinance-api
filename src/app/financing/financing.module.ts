import { Module } from '@nestjs/common';
import { FinancingService } from './services/financing.service';
import { FinancingController } from './controllers/financing.controller';
import { FinancingEntity } from './entities/finance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelService } from './services/installments.service';
import { ParcelEntity } from './entities/parcel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinancingEntity, ParcelEntity])],
  providers: [FinancingService, ParcelService],
  controllers: [FinancingController],
})
export class FinancingModule {}
