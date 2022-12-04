import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChannelDTO } from 'src/dto/createChannel.dto';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import * as bcrypt from 'bcrypt';
import { ChannelMessageDTO } from 'src/dto/channelMessage.dto';
import { ChannelParticipant } from 'src/entities/channelParticipant.entity';
import { JoinChannelDTO } from 'src/dto/joinChannel.dto';
import { ChannelPrivacyDTO } from 'src/dto/channelPrivacy.dto';
import { ChannelPasswordDTO } from 'src/dto/channelPassword.dto';
import { EditWhitelistDTO } from 'src/dto/editWhitelist.dto';
import { ChannelAdminDTO } from 'src/dto/channelAdmin.dto';
import { ChannelRestrictionDTO } from 'src/dto/channelRestriction.dto';
import { UserService } from './user.service';
import { ChannelMessage } from 'src/entities/channelMessage.entity';
import { User } from 'src/entities/user.entity';
import {
  ChatRestriction,
  ChannelRestrictionType,
} from 'src/entities/chatRestriction.entity';
import { LeaveChannelDTO } from 'src/dto/leaveChannel.dto';
import { WsException } from '@nestjs/websockets';
import { DirectMessage } from 'src/entities/directMessage.entity';
import { DirectMessageDTO } from 'src/dto/directMessage.dto';

export interface ChannelOptions {
  selectParticipants?: boolean;
  selectMessages?: boolean;
  selectPassword?: boolean;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(ChannelParticipant)
    private channelParticipantRepository: Repository<ChannelParticipant>,
    @InjectRepository(ChannelMessage)
    private channelMessageRepository: Repository<ChannelMessage>,
    @InjectRepository(DirectMessage)
    private directMessageRepository: Repository<DirectMessage>,
    @InjectRepository(ChatRestriction)
    private chatRestrictionRepository: Repository<ChatRestriction>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<Channel[]> {
    const allChannels = await this.channelRepository.find();
    return allChannels;
  }

  async findChannelByName(
    channelName: string,
    options: ChannelOptions,
  ): Promise<Channel> {
    if (options === null) {
      options = {};
    }
    const relations = [];
    if (options.selectParticipants) {
      relations.push('participants.user');
    }
    if (options.selectMessages) {
      relations.push('messages');
    }
    const channel = await this.channelRepository.find({
      where: {
        name: channelName,
      },
      relations: relations,
      select: {
        id: true,
        name: true,
        privacy: true,
        whitelist: true,
        password:
          options.selectPassword === undefined ? false : options.selectPassword,
      },
      take: 1,
    });
    if (channel.length === 0) {
      throw new NotFoundException('Channel not found');
    }
    return channel[0];
  }

  async createChannel(createChannelDTO: CreateChannelDTO): Promise<Channel> {
    const channel = new Channel();

    try {
      channel.name = createChannelDTO.channelName;
      channel.privacy = createChannelDTO.privacy;
      channel.password = '';
      channel.whitelist = [];
      if (createChannelDTO.privacy === 'protected') {
        channel.password = await bcrypt.hash(createChannelDTO.password, 10);
      }
      const result = await this.channelRepository.save(channel);
      delete result.password;
      return result;
    } catch (error) {
      if (error.code === '23505') {
        // duplicate nickname
        throw new ConflictException('Channel name already exists');
      }
    }
  }

  async getParticipantsNickname(channelName: string): Promise<string[]> {
    const result = [];
    const channel = await this.findChannelByName(channelName, {
      selectParticipants: true,
    });
    const participants = channel.participants;

    for (let i = 0; i < participants.length; ++i) {
      result.push(participants[i].user.nickname);
    }
    return result;
  }

