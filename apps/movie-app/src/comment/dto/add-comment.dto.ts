export class AddCommentDto {
    movieId: number;
    userName: string;
    publishDate: Date;
    value: string;
    parentId?: number;
}
