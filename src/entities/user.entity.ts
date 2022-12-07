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

  @Column({ unique: true })
  nickname: string;

  @Column()
  twofa_enabled: boolean;

  @Column({ select: false })
  twofa_secret: string;

  @Column({ select: false, unique: true })
  login42: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User)
  @JoinTable()
  blocked: User[];

  @Column()
  avatar: string;

  @Column()
  wins: number;

  @Column()
  losses: number;
}
