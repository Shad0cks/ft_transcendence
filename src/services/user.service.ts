import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendDTO } from 'src/dto/friend.dto';
import { UserDTO, Usersocket } from 'src/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface UserOptions {
  selectFriends?: boolean;
  selectBlocked?: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(userDTO: UserDTO, login42: string): Promise<User> {
    const user = new User();

    user.nickname = userDTO.nickname;
    user.avatar = userDTO.avatar;
    user.twofa_enabled = userDTO.twofa_enabled;
    user.wins = userDTO.wins;
    user.losses = userDTO.losses;
    user.login42 = login42;
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate nickname
        throw new ConflictException('nickname already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async createUsersocket(
    nickname: string,
    socketid: string,
  ): Promise<Usersocket> {
    const usersocket = new Usersocket();

    usersocket.nickname = nickname;
    usersocket.socketid = socketid;

    return usersocket;
  }

  async findOneByNickname(
    nickname: string,
    options: UserOptions,
  ): Promise<User> {
    if (options === null) {
      options = {};
    }
    const user = await this.userRepository.find({
      where: {
        nickname: nickname,
      },
      relations: {
        friends:
          options.selectFriends === undefined ? false : options.selectFriends,
      },
      take: 1,
    });
    if (user.length === 0) {
      throw new NotFoundException('User not found');
    }
    return user[0];
  }

  async findOneByLogin42(login42: string): Promise<User> {
    const user = await this.userRepository.find({
      where: {
        login42: login42,
      },
      relations: {
        friends: true,
      },
      select: {
        nickname: true,
        login42: true,
        avatar: true,
        wins: true,
        losses: true,
        twofa_enabled: true,
      },
      take: 1,
    });
    if (user.length === 0) {
      throw new NotFoundException('User not found');
    }
    return user[0];
  }

  async editNickname(user: User, newNickname: string): Promise<User> {
    if (!newNickname) {
      throw new BadRequestException('Nickname is missing');
    }
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ nickname: newNickname })
        .where({
          login42: user.login42,
        })
        .returning('*')
        .execute();
      return result.raw[0];
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        // duplicate nickname
        throw new ConflictException('Nickname already exists');
      }
    }
  }

  async editAvatar(user: User, newAvatar: string): Promise<User> {
    if (!newAvatar) {
      throw new BadRequestException('Avatar is missing');
    }
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ avatar: newAvatar })
      .where({
        login42: user.login42,
      })
      .returning('*')
      .execute();
    return result.raw[0];
  }

  async edit2fa(user: User, enabled: boolean): Promise<void> {
    if (!enabled && enabled !== false) {
      throw new BadRequestException('enabled is missing');
    }
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ twofa_enabled: enabled })
      .where({
        login42: user.login42,
      })
      .returning('*')
      .execute();
    return result.raw[0];
  }

  async addFriend(user: User, friendDTO: FriendDTO): Promise<User> {
    if (user.nickname === friendDTO.nickname) {
      throw new BadRequestException("You can't add yourself as friend");
    }
    try {
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'friends')
        .of(user)
        .add(friendDTO.nickname);
      const friend = await this.findOneByNickname(friendDTO.nickname, null);
      return friend;
    } catch (error) {
      if (error.code === '23503') {
        // friend nickname is not in db
        throw new NotFoundException('Friend not found');
      }
      if (error.code === '23505') {
        // friend relation already exists
        throw new ConflictException('You are already friends');
      }
      throw error;
    }
  }

  async deleteFriend(user: User, friendDTO: FriendDTO) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'friends')
      .of(user)
      .remove(friendDTO.nickname);
  }
}
