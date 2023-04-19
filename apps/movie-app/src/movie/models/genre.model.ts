import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";
import {MovieGenre} from "./movie-genre.model";

interface GenreCreationAttrs {
    name: string;
}

@Table({tableName: 'genre', createdAt: false, updatedAt: false})
export class Genre extends Model<Genre, GenreCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    genreId: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @BelongsToMany(() => Movie, () => MovieGenre)
    movies: Movie[];
}