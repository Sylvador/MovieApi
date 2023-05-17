import { ApiProperty } from "@nestjs/swagger";

export class UpdateMovieDto {
  @ApiProperty({ description: 'id Фильма', example: 435 })
  movieId: number;

  @ApiProperty({ description: 'Название филмьа', example: 'Зеленая миля' })
  name: string;

  @ApiProperty({ description: 'Название фильма на английском', example: 'Green Mile' })
  enName: string;
}
