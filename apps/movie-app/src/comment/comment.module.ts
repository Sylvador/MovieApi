import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Comment} from "./models/comment.model";
import {MovieModule} from "../movie/movie.module";

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [SequelizeModule.forFeature([Comment]), MovieModule]
})
export class CommentModule {}
