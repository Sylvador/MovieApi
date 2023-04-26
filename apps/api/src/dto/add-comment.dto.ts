export class AddCommentDto {
    userName: string;
    publishDate: Date;
    value: string;
    parentId?: number;
}