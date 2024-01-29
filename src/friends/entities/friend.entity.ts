import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum FriendStatus {
  PENDING = 'pending',
  ACCEPT = 'accept',
  REJECT = 'reject',
}

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FriendStatus,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;

  @ManyToOne(() => User)
  user_id: User;
}
