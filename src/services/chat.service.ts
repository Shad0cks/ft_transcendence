import { BadRequestException, Injectable } from '@nestjs/common';
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

  async createChannel(channelDTO: ChannelDTO): Promise<void> {
    const channel = new Channel();
    const restrictions = ['public', 'protected', 'private'];

    if (!restrictions.includes(channelDTO.restriction)) {
      throw new BadRequestException('Unknown restriction');
    }

    channel.name = channelDTO.name;
    channel.restriction = channelDTO.restriction;
    channel.password = await bcrypt.hash(channelDTO.password, 10);
    await this.channelRepository.save(channel);
  }
}
