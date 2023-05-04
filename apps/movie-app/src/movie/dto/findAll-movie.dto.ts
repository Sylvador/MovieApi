import { ApiProperty } from '@nestjs/swagger';

export class FindAllMovieDto {
  @ApiProperty({ description: 'Номер страницы для получения.' })
  page?: number;

  @ApiProperty({ description: 'Идентификатор фильма для получения.' })
  movieId?: number;

  @ApiProperty({ description: 'Строка поиска для фильтрации фильмов.' })
  search?: string;

  @ApiProperty({ description: 'Название фильма для фильтрации.' })
  name?: string;

  @ApiProperty({ description: 'Английское название фильма для фильтрации.' })
  enName?: string;

  @ApiProperty({ description: 'Тип фильма для фильтрации.' })
  type?: string;

  @ApiProperty({ description: 'Минимальный рейтинг фильма для фильтрации.' })
  rating?: number;

  @ApiProperty({ description: 'Минимальное количество голосов фильма для фильтрации.' })
  votes?: number;

  @ApiProperty({ description: 'Дата премьеры фильма для фильтрации.' })
  premiere?: Date;

  @ApiProperty({ description: 'Минимальный возрастной рейтинг фильма для фильтрации.' })
  ageRating?: number;

  @ApiProperty({ type: [String], description: 'Массив названий стран для фильтрации фильмов.' })
  countries?: string[];

  @ApiProperty({ description: 'Строка поиска для фильтрации фильмов по имени персоны. Имя должно быть полное', example: 'Леонардо Дикаприо' })
  person?: string;

  @ApiProperty({ type: [String], description: 'Массив названий жанров для фильтрации фильмов.' })
  genres?: string[];
}
