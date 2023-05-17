import { GetCurrentUser, GetCurrentUserId } from "../../../libs/common/src/decorators";
import { Body, Controller, Get, HttpCode, Inject, Post, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { Tokens } from "../../../libs/common/src/types";
import { Observable, catchError, throwError } from "rxjs";
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../../user/src/dto/create-user.dto";
import { SignInDto } from "../../user/src/dto/signin.dto";
import { AtGuard, GoogleAuthGuard, RtGuard, VKAuthGuard } from "./guards";

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Авторизация через Google', description: 'Перенаправляет на страницу авторизации Google' })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @ApiOperation({ summary: 'Авторизация через Google', description: 'Обработка ответа от Google' })
  @ApiResponse({ status: 200, description: 'Токены доступа' })
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@GetCurrentUser() tokens: any) {
    return tokens;
  }

  @ApiOperation({ summary: 'Авторизация через VK', description: 'Перенаправляет на страницу авторизации VK' })
  @Get('vk/login')
  @UseGuards(VKAuthGuard)
  vkAuth() {}

  @ApiOperation({ summary: 'Авторизация через VK', description: 'Обработка ответа от VK' })
  @ApiResponse({ status: 200, description: 'Токены доступа' })
  @Get('vk/redirect')
  @UseGuards(VKAuthGuard)
  vkAuthRedirect(@GetCurrentUser() tokens: any) {
    return tokens;
  }

  @ApiOperation({ summary: 'Регистрация', description: 'Создаёт нового пользователя' })
  @ApiResponse({ status: 201, description: 'Токены доступа' })
  @ApiResponse({ status: 400, description: 'Ошибка при регистрации' })
  @Post('signup')
  signup(@Body() userDto: CreateUserDto): Observable<any> {
    return this.authClient.send('signup', userDto)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Авторизация', description: 'Авторизует пользователя' })
  @ApiResponse({ status: 200, description: 'Токены доступа' })
  @ApiResponse({ status: 403, description: 'Ошибка аутентификации' })
  @HttpCode(200)
  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authClient.send('signin', signInDto)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Выход', description: 'Удаляет токены доступа' })
  @ApiResponse({ status: 200, description: '' })
  @ApiResponse({ status: 403, description: 'Ошибка аутентификации' })
  @ApiHeader({ name: 'Authorization', description: 'accessToken' })
  @HttpCode(200)
  @Post('logout')
  @UseGuards(AtGuard)
  logout(@GetCurrentUserId() id: number) {
    return this.userClient.emit('logout', id)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Обновление токенов доступа', description: 'Обновляет токены доступа' })
  @ApiResponse({ status: 200, description: 'Токены доступа обновлены' })
  @ApiResponse({ status: 403, description: 'Ошибка аутентификации' })
  @ApiHeader({ name: 'Authorization', description: 'refreshToken' })
  @Post('refresh')
  @UseGuards(RtGuard)
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Observable<Tokens> {
    console.log(userId, refreshToken);
    return this.authClient.send('refresh', { userId, refreshToken })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }
}
