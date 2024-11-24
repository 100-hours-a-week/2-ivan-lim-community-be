import express from 'express';
import { listInquiry, addPost, detail, editPost, deletePost } from './postController.js';

const postRouter = express.Router();

postRouter.get('/', listInquiry)
postRouter.get('/:post_id', detail)

// fix 필요: 얘네도 image를 못받아주고 있다. multer 문제인 듯 하다.
postRouter.post('/', addPost)
postRouter.patch('/:post_id', editPost)
///////////////////////////////////////////////////////

postRouter.delete('/:post_id', deletePost)

export default postRouter;