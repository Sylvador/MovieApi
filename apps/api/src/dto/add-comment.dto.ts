import { ApiProperty } from "@nestjs/swagger";

export class AddCommentDto {
    @ApiProperty({ description: 'Имя пользователя, оставившего комментарий', type: 'string', example: 'Вечно недовольный' })
    userName: string;

    @ApiProperty({ description: 'Дата публикации комментария', type: 'string', format: 'date-time', example: '2023-04-27T12:34:56Z' })
    publishDate: Date;

    @ApiProperty({ description: 'Текст комментария', type: 'string', example: 'Опять слили концовку' })
    value: string;

    @ApiProperty({ description: 'Идентификатор родительского комментария', type: 'number', required: false, example: 123 })
    parentId?: number;
}
