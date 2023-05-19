import { ApiProperty } from "@nestjs/swagger";

export class UpdateMovieDto {
  // @ApiProperty({ description: 'id Фильма', type: 'number', example: 435 })
  // movieId: number;

  @ApiProperty({ description: 'Название филмьа', type: 'string', example: 'Зеленая миля' })
  name?: string;

  @ApiProperty({ description: 'Название фильма на английском', type: 'string', example: 'Green Mile' })
  enName?: string;
}
