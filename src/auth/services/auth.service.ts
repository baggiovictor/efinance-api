import { Injectable } from '@nestjs/common';
import { UsersService } from '../../app/users/services/users.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(email: string, password: string) {
    let user;

    try {
      user = await this.userService.findOneOrFail({ where: { email } });
    } catch {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) return null;

    return user;
  }
}
