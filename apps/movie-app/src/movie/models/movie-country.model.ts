import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";
import {Country} from "./country.model";

@Table({tableName: 'movie_country', createdAt: false, updatedAt: false})
export class MovieCountry extends Model<MovieCountry> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    movieId: number;

    @ForeignKey(() => Country)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    countryId: number;
}