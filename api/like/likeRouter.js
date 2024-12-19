import express from 'express';
import {getMylikeState, toggleLike} from './likeController.js';
import {ssAuthMiddleware} from '../function/middleWare.js';

const likeRouter = express.Router();

likeRouter.get('/:postId', ssAuthMiddleware, getMylikeState);
likeRouter.post('/:postId', ssAuthMiddleware, toggleLike);

export default likeRouter;