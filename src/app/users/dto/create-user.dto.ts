import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { RegExHelper } from '../../../helpers/regex.helper';
import { MessageHelper } from '../../../helpers/messages.helper';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(RegExHelper.password, {
    message: MessageHelper.PASSWORD_INVALID,
  })
  password: string;
}
