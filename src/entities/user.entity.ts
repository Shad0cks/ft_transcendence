import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelMessage } from './channelMessage.entity';
import { ChannelParticipant } from './channelParticipant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ select: false })
  twofa_enabled: boolean;

  @Column({ unique: true })
  nickname: string;

  @Column({ select: false })
  login42: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @Column()
  avatar: string;

  @Column()
  wins: number;

  @Column()
  losses: number;

  @OneToMany(
    () => ChannelParticipant,
    (channelParticipant) => channelParticipant.user,
  )
  channelParticipants: ChannelParticipant[];

  @OneToMany(() => ChannelMessage, (channelMessage) => channelMessage.sender)
  channelMessages: ChannelMessage[];
}
