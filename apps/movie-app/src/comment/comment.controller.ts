import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import {AddCommentDto} from "./dto/add-comment.dto";

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern('addComment')
  create(@Payload() dto: AddCommentDto) {
    return this.commentService.create(dto);
  }
}
