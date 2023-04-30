import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Country } from './country.model';
import { MovieCountry } from './movie-country.model';
import { MovieGenre } from './movie-genre.model';
import { Genre } from './genre.model';
import { Language } from './language.model';
import { MovieLanguage } from './movie-language.model';
import { Fact } from './fact.model';
import { Comment } from '../../comment/models/comment.model';
import { SimilarMovies } from './similar-movies.model';
import { MoviePerson } from '../../person/models/movie-person.model';
import { PersonProfession } from '../../person/models/person-profession.model';

interface MovieCreationAttrs {
    movieId: number;
    name: string;
    enName: string;
    type: string;
    rating: number;
    votes: number;
    movieLength: number;
    description: string;
    premiere: Date;
    slogan: string;
    shortDescription: string;
    ageRating: number;
    poster: string;
    trailer: string;
}

@Table({ tableName: 'movie', createdAt: false, updatedAt: false })
export class Movie extends Model<Movie, MovieCreationAttrs> {
    @ApiProperty({ description: 'Идентификатор фильма', type: 'integer', uniqueItems: true, example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true })
    movieId: number;

    @ApiProperty({ description: 'Название фильма', type: 'string', example: 'Зеленая миля' })
    @Column({ type: DataType.STRING })
    name: string;

    @ApiProperty({ description: 'Английское название фильма', type: 'string', example: 'The Green Mile' })
    @Column({ type: DataType.STRING })
    enName: string;

    @ApiProperty({ description: 'Тип фильма', type: 'string', example: 'драма' })
    @Column({ type: DataType.STRING })
    type: string;

    @ApiProperty({ description: 'Рейтинг фильма', type: 'number', example: 8.6 })
    @Column({ type: DataType.REAL })
    rating: number;

    @ApiProperty({ description: 'Количество голосов за фильм', type: 'integer', example: 123456 })
    @Column({ type: DataType.INTEGER })
    votes: number;

    @ApiProperty({ description: 'Продолжительность фильма в минутах', type: 'integer', example: 189 })
    @Column({ type: DataType.INTEGER })
    movieLength: number;

    @ApiProperty({ description: 'Описание фильма', type: 'string', example: 'Пол Эджкомб работает на исполнении смертных приговоров в тюрьме Колорадо. Он сталкивается с множеством проблем, но самой сложной оказывается задача помочь заключенному Джону Коффи.' })
    @Column({ type: DataType.TEXT })
    description: string;

    @ApiProperty({ description: 'Дата премьеры фильма', type: 'string', format: 'date-time', example: '1999-12-06T00:00:00.000Z' })
    @Column({ type: DataType.DATE })
    premiere: Date;

    @ApiProperty({ description: 'Слоган фильма', type: 'string', example: 'Miracles do happen.' })
    @Column({ type: DataType.TEXT })
    slogan: string;

    @ApiProperty({ description: 'Краткое описание фильма', type: 'string', example: 'История о том, как один человек может изменить жизнь многих.' })
    @Column({ type: DataType.TEXT })
    shortDescription: string;

    @ApiProperty({ description: 'Возрастной рейтинг фильма', type: 'integer', example: 16 })
    @Column({ type: DataType.INTEGER })
    ageRating: number;

    @ApiProperty({ description: 'Ссылка на постер фильма', type: 'string', example: 'https://www.kinopoisk.ru/images/film_big/435.jpg' })
    @Column({ type: DataType.STRING })
    poster: string;

    @ApiProperty({ description: 'Ссылка на трейлер фильма', type: 'string', example: 'https://www.youtube.com/watch?v=Ki4haFrqSrw' })
    @Column({ type: DataType.STRING })
    trailer: string;

    @HasMany(() => Fact)
    facts: Fact[];

    @HasMany(() => Comment)
    comments: Comment[];

    @HasMany(() => SimilarMovies)
    similarMovies: SimilarMovies[];

    @BelongsToMany(() => PersonProfession, () => MoviePerson)
    persons: PersonProfession[];

    @BelongsToMany(() => Country, () => MovieCountry)
    countries: Country[];

    @BelongsToMany(() => Genre, () => MovieGenre)
    genres: Genre[];

    @BelongsToMany(() => Language, () => MovieLanguage)
    languages: Language[];
}
