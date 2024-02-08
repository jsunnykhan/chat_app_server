import { CommonEntity } from "src/database/commonEntity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

export enum FriendStatus {
  PENDING = "pending",
  ACCEPT = "accept",
  REJECT = "reject",
}

@Entity({ name: "status" })
export class StatusEntity extends CommonEntity<StatusEntity> {
  @Column({ type: "uuid" })
  initiator: string;

  @Column({
    type: "enum",
    enum: FriendStatus,
    default: FriendStatus.PENDING,
  })
  status: FriendStatus;

  @ManyToMany((type) => UserEntity, (user) => user.connections)
  @JoinTable()
  users: UserEntity[];
}
