import express from 'express';
import {checkNickname, checkEmail, getPublicUserInfo, memInfoModi, passwordModi, memInfoDel} from './userController.js';
import {ssAuthMiddleware, uiParamChkMiddleware, profileImgMiddlewareFactory} from '../function/middleWare.js';

const userRouter = express.Router();

userRouter.get('/nickname', checkNickname);
userRouter.get('/email', checkEmail);
userRouter.get('/:user_id', getPublicUserInfo);
userRouter.patch('/:user_id', ssAuthMiddleware, profileImgMiddlewareFactory('newProfileImg'), memInfoModi);
userRouter.patch('/:user_id/password', ssAuthMiddleware, uiParamChkMiddleware, passwordModi);
userRouter.delete('/:user_id',ssAuthMiddleware ,uiParamChkMiddleware, memInfoDel);
export default userRouter;