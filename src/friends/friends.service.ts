import { Injectable, NotFoundException, NotAcceptableException, HttpStatus, ConflictException } from "@nestjs/common";
import { CreateFriendDto } from "./dto/create-friend.dto";
import { ConfirmFriendDto } from "./dto/confirm-friend.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Not, Repository } from "typeorm";
import { StatusEntity, FriendStatus } from "./entities/status.entity";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(UserEntity) private readonly userEntity: Repository<UserEntity>,
    @InjectRepository(StatusEntity) private readonly statusEntity: Repository<StatusEntity>,
  ) {}

  async getAllFriends(id: string) {
    const statuses = await this.statusEntity.find({
      where: { status: FriendStatus.PENDING, users: { uuid: id } },
    });
    if (!statuses) return;

    const response = await Promise.all(
      statuses.map(
        async (status: StatusEntity) =>
          (
            await this.statusEntity.findOne({
              where: { id: status.id, users: { uuid: Not(id) } },
              relations: ["users"],
            })
          ).users,
      ),
    );
    if (!response) return;
    return response.flat().map(({ uuid, email }: UserEntity) => ({ uuid, email }));
  }

  async sendRequest(id: string, createFriendDto: CreateFriendDto) {
    try {
      if (id === createFriendDto.id) throw new NotAcceptableException();
      const isExists = await this.statusEntity.findOne({
        where: { users: { uuid: id && createFriendDto.id } },
        relations: ["users"],
      });
      if (isExists)
        throw new ConflictException(
          isExists.status === FriendStatus.ACCEPT ? "You already friend" : "You Already sent friend request",
        );
      const me = await this.userEntity.findOne({ where: { uuid: id } });
      const user2 = await this.userEntity.findOneBy({ uuid: createFriendDto.id });
      if (!me && !user2) throw new NotFoundException();
      // need to check is already connection has or no
      const statusE = new StatusEntity({ status: FriendStatus.PENDING, initiator: id, users: [me, user2] });
      const { uuid, status } = await this.statusEntity.save(statusE);
      return { uuid, status };
    } catch (error) {
      throw error;
    }
  }

  async getAllPendingRequest(id: string) {
    try {
      const pendingRequest = await this.statusEntity.find({
        where: { status: FriendStatus.PENDING, initiator: Not(id), users: { uuid: id } },
      });
      return pendingRequest;
    } catch (error) {
      throw error;
    }
  }

  async acceptRequest(confirmFriendDto: ConfirmFriendDto) {
    console.log(confirmFriendDto);
    return "This action adds a new friend";
  }
  async rejectRequest(rejectFriendDto: ConfirmFriendDto) {
    console.log(rejectFriendDto);
    return "This action adds a new friend";
  }
}
