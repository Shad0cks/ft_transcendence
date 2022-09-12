import { Injectable } from '@nestjs/common';
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
  async createChannel(channelDTO: ChannelDTO): Promise<void> {
    const channel = new Channel();

    channel.name = channelDTO.name;
    channel.isPublic = channelDTO.isPublic;
    channel.password = await bcrypt.hash(channelDTO.password, 10);
    await this.channelRepository.save(channel);
  }
}
