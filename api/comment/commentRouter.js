import express from 'express';
import {getCommentList,deleteComment,createComment,EditComment } from './commentController.js';
import {ssAuthMiddleware} from '../function/middleWare.js';

const commentRouter = express.Router();

commentRouter.get('/:postId', getCommentList);
commentRouter.post('/:postId', ssAuthMiddleware, createComment);
commentRouter.patch('/:commentId', ssAuthMiddleware, EditComment);
commentRouter.delete('/:commentId', ssAuthMiddleware, deleteComment);

export default commentRouter;