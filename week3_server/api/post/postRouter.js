import express from 'express';
import { listInquiry, addPost, detail, editPost, deletePost } from './postController.js';
import {ssAuthMiddleware, wiBodyChkMiddleware, postImgMiddlewareFactory} from '../function/middleWare.js';

const postRouter = express.Router();

postRouter.get('/', listInquiry)
postRouter.get('/:post_id', detail)
postRouter.post('/',ssAuthMiddleware, postImgMiddlewareFactory('postImg'), addPost)
postRouter.patch('/:post_id', ssAuthMiddleware, postImgMiddlewareFactory('newImage'), editPost)
postRouter.delete('/:post_id', ssAuthMiddleware, deletePost)

export default postRouter;