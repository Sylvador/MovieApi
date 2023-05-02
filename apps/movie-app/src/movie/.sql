SELECT "Movie".*, "genres"."genreId" AS "genres.genreId", "genres"."name" AS "genres.name" 
FROM (
  SELECT "Movie"."movieId", "Movie"."name", "Movie"."enName", "Movie"."type", "Movie"."rating", "Movie"."votes", "Movie"."movieLength", "Movie"."description", "Movie"."premiere", "Movie"."slogan", "Movie"."shortDescription", "Movie"."ageRating", "Movie"."poster", "Movie"."trailer" 
  FROM "movie" AS "Movie" 
  LEFT OUTER JOIN "movie_genre" AS "genres->MovieGenre" ON "Movie"."movieId" = "genres->MovieGenre"."movieId"
  LEFT OUTER JOIN "genre" AS "genres" ON "genres"."genreId" = "genres->MovieGenre"."genreId"
  WHERE "genres"."name" IN ('триллер', 'ужасы') 
  GROUP BY "Movie"."movieId" 
  HAVING COUNT(DISTINCT CASE WHEN "genres"."name" IN ('триллер','ужасы') THEN "genres"."name" END) = 2 
  LIMIT 10 OFFSET 0
) AS "Movie" 
LEFT OUTER JOIN "movie_genre" AS "genres->MovieGenre" ON "Movie"."movieId" = "genres->MovieGenre"."movieId"
LEFT OUTER JOIN "genre" AS "genres" ON "genres"."genreId" = "genres->MovieGenre"."genreId"

SELECT "Movie"."movieId", "Movie"."name", "Movie"."enName", "Movie"."type", "Movie"."rating", "Movie"."votes", "Movie"."movieLength", "Movie"."description", "Movie"."premiere", "Movie"."slogan", "Movie"."shortDescription", "Movie"."ageRating", "Movie"."poster", "Movie"."trailer", "genres"."genreId" AS "genres.genreId", "genres"."name" AS "genres.name" FROM "movie" AS "Movie" 
INNER JOIN ( 
  "movie_genre" AS "genres->MovieGenre" 
  INNER JOIN "genre" AS "genres" ON "genres"."genreId" = "genres->MovieGenre"."genreId"
  ) ON "Movie"."movieId" = "genres->MovieGenre"."movieId" WHERE "genres"."name" IN ('триллер', 'ужасы') 
  GROUP BY "Movie"."movieId" HAVING COUNT(DISTINCT CASE WHEN "genres"."name" IN ('триллер','ужасы') THEN "genres"."name" END) = 2;