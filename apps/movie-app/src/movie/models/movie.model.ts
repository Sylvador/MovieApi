import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Country} from "./country.model";
import {MovieCountry} from "./movie-country.model";
import {MovieGenre} from "./movie-genre.model";
import {Genre} from "./genre.model";
import {Language} from "./language.model";
import {MovieLanguage} from "./movie-language.model";
import {Fact} from "./fact.model";
import {Comment} from "../../comment/models/comment.model";
import {SimilarMovies} from "./similar-movies.model";
import {MoviePerson} from "../../person/models/movie-person.model";
import {PersonProfession} from "../../person/models/person-profession.model";

interface MovieCreationAttrs {
    movieId: number;
    name: string;
    enName: string;
    type: string;
    rating: number;
    votes: number;
    movieLength: number;
    description: string;
    premiere: Date;
    slogan: string;
    shortDescription: string;
    ageRating: number;
    poster: string;
    trailer: string;
}

@Table({tableName: 'movie', createdAt: false, updatedAt: false})
export class Movie extends Model<Movie, MovieCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true})
    movieId: number;

    @Column({type: DataType.STRING})
    name: string;

    @Column({type: DataType.STRING})
    enName: string;

    @Column({type: DataType.STRING})
    type: string;

    @Column({type: DataType.REAL})
    rating: number;

    @Column({type: DataType.INTEGER})
    votes: number;

    @Column({type: DataType.INTEGER})
    movieLength: number;

    @Column({type: DataType.TEXT})
    description: string;

    @Column({type: DataType.DATE})
    premiere: Date;

    @Column({type: DataType.TEXT})
    slogan: string;

    @Column({type: DataType.TEXT})
    shortDescription: string;

    @Column({type: DataType.INTEGER})
    ageRating: number;

    @Column({type: DataType.STRING})
    poster: string;

    @Column({type: DataType.STRING})
    trailer: string;

    @HasMany(() => Fact)
    facts: Fact[];

    @HasMany(() => Comment)
    comments: Comment[];

    @HasMany(() => SimilarMovies)
    similarMovies: SimilarMovies[];

    @BelongsToMany(() => PersonProfession, () => MoviePerson)
    persons: PersonProfession[];

    @BelongsToMany(() => Country, () => MovieCountry)
    countries: Country[];

    @BelongsToMany(() => Genre, () => MovieGenre)
    genres: Genre[];

    @BelongsToMany(() => Language, () => MovieLanguage)
    languages: Language[];
}
