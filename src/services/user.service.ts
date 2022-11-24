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

  async findOneByLogin42(nickname: string): Promise<User> {
    const user = await this.userRepository.findOneBy({
      login42: nickname,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async editNickname(oldNickname: string, newNickname: string): Promise<void> {
    if (!newNickname) {
      throw new BadRequestException('Nickname is missing');
    }
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ nickname: newNickname })
        .where({
          nickname: oldNickname,
        })
        .returning('*')
        .execute();
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
      return result.raw[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === '23505') {
        // duplicate nickname
        throw new ConflictException('Nickname already exists');
      }
    }
  }

  async editAvatar(nickname: string, newAvatar: string): Promise<void> {
    if (!newAvatar) {
      throw new BadRequestException('Avatar is missing');
    }
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ avatar: newAvatar })
      .where({
        nickname: nickname,
      })
      .returning('*')
      .execute();
  }

  async edit2fa(nickname: string, enabled: boolean): Promise<void> {
    if (!enabled && enabled !== false) {
      throw new BadRequestException('enabled is missing');
    }
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ twofa_enabled: enabled })
      .where({
        nickname: nickname,
      })
      .returning('*')
      .execute();
  }

  async addFriend(userNickname: string, friendDTO: FriendDTO): Promise<User> {
    if (userNickname === friendDTO.nickname) {
      throw new BadRequestException("You can't add yourself as friend");
    }
    try {
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'friends')
        .of(userNickname)
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

  async deleteFriend(userNickname: string, friendDTO: FriendDTO) {
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'friends')
      .of(userNickname)
      .remove(friendDTO.nickname);
  }
}
