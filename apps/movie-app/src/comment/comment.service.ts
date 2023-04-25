import {BadRequestException, Injectable} from '@nestjs/common';
import { AddCommentDto } from './dto/add-comment.dto';
import {InjectModel} from "@nestjs/sequelize";
import {Comment} from "./models/comment.model";
import {MovieService} from "../movie/movie.service";
import {RpcException} from "@nestjs/microservices";

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment) private commentRepository: typeof Comment,
              private movieService: MovieService) {}
  async create(dto: AddCommentDto) {
    await this.movieService.getModelById(dto.movieId);
    if (dto.parentId) {
      const comment = await this.getModelById(dto.parentId);
      if (+comment.movieId !== +dto.movieId) {
        throw new RpcException(new BadRequestException('id фильмов родительского и дочернего комментариев не совпадают'));
      }

    }
    return this.commentRepository.create(dto, {returning: true});
  }

  async getModelById(id: number) {
    const comment = await this.commentRepository.findByPk(id);
    if (!comment) {
      throw new RpcException(new BadRequestException('Комментарий с данным id не найден'));
    }
    return comment;
  }
}
