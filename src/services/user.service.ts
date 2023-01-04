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
import { PongMatch } from '../entities/pongMatch.entity';
import { ChannelParticipant } from 'src/entities/channelParticipant.entity';
import { BlockedDTO } from 'src/dto/blocked.dto';
import { RegisterPongMatchDTO } from 'src/dto/registerPongMatch.dto';

export interface UserOptions {
  selectFriends?: boolean;
  selectBlocked?: boolean;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ChannelParticipant)
    private channelParticipantsRepository: Repository<ChannelParticipant>,
    @InjectRepository(PongMatch)
    private matchRepository: Repository<PongMatch>,
  ) {}

  async createUser(userDTO: UserDTO, login42: string): Promise<User> {
    const user = new User();

    user.nickname = userDTO.nickname;
    user.avatar = userDTO.avatar;
    user.twofa_enabled = userDTO.twofa_enabled;
    user.twofa_secret = userDTO.twofa_secret;
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
        blocked:
          options.selectBlocked === undefined ? false : options.selectBlocked,
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
        id: true,
        nickname: true,
        login42: true,
        avatar: true,
        wins: true,
        losses: true,
        twofa_enabled: true,
        twofa_secret: true,
      },
      take: 1,
    });
    if (user.length === 0) {
      throw new NotFoundException('User not found');
    }
    return user[0];
  }

  async getChannels(nickname: string) {
    const userChannelParticipants = await this.channelParticipantsRepository
      .createQueryBuilder('channelParticipant')
      .leftJoinAndSelect('channelParticipant.user', 'user')
      .leftJoinAndSelect('channelParticipant.channel', 'channel')
      .where('user.nickname = :nickname', { nickname: nickname })
      .getMany();
    const channels = [];

    for (let i = 0; i < userChannelParticipants.length; ++i) {
      channels.push(userChannelParticipants[i].channel);
    }
    return channels;
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

  async edit2fa(user: User, enabled: boolean, secret: string) {
    if (!enabled && enabled !== false) {
      throw new BadRequestException('enabled is missing');
    }
    if (!secret) {
      throw new BadRequestException('Secret is missing');
    }
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ twofa_enabled: enabled, twofa_secret: secret })
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
      const friend = await this.findOneByNickname(friendDTO.nickname, null);
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'friends')
        .of(user)
        .add(friend);
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

  async registerPongMatch(
    registerPongMatchDTO: RegisterPongMatchDTO,
    Winner: string,
  ) {
    try {
      const match = new PongMatch();
      const user1 = await this.findOneByNickname(
        registerPongMatchDTO.user1Nickname,
        null,
      );
      const user2 = await this.findOneByNickname(
        registerPongMatchDTO.user2Nickname,
        null,
      );

      let Win: User;
      let Looser: User;

      if (registerPongMatchDTO.user1Nickname === Winner) {
        Win = user1;
        Looser = user2;
      } else {
        Win = user2;
        Looser = user1;
      }

      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ wins: Win.wins + 1 })
        .where({
          id: Win.id,
        })
        .returning('*')
        .execute();

      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ losses: Looser.losses + 1 })
        .where({
          id: Looser.id,
        })
        .returning('*')
        .execute();

      match.user1 = user1;
      match.user2 = user2;
      match.score1 = registerPongMatchDTO.user1Score;
      match.score2 = registerPongMatchDTO.user2Score;
      match.winner = Winner;
      await this.matchRepository.save(match);
    } catch (error) {
      return error;
    }
  }

  async getPongMatches(nickname: string) {
    const matches = this.matchRepository.find({
      relations: ['user1', 'user2'],
      where: [
        {
          user1: {
            nickname: nickname,
          },
        },
        {
          user2: {
            nickname: nickname,
          },
        },
      ],
      select: {
        score1: true,
        score2: true,
        user1: {
          nickname: true,
          avatar: true,
        },
        user2: {
          nickname: true,
          avatar: true,
        },
        winner: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
    return matches;
  }

  async deleteFriend(user: User, friendDTO: FriendDTO) {
    try {
      const friend = await this.findOneByNickname(friendDTO.nickname, null);
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'friends')
        .of(user)
        .remove(friend);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Friend not found');
      }
    }
  }

  async blockUser(user: User, blockedDTO: BlockedDTO): Promise<User> {
    if (user.nickname === blockedDTO.nickname) {
      throw new BadRequestException("You can't block yourself");
    }
    try {
      const blockedUser = await this.findOneByNickname(
        blockedDTO.nickname,
        null,
      );
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'blocked')
        .of(user)
        .add(blockedUser);
      return blockedUser;
    } catch (error) {
      if (error.code === '23503') {
        // friend nickname is not in db
        throw new NotFoundException('User not found');
      }
      if (error.code === '23505') {
        // friend relation already exists
        throw new ConflictException('You already blocked this user');
      }
      throw error;
    }
  }

  async unblockUser(user: User, blockedDTO: BlockedDTO) {
    try {
      const blockedUser = await this.findOneByNickname(
        blockedDTO.nickname,
        null,
      );
      await this.userRepository
        .createQueryBuilder()
        .relation(User, 'blocked')
        .of(user)
        .remove(blockedUser);
      return blockedUser;
    } catch (error) {
      return error;
    }
  }

  async getBlockedNicknames(nickname: string): Promise<string[]> {
    const blockedUsers = (
      await this.findOneByNickname(nickname, { selectBlocked: true })
    ).blocked;
    const blockedNicknames = [];

    for (let i = 0; i < blockedUsers.length; ++i) {
      blockedNicknames.push(blockedUsers[i].nickname);
    }
    return blockedNicknames;
  }

  async isIgnored(userNickname: string, otherUserNickname: string) {
    const blocklist = await this.getBlockedNicknames(userNickname);
    return blocklist.includes(otherUserNickname);
  }
}
