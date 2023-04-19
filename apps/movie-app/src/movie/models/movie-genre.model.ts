import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";
import {Genre} from "./genre.model";

@Table({tableName: 'movie_genre', createdAt: false, updatedAt: false})
export class MovieGenre extends Model<MovieGenre> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    movieId: number;

    @ForeignKey(() => Genre)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    genreId: number;
}