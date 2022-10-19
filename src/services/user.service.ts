import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createUser(userDTO: UserDTO, login42: string): Promise<void> {
    const user = new User();

    user.login42 = login42;
    user.nickname = userDTO.nickname;
    user.avatar = userDTO.avatar;
    user.wins = 0;
    user.losses = 0;
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate login42
        throw new ConflictException('login42 already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
