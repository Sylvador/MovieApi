import { Body, Controller, Get, HttpCode, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { AddCommentDto } from "./dto/add-comment.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { FindAllMovieDto } from "apps/movie-app/src/movie/dto/findAll-movie.dto";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Movie } from "apps/movie-app/src/movie/models/movie.model";

@ApiTags('Фильмы')
@Controller('movie')
export class MovieController {
  constructor(
    @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
  ) { }

  @ApiOperation({ summary: 'Поиск фильма', description: 'Находит фильм по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Фильм найден', type: Movie })
  @ApiResponse({ status: 404, description: 'Фильм не найден' })
  @ApiParam({ name: 'id', description: 'Идентификатор фильма', type: 'number' })
  @Get(':id')
  findOneMovie(@Param('id') id: number) {
    return this.movieClient.send('findOneMovie', id)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Поиск фильмов', description: 'Находит фильмы по заданным фильтрам' })
  @ApiResponse({ status: 200, description: 'Фильмы найдены', type: [Movie] })
  @ApiResponse({ status: 404, description: 'Фильмы не найдены' })
  @ApiQuery({ name: 'search', description: 'Строка поиска', required: false })
  @ApiBody({ type: FindAllMovieDto })
  @Get()
  findAllMovies(@Query('page') page: number, @Query('search') search: string, @Body('filters') filters: FindAllMovieDto) {
    filters.enName = search;
    filters.name = search;
    return this.movieClient.send('findAllMovies', { page, filters })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Добавить комментарий', description: 'Добавляет комментарий к фильму' })
  @ApiResponse({ status: 201, description: 'Комментарий добавлен' })
  @ApiResponse({ status: 400, description: 'Некорректный запрос' })
  @HttpCode(201)
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
