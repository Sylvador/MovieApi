import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import { Comment } from "./models/comment.model";
import { AddCommentDto } from 'apps/api/src/dto/add-comment.dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @MessagePattern('addComment')
  create(@Payload('dto') dto: AddCommentDto, @Payload('movieId') movieId: number, @Payload('username') username: string): Promise<Comment> {
    try {
      return this.commentService.create(dto, movieId, username);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
}
