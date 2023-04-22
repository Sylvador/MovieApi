import {Body, Controller, Get, Inject, Param, Post, Query} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { CreateUserDto } from "apps/user/src/dto/create-user.dto";
import { catchError, throwError } from "rxjs";

@Controller('person')
export class PersonController {
    constructor(
        @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
    ) {}

    @Get(':id')
    findOnePerson(@Param('id') id: number) {
        return this.movieClient.send('findOnePerson', id)
            .pipe(catchError(err => throwError(() => new RpcException(err.response))));
    }

    @Get()
    findAllPerson(@Query('search') search: string,
                  @Query('profession') profession: string) {
        return this.movieClient.send('findAllPerson', {search, profession})
            .pipe(catchError(err => throwError(() => new RpcException(err.response))));
    }
}