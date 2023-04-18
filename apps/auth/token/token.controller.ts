import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @MessagePattern('createToken')
  create(@Payload() createTokenDto: CreateTokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  @MessagePattern('findAllToken')
  findAll() {
    return this.tokenService.findAll();
  }

  @MessagePattern('findOneToken')
  findOne(@Payload() id: number) {
    return this.tokenService.findOne(id);
  }

  @MessagePattern('updateToken')
  update(@Payload() updateTokenDto: UpdateTokenDto) {
    return this.tokenService.update(updateTokenDto.id, updateTokenDto);
  }

  @MessagePattern('removeToken')
  remove(@Payload() id: number) {
    return this.tokenService.remove(id);
  }
}
