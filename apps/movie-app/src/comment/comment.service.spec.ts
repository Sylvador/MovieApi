import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { Comment } from './models/comment.model';
import { MovieService } from '../movie/movie.service';
import { BadRequestException } from '@nestjs/common';
import { AddCommentDto } from './dto/add-comment.dto';
import { getModelToken } from '@nestjs/sequelize';
import { RpcException } from '@nestjs/microservices';

describe('CommentService', () => {
  let commentService: CommentService;
  let movieService: MovieService;
  let commentRepository: typeof Comment;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: MovieService,
          useValue: {
            getModelById: jest.fn(),
          },
        },
        {
          provide: getModelToken(Comment),
          useValue: {
            create: jest.fn(),
            findByPk: jest.fn(),
          },
        },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    movieService = module.get<MovieService>(MovieService);
    commentRepository = module.get<typeof Comment>(getModelToken(Comment))
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  it('commentRepository should be defined', () => {
    expect(commentRepository).toBeDefined();
  })

  it('commentService.getModelById should be defined', () => {
    expect(commentService.getModelById).toBeDefined();
  })
  describe('create', () => {
    it('should create a comment successfully', async () => {
      const dto: AddCommentDto = {
        movieId: 1,
        username: 'John Doe',
        value: 'Great movie!',
      };

      const createdComment = {
        id: 1,
        movieId: dto.movieId,
        username: dto.username,
        value: dto.value,
        publishDate: new Date(),
      };

      (movieService.getModelById as jest.Mock).mockResolvedValue({});
      (commentService['commentRepository'].create as jest.Mock).mockResolvedValue(createdComment);
      // jest.spyOn(commentRepository, 'create').mockResolvedValueOnce(createdComment)
      const result = await commentService.create(dto, 1, 'John Doe');
      expect(result).toEqual(createdComment);
    });

    it('should throw an error if parent and child comments have different movie IDs', async () => {
      const dto: AddCommentDto = {
        movieId: 1,
        parentId: 2,
        username: 'John Doe',
        value: 'Great movie!',
      };

      const parentComment = {
        id: dto.parentId,
        movieId: 2,
        userName: 'Jane Doe',
        value: 'I agree!',
        publishDate: new Date(),
      };

      (movieService.getModelById as jest.Mock).mockResolvedValue({});
      // (commentService.getModelById as jest.Mock).mockImplementationOnce(() => parentComment);
      jest.spyOn(commentService, 'getModelById').mockResolvedValueOnce(parentComment as unknown as Comment)
      await expect(commentService.create(dto, 1, 'John Doe')).rejects.toThrowError(new RpcException(new BadRequestException('id фильмов родительского и дочернего комментариев не совпадают')));
    });
  });

  describe('getModelById', () => {
    it('should return a comment by ID', async () => {
      const commentId = 1;
      const comment = {
        id: commentId,
        movieId: 1,
        userName: 'John Doe',
        value: 'Great movie!',
        publishDate: new Date(),
      };

      (commentService['commentRepository'].findByPk as jest.Mock).mockResolvedValue(comment);

      const result = await commentService.getModelById(commentId);
      expect(result).toEqual(comment);
    });

    it('should throw an error if comment is not found', async () => {
      const commentId = 1;

      jest.spyOn(commentRepository, 'findByPk').mockResolvedValueOnce(null)

      await expect(commentService.getModelById(commentId)).rejects.toThrowError(new RpcException(new BadRequestException('Комментарий с данным id не найден')));
    });
  });
});
