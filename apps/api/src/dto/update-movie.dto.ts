import { ApiProperty } from "@nestjs/swagger";

export class UpdateMovieDto {
    @ApiProperty({ description: 'Название фильма', type: 'string', example: 'The Godfather' })
    name: string;
}
