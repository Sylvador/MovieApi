import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from "@nestjs/swagger";
import { UpdateGenreDto } from "./dto/update-genre.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";

@ApiTags('Администрирование')
@Controller('admin')
export class AdminController {
  constructor(
    @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
  ) { }

  @ApiOperation({ summary: 'Обновление жанра', description: 'Обновляет название жанра по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Жанр успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Ошибка при обновлении жанра' })
  @ApiParam({ name: 'id', description: 'Идентификатор жанра', type: 'string' })
  @ApiBody({ type: UpdateGenreDto })
  @Post('genre/:id')
  updateGenre(
    @Param('id') id: string,
    @Body('name') name: string
  ): void {
    this.movieClient.emit('updateGenre', { id, name })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @ApiOperation({ summary: 'Обновление фильма', description: 'Обновляет название фильма по его идентификатору' })
  @ApiResponse({ status: 200, description: 'Фильм успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Ошибка при обновлении фильма' })
  @ApiParam({ name: 'id', description: 'Идентификатор фильма', type: 'number' })
  @ApiBody({ type: UpdateMovieDto })
  @Post('movie/:id')
  updateMovie(
    @Param('id') id: number,
    @Body('title') title: string,
  ): void {
    this.movieClient.emit('updateMovie', { id, title })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }
}
