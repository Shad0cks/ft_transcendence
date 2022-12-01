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
    private channelMesssageRepository: Repository<ChannelMessage>,
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
    console.log('Restricting user');
    console.info(channelRestrictionDTO);
  }

  async addAdmin(channelAdminDTO: ChannelAdminDTO) {
    console.log('Adding admin to channel');
    console.info(channelAdminDTO);
  }

  async isAdmin(channelAdminDTO: ChannelAdminDTO): Promise<boolean> {
    console.log('Checking if user is admin in channel');
    console.info(channelAdminDTO);
    return false;
  }

  async removeFromWhitelist(editWhitelistDTO: EditWhitelistDTO) {
    console.log('Removing user from whitelist');
    console.info(editWhitelistDTO);
  }

  async addToWhitelist(editWhitelistDTO: EditWhitelistDTO) {
    console.log('Adding user to whitelist');
    console.info(editWhitelistDTO);
  }

  async getWhitelist(channelName: string): Promise<string[]> {
    console.log('Returning whitelist');
    console.info(channelName);
    return [];
  }

  async editChannelPassword(channelPasswordDTO: ChannelPasswordDTO) {
    console.log('Editing channel password');
    console.info(channelPasswordDTO);
  }

  async changeChannelPrivacy(channelPrivacyDTO: ChannelPrivacyDTO) {
    console.log('Changing channel privacy');
    console.info(channelPrivacyDTO);
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
        throw new NotFoundException('Channel not found');
      }
      if (error.code === '23505') {
        throw new ConflictException('You are already in this channel');
      }
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Wrong password');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Missing password');
      }
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

  // TODO
  // throw ForbiddenException if the user is banned or muted
  async assertNoRestrictions(participant: ChannelParticipant) {
    participant;
  }

  async registerChannelMessage(channelMessageDTO: ChannelMessageDTO) {
    try {
      const participant = await this.findParticipant(
        channelMessageDTO.senderNickname,
        channelMessageDTO.channelName,
      );
      await this.assertNoRestrictions(participant);
      const channelMessage = new ChannelMessage();
      const channel = await this.findChannelByName(
        channelMessageDTO.channelName,
        null,
      );

      channelMessage.channel = channel;
      channelMessage.sender = participant;
      channelMessage.message = channelMessageDTO.message;
      await this.channelMesssageRepository.save(channelMessage);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
