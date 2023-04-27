import { Body, Controller, Inject, Param, Patch, Put, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { AdminGuard } from "./guards/admin.guard";

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    @Inject('MOVIE_SERVICE') private readonly movieClient: ClientProxy,
  ) { }

  @Put('genre/:id')
  updateGenre(
    @Param('id') id: string,
    @Body('name') name: string
  ): void {
    this.movieClient.emit('update_genre', { id, name })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }

  @Patch('movie/:id')
  updateMovie(
    @Param('id') id: number,
    @Body('title') title: string,
  ): void {
    this.movieClient.emit('updateMovie', { id, title })
      .pipe(catchError(err => throwError(() => new RpcException(err.response))));
  }
}