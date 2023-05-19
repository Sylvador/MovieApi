import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody, ApiHeader, ApiBearerAuth } from "@nestjs/swagger";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { AdminGuard } from "./guards/admin.guard";
import { UpdateMovieDto } from "apps/movie-app/src/movie/dto/update-movie.dto";

@ApiTags('Администрирование')
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
  ) { }

  @ApiOperation({ summary: 'Обновление жанра', description: 'Обновляет название жанра по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Жанр успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Ошибка при обновлении жанра' })
  @ApiParam({ name: 'genreId', description: 'Идентификатор жанра', type: 'string' })
  @ApiBody({ type: UpdateGenreDto })
  @ApiBearerAuth('jwt')
  @Patch('genre/:genreId')
  updateGenre(
    @Param('genreId') genreId: string,
    @Body() dto: UpdateGenreDto,
  ): void {
    this.movieClient.emit('updateGenre', { genreId, dto })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Обновление фильма', description: 'Обновляет название фильма по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Фильм успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Ошибка при обновлении фильма' })
  @ApiParam({ name: 'movieId', description: 'Идентификатор фильма', type: 'number' })
  @ApiBody({ type: UpdateMovieDto })
  @ApiBearerAuth('jwt')
  @Patch('movie/:movieId')
  updateMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() dto: UpdateMovieDto,
  ): void {
    this.movieClient.emit('updateMovie', { movieId, dto })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }
}
