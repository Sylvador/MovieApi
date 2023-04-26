import {Body, Controller, Get, Inject, Param, Post, Put, UseGuards} from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import {AddCommentDto} from "./dto/add-comment.dto";
import {UpdateMovieDto} from "./dto/update-movie.dto";

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

    @Get()
    findAllMovies() {
        return this.movieClient.send('findAllMovies', {})
            .pipe(catchError(err => throwError(() => new RpcException(err.response))));
    }

    @Put('/:id')
    updateMovie(@Param('id') id: number,
                @Body() dto: UpdateMovieDto) {
        return this.movieClient.send('updateMovie', {id, ...dto})
            .pipe(catchError(err => throwError(() => new RpcException(err.response))));
    }

    @Post(':id')
    // @UseGuards(AtGuard)
    addComment(@Param('id') id: number,
               @Body() dto: AddCommentDto) {
        return this.movieClient.send('addComment', {movieId: id, ...dto})
            .pipe(catchError(err => throwError(() => new RpcException(err.response))));
    }
}