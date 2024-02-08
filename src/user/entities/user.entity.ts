import { AuthEntity } from "src/authenticate/entities/auth.entity";
import { CommonEntity } from "src/database/commonEntity";
import { StatusEntity } from "src/friends/entities/status.entity";
import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity extends CommonEntity<UserEntity> {
  @Column({ unique: true, nullable: true })
  email: string;


  @OneToOne((type) => AuthEntity, (auth) => auth.user)
  auth: AuthEntity;

  @ManyToMany((type) => StatusEntity, (connection) => connection.users)
  connections: StatusEntity[];
}
