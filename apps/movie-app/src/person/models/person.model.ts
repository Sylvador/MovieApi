import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, HasMany, Index, Model, Table } from 'sequelize-typescript';
import { Movie } from '../../movie/models/movie.model';
import { MoviePerson } from './movie-person.model';
import { PersonProfession } from './person-profession.model';
import { Profession } from './profession.model';

interface PersonCreationAttrs {
    personId: number;
    name: string;
    enName: string;
    photo: string;
}

@Table({ tableName: 'person', createdAt: false, updatedAt: false })
export class Person extends Model<Person, PersonCreationAttrs> {
    @ApiProperty({ description: 'Идентификатор персоны', type: 'integer', uniqueItems: true, example: 1 })
    @Column({ type: DataType.INTEGER, unique: true, primaryKey: true })
    personId: number;

    @ApiProperty({ description: 'Имя персоны', type: 'string', example: 'Том Хэнкс' })
    @Index
    @Column({ type: DataType.STRING })
    name: string;

    @ApiProperty({ description: 'Имя персоны на английском', type: 'string', example: 'Tom Hanks' })
    @Index
    @Column({ type: DataType.STRING })
    enName: string;

    @ApiProperty({ description: 'Ссылка на фото персоны', type: 'string', example: 'https://www.kinopoisk.ru/images/sm_actor/177.jpg' })
    @Column({ type: DataType.STRING })
    photo: string;

    @BelongsToMany(() => Profession, () => PersonProfession)
    professions: Profession[];
}
