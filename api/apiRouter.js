import express from 'express';
import userRouter from './user/userRouter.js';
import guestRouter from './guest/guestRouter.js';

const apiRouter = express.Router();

apiRouter.use('/guests', guestRouter);
apiRouter.use('/users', userRouter);

export default apiRouter;