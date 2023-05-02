import { ApiProperty } from "@nestjs/swagger";

export class UpdateMovieDto {
    @ApiProperty({ description: 'Id фильма', type: 'number', example: 1 })
    id: number;

    @ApiProperty({ description: 'Название фильма', type: 'string', example: 'Крёстный Отец' })
    name: string;

    @ApiProperty({ description: 'Название фильма на английском', type: 'string', example: 'The Godfather' })
    enName: string;
}
