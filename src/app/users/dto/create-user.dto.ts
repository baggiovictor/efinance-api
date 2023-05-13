import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { RegExHelper } from '../../../helpers/regex.helper';
import { MessageHelper } from '../../../helpers/messages.helper';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password, {
    message: MessageHelper.PASSWORD_INVALID,
  })
  password: string;
}
