import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    ) { }

  @MessagePattern('get_user_by_id')
  getUserById(@Payload() id: number) {
    return this.userService.getUserById(id);
  }

  @MessagePattern('get_user_by_email')
  getUserByEmail(@Payload() email: string) {
    return this.userService.getUserByEmail(email);
  }

  @MessagePattern('createUser')
  createUser(@Payload() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @EventPattern('logout')
  async logout(@Payload() id: number): Promise<void> {
    this.userService.logout(id);
  }

  @EventPattern('updateRtHash')
  async updateRtHash(@Payload() payload: { userId: number; hashedRt: string }): Promise<void> {
    this.userService.updateRtHash(payload.userId, payload.hashedRt);
  }
}

