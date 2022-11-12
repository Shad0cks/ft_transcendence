import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelMessage } from './channelMessage.entity';
import { ChatRestriction } from './chatRestriction.entity';
import { User } from './user.entity';

@Entity()
export class ChannelParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isAdmin: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.channelParticipants)
  channel: Channel;

  @OneToMany(() => ChatRestriction, (chatRestriction) => chatRestriction.user)
  chatRestrictionsIncurred: ChatRestriction[];

  @OneToMany(() => ChatRestriction, (chatRestriction) => chatRestriction.admin)
  chatRestrictionsDealt: ChatRestriction[];

  @OneToMany(() => ChannelMessage, (channelMessage) => channelMessage.sender)
  channelMessages: ChannelMessage[];
}
