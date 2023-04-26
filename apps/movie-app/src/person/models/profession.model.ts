import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Person} from "./person.model";
import {PersonProfession} from "./person-profession.model";

interface ProfessionCreationAttrs {
    name: string;
}

@Table({tableName: 'profession', createdAt: false, updatedAt: false})
export class Profession extends Model<Profession, ProfessionCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    professionId: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @BelongsToMany(() => Person, () => PersonProfession)
    persons: Person[];
}