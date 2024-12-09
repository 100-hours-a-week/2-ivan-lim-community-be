import express from 'express';
import userRouter from './user/userRouter.js';
import guestRouter from './guest/guestRouter.js';
import postRouter from './post/postRouter.js';
import commentRouter from './comment/commentRouter.js';
import likeRouter from './like/likeRouter.js';

const apiRouter = express.Router();

apiRouter.use('/guests', guestRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/likes', likeRouter);

export default apiRouter;