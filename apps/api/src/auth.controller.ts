import { GetCurrentUser, GetCurrentUserId } from "@app/common/decorators";
import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CreateUserDto } from "apps/user/src/dto/create-user.dto";
import { SignInDto } from "apps/user/src/dto/signin.dto";
import { AtGuard, RtGuard } from "./guards";
import { Tokens } from "@app/common/types";
import { Observable, catchError, throwError } from "rxjs";

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('signup')
  signup(@Body() userDto: CreateUserDto) {
    return this.authClient.send('signup', userDto)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authClient.send('signin', signInDto)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @Post('logout')
  @UseGuards(AtGuard)
  logout(@GetCurrentUserId() id: number) {
    return this.userClient.emit('logout', id)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));;
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Observable<Tokens> {
    return this.authClient.send('refresh', { userId, refreshToken })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));;
  }
}