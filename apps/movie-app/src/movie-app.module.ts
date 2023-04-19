import { Module } from '@nestjs/common';
import {MovieModule} from "./movie/movie.module";
import {CommentModule} from './comment/comment.module';
import {PersonModule} from "./person/person.module";

@Module({
  imports: [MovieModule, PersonModule, CommentModule]
})
export class MovieAppModule {}
