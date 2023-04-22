import {Comment} from "../../comment/models/comment.model";
import {Movie} from "../models/movie.model";
import {PersonProfDto} from "./person-prof.dto";
import {CountryDto} from "./country.dto";
import {GenreDto} from "./genre.dto";
import {LanguageDto} from "./language.dto";
import {FactDto} from "./fact.dto";

export class FindOneMovieDto {
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
    facts: FactDto[];
    comments: Comment[];
    // similarMovies: FindAllMovieDto[];
    persons: PersonProfDto[];
    countries: CountryDto[];
    genres: GenreDto[];
    languages: LanguageDto[];

    constructor(movie: Movie) {
        this.movieId = movie.movieId;
        this.name = movie.name;
        this.enName = movie.enName;
        this.type = movie.type;
        this.rating = movie.rating;
        this.votes = movie.votes;
        this.movieLength = movie.movieLength;
        this.description = movie.description;
        this.premiere = movie.premiere;
        this.slogan = movie.slogan;
        this.shortDescription = movie.shortDescription;
        this.ageRating = movie.ageRating;
        this.poster = movie.poster;
        this.trailer = movie.trailer;
        this.facts = movie.facts.map((fact) => new FactDto(fact));
        this.comments = movie.comments;
        // this.similarMovies = movie.similarMovies.map((simMovie) => new FindAllMovieDto(simMovie));
        this.persons = movie.persons.map((person) => new PersonProfDto(person));
        this.countries = movie.countries.map((country) => new CountryDto(country));
        this.genres = movie.genres.map((genre) => new GenreDto(genre));
        this.languages = movie.languages.map((language) => new LanguageDto(language));
    }
}