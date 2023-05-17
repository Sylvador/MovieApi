import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody, ApiHeader } from "@nestjs/swagger";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { AdminGuard } from "./guards/admin.guard";

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
  @ApiHeader({ name: 'Authorization', description: 'accessToken' })
  @ApiBody({ type: UpdateGenreDto })
  @Patch('genre/:genreId')
  updateGenre(
    @Param('genreId') genreId: string,
    @Body('name') name: string
  ): void {
    this.movieClient.emit('updateGenre', { genreId, name })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Обновление фильма', description: 'Обновляет название фильма по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Фильм успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Ошибка при обновлении фильма' })
  @ApiHeader({ name: 'Authorization', description: 'accessToken' })
  @ApiParam({ name: 'movieId', description: 'Идентификатор фильма', type: 'number' })
  @ApiBody({ type: UpdateMovieDto })
  @Patch('movie/:movieId')
  updateMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body('name') name: string,
  ): void {
    this.movieClient.emit('updateMovie', { movieId, name })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }
}
