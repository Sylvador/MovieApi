import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {Movie} from "./movie.model";
import {MovieCountry} from "./movie-country.model";
interface CountryCreationAttrs {
    name: string;
}

@Table({tableName: 'country', createdAt: false, updatedAt: false})
export class Country extends Model<Country, CountryCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    countryId: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @BelongsToMany(() => Movie, () => MovieCountry)
    movies: Movie[];
}