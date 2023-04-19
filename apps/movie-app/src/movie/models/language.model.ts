import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";
import {MovieGenre} from "./movie-genre.model";

interface LanguageCreationAttrs {
    name: string;
}

@Table({tableName: 'language', createdAt: false, updatedAt: false})
export class Language extends Model<Language, LanguageCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    languageId: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @BelongsToMany(() => Movie, () => MovieGenre)
    movies: Movie[];
}