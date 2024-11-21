import express from 'express';
import {checkNickname,checkEmail,getUserInfo,memInfoModi} from './userController.js';

const userRouter = express.Router();

userRouter.get('/nickname', checkNickname);
userRouter.get('/email', checkEmail);
userRouter.get('/:user_id', getUserInfo);

import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 원하는 경로와 이름 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 파일이 저장될 경로 지정
        const uploadPath = join(__dirname, '../../uploadedImg');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = extname(file.originalname); // 원래 파일 확장자 추출
        // 원하는 파일 이름 지정
        cb(null, `${req.params.user_id}'s profileimg${ext}`);    
    }
});

  // multer 설정
const upload = multer({ storage });

userRouter.patch('/:user_id', upload.single('newProfileImg'), memInfoModi);

export default userRouter;