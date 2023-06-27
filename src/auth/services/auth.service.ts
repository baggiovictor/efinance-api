import { Injectable } from '@nestjs/common';
import { UsersService } from '../../app/users/services/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user) {
    const payload = { sub: user.id, email: user.email };

    return {
      userId: payload.sub,
      token: this.jwtService.sign(payload),
    };
  }

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
