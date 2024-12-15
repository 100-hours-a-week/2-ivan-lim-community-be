import express from 'express';
import {getCommentList,deleteComment,createComment,EditComment } from './commentController.js';
import {ssAuthMiddleware, wiBodyChkMiddleware} from '../function/middleWare.js';

const commentRouter = express.Router();

commentRouter.get('/:postId', getCommentList);
commentRouter.post('/:postId', ssAuthMiddleware, wiBodyChkMiddleware, createComment);
commentRouter.patch('/:commentId', ssAuthMiddleware, EditComment);
commentRouter.delete('/:commentId', ssAuthMiddleware, deleteComment);

export default commentRouter;