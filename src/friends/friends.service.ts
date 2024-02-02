import { Injectable, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { CreateFriendDto } from "./dto/create-friend.dto";
import { ConfirmFriendDto } from "./dto/confirm-friend.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { Not, Repository } from "typeorm";
import { StatusEntity, FriendStatus } from "./entities/status.entity";
import { selectedUserOptions } from "src/user/dto/select";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StatusEntity) private readonly statusRepository: Repository<StatusEntity>,
  ) {}

  async getAllFriends(id: string) {
    const statuses = await this.statusRepository.find({
      where: { status: FriendStatus.PENDING, users: { uuid: id } },
    });
    if (!statuses) return;

    const response = await Promise.all(
      statuses.map(
        async (status: StatusEntity) =>
          (
            await this.statusRepository.findOne({
              where: { id: status.id, users: { uuid: Not(id) } },
              relations: ["users"],
            })
          ).users,
      ),
    );
    if (!response) return;
    return response.flat().map(({ uuid, email, provider }: UserEntity) => ({ uuid, email, provider }));
  }

  async sendRequest(id: string, createFriendDto: CreateFriendDto) {
    if (id === createFriendDto.id) throw new NotAcceptableException();
    const me = await this.userRepository.findOne({ where: { uuid: id } });
    const user2 = await this.userRepository.findOneBy({ uuid: createFriendDto.id });
    if (!me && !user2) throw new NotFoundException();

    // need to check is already connection has or no
    const status = new StatusEntity();
    status.status = FriendStatus.PENDING;
    status.users = [me, user2];
    return await this.statusRepository.save(status);
  }

  async getAllPendingRequest(id: string) {}

  async acceptRequest(confirmFriendDto: ConfirmFriendDto) {
    console.log(confirmFriendDto);
    return "This action adds a new friend";
  }
  async rejectRequest(rejectFriendDto: ConfirmFriendDto) {
    console.log(rejectFriendDto);
    return "This action adds a new friend";
  }
}
