import {Fact} from "../models/fact.model";
import {Comment} from "../../comment/models/comment.model";
import {Movie} from "../models/movie.model";
import {Person} from "../../person/models/person.model";
import {Country} from "../models/country.model";
import {Genre} from "../models/genre.model";
import {Language} from "../models/language.model";
import {FindAllMovieDto} from "./findAll-movie.dto";

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
    facts: Fact[];
    comments: Comment[];
    similarMovies: FindAllMovieDto[];
    persons: Person[];
    countries: Country[];
    genres: Genre[];
    languages: Language[];

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
        this.facts = movie.facts;
        this.comments = movie.comments;
        this.similarMovies = movie.similarMovies.map((simMovie) => new FindAllMovieDto(simMovie));
        this.persons = movie.persons;
        this.countries = movie.countries;
        this.genres = movie.genres;
        this.languages = movie.languages;
    }
}