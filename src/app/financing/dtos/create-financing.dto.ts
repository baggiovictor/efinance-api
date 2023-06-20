import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsIn, IsOptional } from 'class-validator';

export class CreateFinancingDto {
  @ApiProperty()
  @IsNumber()
  amountFinanced: number;

  @ApiProperty()
  @IsNumber()
  amountOfTimes: number;

  @ApiProperty()
  @IsNumber()
  tax: number;

  @ApiProperty()
  @IsString()
  @IsIn(['SAC', 'PRICE'])
  typeFinanced: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: string;
}
