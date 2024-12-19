import express from 'express';
import {toggleLike} from './likeController.js';
import {ssAuthMiddleware} from '../function/middleWare.js';

const likeRouter = express.Router();

likeRouter.post('/:postId', ssAuthMiddleware, toggleLike);

export default likeRouter;