import {Body, Controller, Get, Inject, Param, Post} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CreateUserDto } from "apps/user/src/dto/create-user.dto";
import { catchError, throwError } from "rxjs";

@Controller('movie')
export class MovieController {
    constructor(
        @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
    ) {}

    @Get(':id')
    findOneMovie(@Param('id') id: number) {
        return this.movieClient.send('findOneMovie', id)
            .pipe(catchError(err => throwError(() => new RpcException(err.response))));
    }
}