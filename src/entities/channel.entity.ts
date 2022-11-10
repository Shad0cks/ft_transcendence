import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type ChannelRestrictionType = 'public' | 'protected' | 'private';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: ['public', 'protected', 'private'],
    default: 'public',
  })
  restriction: ChannelRestrictionType;

  @Column({ select: false })
  password: string;
}
