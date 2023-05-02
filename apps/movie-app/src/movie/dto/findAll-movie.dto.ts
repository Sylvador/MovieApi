export class FindAllMovieDto {
  page?: number;
  movieId?: number;
  search?: string;
  name?: string;
  enName?: string;
  type?: string;
  rating?: number;
  votes?: number;
  premiere?: Date;
  ageRating?: number;
  countries?: string[];
  persons?: string[];
  genres?: string[];
}