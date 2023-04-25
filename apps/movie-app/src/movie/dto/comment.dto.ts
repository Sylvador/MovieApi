import {Comment} from "../../comment/models/comment.model";
export class CommentDto {
    commentId: number;
    movieId: number;
    userName: string;
    publishDate: Date;
    value: string;
    parentId?: number;


    constructor(comment: Comment) {
        this.commentId = comment.commentId;
        this.movieId = comment.movieId;
        this.userName = comment.userName;
        this.publishDate = comment.publishDate;
        this.value = comment.value;
        this.parentId = comment.parentId;
    }
}