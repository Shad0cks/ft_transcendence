import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
    user.twofa_enabled = false;
    user.wins = 0;
    user.losses = 0;
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate login42 or nickname
        throw new ConflictException('login42 or nickname already exists');
      } else if (error.code === '23502') {
        throw new BadRequestException('Avatar is missing');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findOne(id: string): Promise<UserDTO> {
    const user = await this.userRepository.findOneBy({
      id: parseInt(id),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async editNickname(id: string, nickname: string): Promise<void> {
    if (!nickname) {
      throw new BadRequestException('Nickname is missing');
    }
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update({
          nickname,
        })
        .where({
          id: id,
        })
        .returning('*')
        .execute();
      return result.raw[0];
    } catch (error) {
      if (error.code === '23505') {
        // duplicate nickname
        throw new ConflictException('Nickname already exists');
      }
    }
  }

  async editAvatar(id: string, avatar: string): Promise<void> {
    if (!avatar) {
      throw new BadRequestException('Avatar is missing');
    }
    await this.userRepository
      .createQueryBuilder()
      .update({
        avatar,
      })
      .where({
        id: id,
      })
      .returning('*')
      .execute();
  }

  async edit2fa(id: string, enabled: boolean): Promise<void> {
    if (!enabled && enabled !== false) {
      throw new BadRequestException('enabled is missing');
    }
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ twofa_enabled: enabled })
      .where({
        id: id,
      })
      .returning('*')
      .execute();
  }
}
