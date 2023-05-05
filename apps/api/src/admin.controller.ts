import { Body, Controller, Get, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from "@nestjs/swagger";
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
  @ApiParam({ name: 'id', description: 'Идентификатор жанра', type: 'string' })
  @ApiBody({ type: UpdateGenreDto })
  @Patch('genre/:id')
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
  @Patch('movie/:id')
  updateMovie(
    @Param('id') id: number,
    @Body('name') name: string,
  ): void {
    this.movieClient.emit('updateMovie', { id, name })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }
}
