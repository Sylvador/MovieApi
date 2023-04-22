import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Movie} from "../../movie/models/movie.model";
import {MoviePerson} from "./movie-person.model";

interface PersonCreationAttrs {
    personId: number;
    name: string;
    enName: string;
    photo: string;
}


@Table({tableName: 'person', createdAt: false, updatedAt: false})
export class Person extends Model<Person, PersonCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true})
    personId: number;

    @Column({type: DataType.STRING})
    name: string;

    @Column({type: DataType.STRING})
    enName: string;

    @Column({type: DataType.STRING})
    photo: string;

    @BelongsToMany(() => Movie, () => MoviePerson)
    movies: Movie[];
}
