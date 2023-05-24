import { ApiProperty } from '@nestjs/swagger';

export class FindAllMovieDto {
  @ApiProperty({ description: 'Номер страницы для получения.', required: false })
  page?: number;

  @ApiProperty({ description: 'Идентификатор фильма для получения.', required: false})
  movieId?: number;

  @ApiProperty({ description: 'Строка поиска для фильтрации фильмов.', required: false})
  search?: string;

  @ApiProperty({ description: 'Тип фильма для фильтрации.', required: false})
  type?: string;

  @ApiProperty({ description: 'Минимальный рейтинг фильма для фильтрации.', required: false})
  rating?: number;

  @ApiProperty({ description: 'Минимальное количество голосов фильма для фильтрации.', required: false})
  votes?: number;

  @ApiProperty({ description: 'Дата премьеры фильма для фильтрации.', required: false})
  premiere?: Date;

  @ApiProperty({ description: 'Минимальный возрастной рейтинг фильма для фильтрации.', required: false})
  ageRating?: number;

  @ApiProperty({ type: [String], description: 'Массив названий стран для фильтрации фильмов.', required: false})
  countries?: string[];

  @ApiProperty({ description: 'Строка поиска для фильтрации фильмов по имени персоны. Имя должно быть полное', example: 'Леонардо Дикаприо', required: false})
  person?: string;

  @ApiProperty({ type: [String], description: 'Массив названий жанров для фильтрации фильмов.', required: false})
  genres?: string[];

  @ApiProperty({ description: 'Порядок сортировки по дате премьеры. Любое значение, кроме new, будет сортировать по возрастанию', example: 'new', required: false })
  sort?: string;
}
