import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelDTO } from 'src/dto/channel.dto';
import { Repository } from 'typeorm';
import { Channel } from '../entities/channel.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  async findAll(): Promise<Channel[]> {
    const allChannels = await this.channelRepository.find();
    return allChannels;
  }

  async createChannel(channelDTO: ChannelDTO): Promise<Channel> {
    const channel = new Channel();

    try {
      channel.name = channelDTO.name;
      channel.restriction = channelDTO.restriction;
      if (channelDTO.restriction === 'private') {
        channel.password = await bcrypt.hash(channelDTO.password, 10);
      } else {
        channel.password = '';
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
}
