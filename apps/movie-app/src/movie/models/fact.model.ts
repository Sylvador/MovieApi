import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";
interface FactCreationAttrs {
    movieId: number;
    value: string;
    type: string;
    spoiler: boolean;
}

@Table({tableName: 'fact', createdAt: false, updatedAt: false})
export class Fact extends Model<Fact, FactCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    factId: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    movieId: number;

    @Column({type: DataType.TEXT, allowNull: false})
    value: string;

    @Column({type: DataType.STRING, allowNull: false})
    type: string;

    @Column({type: DataType.BOOLEAN, allowNull: false})
    spoiler: boolean;
}