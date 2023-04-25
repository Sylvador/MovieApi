import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Movie} from "../../movie/models/movie.model";

interface CommentCreationAttrs {
    movieId: number;
    userName: string;
    publishDate: Date;
    value: string;
    parentId: number;
}

@Table({tableName: 'comment', createdAt: false, updatedAt: false})
export class Comment extends Model<Comment, CommentCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    commentId: number;

    @ForeignKey(() => Movie)
    @Column({type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE'})
    movieId: number;

    @Column({type: DataType.STRING, allowNull: false})
    userName: string;

    @Column({type: DataType.DATE, allowNull: false})
    publishDate: Date;

    @Column({type: DataType.TEXT, allowNull: false})
    value: string;

    @Column({type: DataType.INTEGER})
    parentId: number;
}