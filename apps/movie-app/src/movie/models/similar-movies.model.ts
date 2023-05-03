import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";

@Table({tableName: 'similar_movies', createdAt: false, updatedAt: false})
export class SimilarMovies extends Model<SimilarMovies> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, unique: false, onDelete: 'CASCADE'})
    movieId1: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, unique: false, onDelete: 'CASCADE'})
    movieId2: number;
    @BelongsTo(() => Movie, 'movieId2')
    movie2: Movie
}