import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";

@Table({tableName: 'movie_country', createdAt: false, updatedAt: false})
export class SimilarMovies extends Model<SimilarMovies> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    movieId1: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    movieId2: number;
}