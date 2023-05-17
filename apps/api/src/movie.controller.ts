import { Body, Controller, Get, HttpCode, Inject, Param, ParseArrayPipe, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { AddCommentDto } from "./dto/add-comment.dto";
import { FindAllMovieDto } from "../../movie-app/src/movie/dto/findAll-movie.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Movie } from "../../movie-app/src/movie/models/movie.model";
import { AtGuard } from "./guards";
import { GetCurrentUser } from "../../../libs/common/src/decorators";
@ApiTags('Фильмы')
@Controller('movie')
export class MovieController {
  constructor(
    @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
  ) { }

  @ApiOperation({ summary: 'Поиск фильма', description: 'Находит фильм по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Фильм найден', type: Movie })
  @ApiResponse({ status: 404, description: 'Фильм не найден' })
  @ApiParam({ name: 'movieId', description: 'Идентификатор фильма', type: 'number' })
  @Get('find-by-id/:movieId')
  findOneMovie(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.movieClient.send('findOneMovie', movieId)
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Получение актеров фильма', description: 'Находит всех актеров фильма по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Фильм найден', type: Movie })
  @ApiResponse({ status: 404, description: 'Фильм не найден' })
  @ApiParam({ name: 'movieId', description: 'Идентификатор фильма', type: 'number' })
  @Get(':movieId/persons')
  getMoviePersons(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.movieClient.send('getMoviePersons', movieId)
        .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Поиск фильмов', description: 'Находит фильмы по заданным фильтрам' })
  @ApiResponse({ status: 200, description: 'Фильмы найдены', type: [Movie] })
  @ApiResponse({ status: 404, description: 'Фильмы не найдены' })
  @ApiQuery({ name: 'search', description: 'Строка поиска', required: false })
  @ApiBody({ type: FindAllMovieDto, required: false })
  @Get()
  async findAllMovies(
    @Query() filters: FindAllMovieDto,
  ) {
    filters.genres = await new ParseArrayPipe({ items: String, separator: ' ', optional: true }).transform(filters.genres, { type: 'query', data: 'genres', metatype: String });
    filters.countries = await new ParseArrayPipe({ items: String, separator: ' ', optional: true }).transform(filters.countries, { type: 'query', data: 'countries', metatype: String });
    return this.movieClient.send('findAllMovie', { filters })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Добавить комментарий', description: 'Добавляет комментарий к фильму' })
  @ApiResponse({ status: 201, description: 'Комментарий добавлен' })
  @ApiResponse({ status: 400, description: 'Некорректный запрос' })
  @ApiParam({ name: 'movieId', description: 'Идентификатор фильма', type: 'number' })
  @ApiBody({ type: AddCommentDto })
  @ApiBearerAuth('jwt')
  @HttpCode(201)
  @Post('add-comment/:movieId')
  @UseGuards(AtGuard)
  addComment(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() dto: AddCommentDto,
    @GetCurrentUser('username') username: string,
  ) {
    return this.movieClient.send('addComment', { movieId, username, dto })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  
  @ApiOperation({ summary: 'Получить все жанры', description: 'Возвращает все жанры' })
  @ApiResponse({ status: 200, description: 'Жанры получены', type: [String] })
  @Get('genre')
  getAllGenres() {
    return this.movieClient.send('getAllGenres', {})
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Получить все страны', description: 'Возвращает все страны' })
  @ApiResponse({ status: 200, description: 'Страны получены', type: [String] })
  @Get('country')
  getAllCountries() {
    return this.movieClient.send('getAllCountries', {})
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }
}

