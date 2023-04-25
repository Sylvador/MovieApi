import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";
import {Language} from "./language.model";

@Table({tableName: 'movie_language', createdAt: false, updatedAt: false})
export class MovieLanguage extends Model<MovieLanguage> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    movieId: number;

    @ForeignKey(() => Language)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    languageId: number;
}