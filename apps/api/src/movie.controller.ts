import { Body, Controller, Get, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { AddCommentDto } from "./dto/add-comment.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { FindAllMovieDto } from "apps/movie-app/src/movie/dto/findAll-movie.dto";

@Controller('movie')
export class MovieController {
  constructor(
    @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
  ) { }

  @Get(':id')
  findOneMovie(@Param('id') id: number) {
    return this.movieClient.send('findOneMovie', id)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @Get()
  findAllMovies(@Query('page') page: number, @Body('filters') filters: FindAllMovieDto) {
    return this.movieClient.send('findAllMovies', { page, filters })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @Post(':id')
  // @UseGuards(AtGuard)
  addComment(
    @Param('id') id: number,
    @Body() dto: AddCommentDto,
  ) {
    return this.movieClient.send('addComment', { movieId: id, ...dto })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }
}