import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

export type ChannelRestrictionType = 'ban' | 'mute';

@Entity()
export class ChatRestriction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  punishedUser: User;

  @ManyToOne(() => User)
  adminUser: User;

  @ManyToOne(() => Channel)
  channel: Channel;

  @Column({
    type: 'enum',
    enum: ['ban', 'mute'],
  })
  restriction: ChannelRestrictionType;

  @Column({ type: 'timestamptz' })
  end_date: Date;
}
