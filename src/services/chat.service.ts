import { ConflictException, Injectable } from '@nestjs/common';
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

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(ChannelParticipant)
    private channelParticipantRepository: Repository<ChannelParticipant>,
  ) {}

  async findAll(): Promise<Channel[]> {
    const allChannels = await this.channelRepository.find();
    return allChannels;
  }

  async createChannel(createChannelDTO: CreateChannelDTO): Promise<Channel> {
    const channel = new Channel();

    try {
      channel.name = createChannelDTO.channelName;
      channel.privacy = createChannelDTO.privacy;
      channel.password = '';
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

  async joinChannel(joinChannelDTO: JoinChannelDTO) {
    console.log('Joinning channel');
    console.info(joinChannelDTO);
  }

  async registerChannelMessage(channelMessageDTO: ChannelMessageDTO) {
    console.log('saving channel message in database:');
    console.info(channelMessageDTO);
  }
}
