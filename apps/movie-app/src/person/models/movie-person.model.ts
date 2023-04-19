import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Movie} from "../../movie/models/movie.model";
import {Person} from "./person.model";

interface MoviePersonCreationAttrs {
    profession: string;
}

@Table({tableName: 'movie_person', createdAt: false, updatedAt: false})
export class MoviePerson extends Model<MoviePerson, MoviePersonCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    movieId: number;

    @ForeignKey(() => Person)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    personId: number;

    @Column({type: DataType.STRING, allowNull: false})
    profession: string;
}