import { IsNumber, IsString, IsIn } from 'class-validator';

export class CreateFinancingDto {
  @IsNumber()
  amountFinanced: number;

  @IsNumber()
  amountOfTimes: number;

  @IsNumber()
  tax: number;

  @IsString()
  @IsIn(['SAC', 'PRICE'])
  typeFinanced: string;
}
