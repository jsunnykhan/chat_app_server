import { Password } from 'src/authenticate/entities/password.entity';
import { Friend } from 'src/friends/entities/friend.entity';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CommonColum {
  @Column({ type: 'date', nullable: false, default: new Date() })
  created_at: string;
  @Column({ type: 'date', nullable: true })
  updated_at: string;
  @Column({ type: 'uuid', nullable: true })
  last_update: string;

  @Generated('uuid')
  @Column({ type: 'uuid' })
  uuid: string;
}
@Entity()
export class User extends CommonColum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  refresh: string;

  @OneToOne(() => Password, (password) => password.user_id, { cascade: true })
  @JoinColumn({ name: 'password', referencedColumnName: 'id' })
  password: Password;

  @OneToMany(() => Friend, (friend) => friend.user_id, { cascade: true })
  @JoinColumn({ name: 'friend_id', referencedColumnName: 'id' })
  friend: Friend[];
}
