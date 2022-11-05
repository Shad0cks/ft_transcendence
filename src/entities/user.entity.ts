import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
