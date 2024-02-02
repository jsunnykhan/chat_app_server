import { UserEntity } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum FriendStatus {
  PENDING = "pending",
  ACCEPT = "accept",
  REJECT = "reject",
}

@Entity({ name: "status" })
export class StatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: FriendStatus,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany((type) => UserEntity, (user) => user.connections)
  @JoinTable()
  users: UserEntity[];
}
