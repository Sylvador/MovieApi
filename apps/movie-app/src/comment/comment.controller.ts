import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import { AddCommentDto } from "./dto/add-comment.dto";
import { Comment } from "./models/comment.model";

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @MessagePattern('addComment')
  create(@Payload() dto: AddCommentDto): Promise<Comment> {
    try {
      return this.commentService.create(dto);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
}
