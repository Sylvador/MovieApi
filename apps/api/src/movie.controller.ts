import { Body, Controller, Get, HttpCode, Inject, Param, ParseArrayPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { AddCommentDto } from "./dto/add-comment.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { FindAllMovieDto } from "../../movie-app/src/movie/dto/findAll-movie.dto";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Movie } from "../../movie-app/src/movie/models/movie.model";

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
  async findAllMovies(
    @Query() filters: FindAllMovieDto,
  ) {
    filters.genres = await new ParseArrayPipe({ items: String, separator: ' ', optional: true }).transform(filters.genres, { type: 'query', data: 'genres', metatype: String });
    filters.countries = await new ParseArrayPipe({ items: String, separator: ' ', optional: true }).transform(filters.countries, { type: 'query', data: 'countries', metatype: String });
    filters.persons = await new ParseArrayPipe({ items: String, separator: ' ', optional: true }).transform(filters.persons, { type: 'query', data: 'persons', metatype: String });
    return this.movieClient.send('findAllMovie', { filters })
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
