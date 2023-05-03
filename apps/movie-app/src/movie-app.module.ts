import { Module } from '@nestjs/common';
import { MovieModule } from "./movie/movie.module";
import { CommentModule } from './comment/comment.module';
import { PersonModule } from "./person/person.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { MoviePerson } from "./person/models/movie-person.model";
import { Person } from "./person/models/person.model";
import { Movie } from "./movie/models/movie.model";
import { Comment } from "./comment/models/comment.model";
import { Country } from "./movie/models/country.model";
import { MovieCountry } from "./movie/models/movie-country.model";
import { Fact } from "./movie/models/fact.model";
import { Genre } from "./movie/models/genre.model";
import { MovieGenre } from "./movie/models/movie-genre.model";
import { Language } from "./movie/models/language.model";
import { MovieLanguage } from "./movie/models/movie-language.model";
import { SimilarMovies } from "./movie/models/similar-movies.model";
import {SharedModule} from "@app/common/rmq/shared.module";
import {Profession} from "./person/models/profession.model";
import {PersonProfession} from "./person/models/person-profession.model";

@Module({
	imports: [
		SharedModule,
		SequelizeModule.forRoot({
			dialect: 'postgres',
			host: '195.133.147.66',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'movie',
			models: [
				Movie,
				Person,
				MoviePerson,
				Comment,
				Fact,
				Country,
				MovieCountry,
				Genre,
				MovieGenre,
				Language,
				MovieLanguage,
				SimilarMovies,
				Profession,
				PersonProfession
			],
			autoLoadModels: true,
		}),
		MovieModule,
		PersonModule,
		CommentModule]
})
export class MovieAppModule { }