  async addRestriction(channelRestrictionDTO: ChannelRestrictionDTO) {
    try {
      const restriction = new ChatRestriction();

      // verify admin is in channel and admin
      const adminParticipant = await this.findParticipant(
        channelRestrictionDTO.adminNickname,
        channelRestrictionDTO.channelName,
      );
      restriction.admin = adminParticipant;

      restriction.end_date = channelRestrictionDTO.end;

      if (channelRestrictionDTO.restriction as ChannelRestrictionType)
        restriction.restriction =
          channelRestrictionDTO.restriction as ChannelRestrictionType;
      else throw new UnauthorizedException('Not valide restriction type');

      // verify user is in channel
      const userParticipant = await this.findParticipant(
        channelRestrictionDTO.userNickname,
        channelRestrictionDTO.channelName,
      );
      restriction.user = userParticipant;

      await this.chatRestrictionRepository.save(restriction);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async addAdmin(channelAdminDTO: ChannelAdminDTO) {
    try {
      // try get user in channel
      const participant = await this.findParticipant(
        channelAdminDTO.userNickname,
        channelAdminDTO.channelName,
      );
      // set admin
      participant.isAdmin = true;

      // save
      await this.channelParticipantRepository.save(participant);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async isAdmin(channelAdminDTO: ChannelAdminDTO): Promise<boolean> {
    try {
      // try get user in channel
      const participant = await this.findParticipant(
        channelAdminDTO.userNickname,
        channelAdminDTO.channelName,
      );

      // retrun isAdmin stat
      return participant.isAdmin;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async removeFromWhitelist(editWhitelistDTO: EditWhitelistDTO) {
    try {
      // channel exist
      const channel = await this.findChannelByName(
        editWhitelistDTO.channelName,
        {},
      );

      // user in whitelist
      const user = await this.isWhitelist(
        editWhitelistDTO.channelName,
        editWhitelistDTO.userNickname,
      );

      // remove from
      const index = channel.whitelist.indexOf(user, 0);
      if (index > -1) channel.whitelist.splice(index, 1);

      await this.channelRepository.save(channel);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async addToWhitelist(editWhitelistDTO: EditWhitelistDTO) {
    try {
      // channel exist
      const channel = await this.findChannelByName(
        editWhitelistDTO.channelName,
        {},
      );

      // add to
      channel.whitelist.push(editWhitelistDTO.userNickname);

      await this.channelRepository.save(channel);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async getWhitelist(channelName: string): Promise<string[]> {
    try {
      const channel = await this.findChannelByName(channelName, {});

      return channel.whitelist;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }

  async isWhitelist(channelName: string, userlogin: string) {
    if (!userlogin) {
      throw new BadRequestException('Missing user name');
    }
    const channel = await this.findChannelByName(channelName, {});
    const user = channel.whitelist.find((element) => element === userlogin);
    if (!user) {
      throw new UnauthorizedException('Not whitelisted');
    }
    return user;
  }

  async editChannelPassword(channelPasswordDTO: ChannelPasswordDTO) {
    try {
      // channel exist
      const channel = await this.findChannelByName(channelPasswordDTO.channel, {
        selectPassword: true,
      });

      // set new password
      channel.password = await bcrypt.hash(channelPasswordDTO.password, 10);

      // save
      await this.channelRepository.save(channel);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async changeChannelPrivacy(channelPrivacyDTO: ChannelPrivacyDTO) {
    try {
      // channel exist
      const channel = await this.findChannelByName(channelPrivacyDTO.name, {
        selectPassword: true,
      });

      // set new privacy and password if protected
      channel.privacy = channelPrivacyDTO.privacy;
      if (channelPrivacyDTO.privacy === 'protected')
        channel.password = await bcrypt.hash(channelPrivacyDTO.password, 10);

      // save
      await this.channelRepository.save(channel);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async checkPassword(clear: string, hash: string) {
    if (!clear) {
      throw new BadRequestException('Missing password');
    }
    const authorized = await bcrypt.compare(clear, hash);
    if (!authorized) {
      throw new UnauthorizedException('Wrong password');
    }
  }

  async joinChannel(joinChannelDTO: JoinChannelDTO) {
    try {
      const participant = new ChannelParticipant();
      const channel = await this.findChannelByName(joinChannelDTO.channelName, {
        selectPassword: true,
      });

      // password check
      if (channel.privacy === 'protected') {
        await this.checkPassword(joinChannelDTO.password, channel.password);
      }
      // whitelist check
      if (channel.privacy === 'private') {
        await this.isWhitelist(
          joinChannelDTO.channelName,
          participant.user.nickname,
        );
      }

      // populate participant object
      participant.channel = channel;
      participant.user = await this.userService.findOneByNickname(
        joinChannelDTO.userNickname,
        null,
      );
      participant.isAdmin = joinChannelDTO.isAdmin;

      // save
      await this.channelParticipantRepository.save(participant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new WsException('Channel not found');
      }
      if (error.code === '23505') {
        throw new WsException('You are already in this channel');
      }
      if (error instanceof UnauthorizedException) {
        throw new WsException('Wrong password');
      }
      if (error instanceof BadRequestException) {
        throw new WsException('Missing password');
      }
    }
  }

  async leaveChannel(leaveChannelDTO: LeaveChannelDTO) {
    try {
      const participant = await this.findParticipant(
        leaveChannelDTO.userNickname,
        leaveChannelDTO.channelName,
      );
      await this.channelParticipantRepository.remove(participant);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async findParticipant(userNickname: string, channelName: string) {
    try {
      const channel = await this.findChannelByName(channelName, {
        selectParticipants: true,
      });
      const participant = channel.participants.find(
        (element) => element.user.nickname === userNickname,
      );

      if (participant == undefined) {
        throw new UnauthorizedException();
      }

      delete channel.participants;
      participant.channel = channel;
      return participant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('You are not in this channel');
      }
    }
  }

  async getActiveRestrictions(participant: ChannelParticipant) {
    const nowDate = new Date();
    const nowTimestamp = nowDate.toISOString();

    const restrictions = await this.chatRestrictionRepository
      .createQueryBuilder('chatRestriction')
      .leftJoinAndSelect('chatRestriction.user', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .where('user.nickname = :nickname', {
        nickname: participant.user.nickname,
      })
      .andWhere('end_date > :now', { now: nowTimestamp })
      .getMany();
    return restrictions;
  }

  isBanned(restrictions: ChatRestriction[]) {
    const found = restrictions.find((element) => element.restriction === 'ban');

    return found != undefined;
  }

  isMuted(restrictions: ChatRestriction[]) {
    const found = restrictions.find(
      (element) => element.restriction === 'mute',
    );

    return found != undefined;
  }

  async registerChannelMessage(channelMessageDTO: ChannelMessageDTO) {
    try {
      const participant = await this.findParticipant(
        channelMessageDTO.senderNickname,
        channelMessageDTO.channelName,
      );
      const restrictions = await this.getActiveRestrictions(participant);
      if (this.isBanned(restrictions)) {
        throw new ForbiddenException('You are banned');
      }
      if (this.isMuted(restrictions)) {
        throw new ForbiddenException('You are muted');
      }
      const channelMessage = new ChannelMessage();
      const channel = await this.findChannelByName(
        channelMessageDTO.channelName,
        null,
      );

      channelMessage.channel = channel;
      channelMessage.sender = participant.user;
      channelMessage.message = channelMessageDTO.message;
      return await this.channelMessageRepository.save(channelMessage);
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  async registerDirectMessage(directMessageDTO: DirectMessageDTO) {
    try {
      const message = new DirectMessage();
      const sender = await this.userService.findOneByNickname(
        directMessageDTO.senderNickname,
        null,
      );
      const receiver = await this.userService.findOneByNickname(
        directMessageDTO.receiverNickname,
        null,
      );

      message.message = directMessageDTO.message;
      message.sender = sender;
      message.receiver = receiver;
      return await this.directMessageRepository.save(message);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }

  async getChannelMessages(user: User, channelName: string) {
    try {
      const participant = await this.findParticipant(
        user.nickname,
        channelName,
      );
      const restrictions = await this.getActiveRestrictions(participant);
      if (this.isBanned(restrictions)) {
        throw new ForbiddenException('You are banned');
      }
      const rawMessages = await this.channelMessageRepository.find({
        relations: ['sender'],
        where: {
          channel: {
            name: channelName,
          },
        },
        select: {
          sent_at: true,
          message: true,
        },
        order: {
          sent_at: 'ASC',
        },
      });
      const messages = [];
      for (let i = 0; i < rawMessages.length; ++i) {
        messages.push({
          sent_at: rawMessages[i].sent_at,
          message: rawMessages[i].message,
          author: rawMessages[i].sender.nickname,
        });
      }
      return messages;
    } catch (error) {
      throw new WsException(error.message);
    }
  }

  findInterlocutor(message: DirectMessage, nickname: string): string {
    const senderNickname = message.sender.nickname;
    const receiverNickname = message.receiver.nickname;
    if (senderNickname === receiverNickname) {
      return senderNickname;
    }
    if (senderNickname !== nickname) {
      return senderNickname;
    }
    return receiverNickname;
  }

  async getDirectMessages(user: User) {
    const rawMessages = await this.directMessageRepository.find({
      relations: ['sender', 'receiver'],
      where: [
        {
          receiver: {
            nickname: user.nickname,
          },
        },
        {
          sender: {
            nickname: user.nickname,
          },
        },
      ],
      select: {
        message: true,
        sent_at: true,
        sender: {
          nickname: true,
        },
        receiver: {
          nickname: true,
        },
      },
      order: {
        sent_at: 'ASC',
      },
    });
    const result = new Map();
    for (let i = 0; i < rawMessages.length; ++i) {
      const interlocutor = this.findInterlocutor(rawMessages[i], user.nickname);
      const isNewConversation = result[interlocutor] === undefined;
      const isIgnored = await this.userService.isIgnored(
        user.nickname,
        interlocutor,
      );
      if (isIgnored) {
        continue;
      }
      if (isNewConversation) {
        result[interlocutor] = {};
        result[interlocutor].messages = [];
      }
      result[interlocutor].messages.push({
        author: rawMessages[i].sender.nickname,
        sent_at: rawMessages[i].sent_at,
        message: rawMessages[i].message,
      });
    }
    return result;
  }

  async getChannelAdminsNicknames(user: User, channelName: string) {
    try {
      // assert that the channel exists
      // and the user is in it
      await this.findParticipant(user.nickname, channelName);
      const rawAdmins = await this.channelParticipantRepository.find({
        where: {
          channel: {
            name: channelName,
          },
          isAdmin: true,
        },
        relations: ['user'],
        select: {
          user: {
            nickname: true,
          },
        },
      });
      const admins = [];
      for (let i = 0; i < rawAdmins.length; ++i) {
        admins.push({
          nickname: rawAdmins[i].user.nickname,
        });
      }
      return admins;
    } catch (error) {
      return error;
    }
  }
}
