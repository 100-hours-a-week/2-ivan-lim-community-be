import express from 'express';
import {getCommentList,deleteComment,createComment,EditComment } from './commentController.js';

const commentRouter = express.Router();

commentRouter.get('/:postId', getCommentList);
commentRouter.post('/:postId', createComment);
commentRouter.patch('/:commentId', EditComment);
commentRouter.delete('/:commentId', deleteComment);

export default commentRouter;