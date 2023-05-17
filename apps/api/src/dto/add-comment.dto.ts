import { ApiProperty } from "@nestjs/swagger";

export class AddCommentDto {
    @ApiProperty({ description: 'Текст комментария', type: 'string', example: 'Опять слили концовку' })
    value: string;

    @ApiProperty({ description: 'Идентификатор фильма', type: 'number', example: 123 })
    movieId: number;

    @ApiProperty({ description: 'Идентификатор родительского комментария', type: 'number', required: false, example: 123 })
    parentId?: number;
}
