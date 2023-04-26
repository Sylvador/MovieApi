import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Person} from "./person.model";
import {Profession} from "./profession.model";
import {MoviePerson} from "./movie-person.model";
import {Movie} from "../../movie/models/movie.model";

@Table({tableName: 'person_profession', createdAt: false, updatedAt: false})
export class PersonProfession extends Model<PersonProfession> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Person)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    personId: number;
    @BelongsTo(() => Person)
    person: Person;

    @ForeignKey(() => Profession)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    professionId: number;
    @BelongsTo(() => Profession)
    profession: Profession;

    @BelongsToMany(() => Movie, () => MoviePerson)
    movies: Movie[];
}