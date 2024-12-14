import express from 'express';
import { listInquiry, addPost, detail, editPost, deletePost, uploadImg, authorizeAction } from './postController.js';
import {ssAuthMiddleware, wiBodyChkMiddleware, postImgMiddlewareFactory} from '../function/middleWare.js';

const postRouter = express.Router();

postRouter.get('/', listInquiry)
postRouter.get('/:post_id', detail)
postRouter.post('/',ssAuthMiddleware, addPost)
postRouter.patch('/:post_id', ssAuthMiddleware, editPost)
postRouter.delete('/:post_id', ssAuthMiddleware, deletePost)
postRouter.post('/uploadImg/:post_id', ssAuthMiddleware, postImgMiddlewareFactory('postImg'),uploadImg)

postRouter.get('/permissionCheck/:post_id', authorizeAction)
export default postRouter;