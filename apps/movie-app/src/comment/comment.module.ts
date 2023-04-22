import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Comment} from "./models/comment.model";

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [SequelizeModule.forFeature([Comment])]
})
export class CommentModule {}
