export async function ssAuthMiddleware(req, res, next) 
{
    // 세션에 등록된 userId가 존재하면 다음 미들웨어로 이동
    if (req.session && req.session.userId)
    {
        const query = `SELECT COUNT(*) AS Count FROM users WHERE id = ${req.session.userId}`;
        const [rows] = await req.db.query(query);

        if (rows[0].Count === 0) {
            const error = new Error('user_not_found');
            error.status = 404;
            error.message = 'user_not_found';
            return next(error); // 에러 전달
        }
        else
            next();
    }
    else
    {
        const error = new Error('required_authorization');
        error.status = 401;
        error.message = 'required_authorization';
        return next(error); // 에러 전달
    }
}
// path variable로 들어온 user_id와 session의 userId 비교
        // ui = UserId
export function uiParamChkMiddleware(req, res, next)
{
    if (req.session.userId === parseInt(req.params.user_id, 10)) // 10진수 숫자로 변환
        next(); // 다음으로 이동
    else 
    {
        const error = new Error('required_authorization');
        error.status = 401;
        error.message = 'required_authorization';
        return next(error); // 에러 전달
    }
}
 
// body의 writerId와 session의 userId 일치 여부 확인.
// 항상 ssAuthMiddleware 다음에 호출되도록 해 req.session.userId가 보장되어야 함.
export function wiBodyChkMiddleware(req, res, next)
{
    const {writerId} = req.body;

    if(!writerId)
    {
        const error = new Error('writerId cannot be empty')
        error.status = 400;
        error.message = 'writerId cannot be empty';
        return next(error);
    }

    if (req.session.userId === parseInt(writerId, 10)) // 10진수 숫자로 변환
        next();
    else 
    {
        const error = new Error('required_authorization');
        error.status = 401;
        error.message = 'required_authorization';
        return next(error); // 에러 전달
    }
}

// export async function postPermissionCheck(req, res, next)
// {
//     const post_id = parseInt(req.params.post_id,10);
//     const user_id = parseInt(req.session.userId,10);

//     // post_id 양수인지 확인
//     if (!notNativeNum(post_id)) {
//         return res.status(400).json({
//             message : "invalid_post_id",
//             data : null
//         });
//     }

//     // '세션의 user_id' 와 'post_id의 writerId'가 일치하는지 확인
//     const query = `SELECT * FROM posts WHERE id = ${post_id}`;
//     const [posts] = await req.db.query(query);
//     if(posts.length === 0) {
//         return res.status(404).json({
//             message : "not_found_post",
//             data : null
//         });
//     }
//     const post = posts[0];

//     if(post.writerId !== user_id) {
//         return res.status(403).json({
//             message : "required_permission",
//             data : null
//         });
//     }
// }

import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

export function profileImgMiddlewareFactory(customString) {
    return (req, res, next) => { // 고차 함수. (req, res, next)를 return하는게 아니라 (req, res, next)를 받아서 return하는 함수를 return한다.
        const __dirname = dirname(fileURLToPath(import.meta.url));

        // 원하는 경로와 이름 설정
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                // 파일이 저장될 경로 지정
                const uploadPath = join(__dirname, '../../uploadedImg/userProfileImg');
                cb(null, uploadPath);
            },
            // 파일 이름 지정 (customString 활용)
            filename: (req, file, cb) => {
                const ext = extname(file.originalname); // 원래 파일 확장자 추출
                cb(null, `${req.session.userId}${ext}`);
            }
        });

        // Multer 설정
        const upload = multer({ storage });

        // Multer 미들웨어 호출
        upload.single(customString)(req, res, (err) => {
            if (err) {
                console.error('Error during file upload:', err);
                const error = new Error('file_upload_failed');
                error.status = 400;
                error.message = 'file_upload_failed';
                return next(error); // 에러 전달
            }

            // 업로드 성공 시 다음 미들웨어로 이동
            console.log('File uploaded:', req.file);
            next();
        });
    };
}

export function postImgMiddlewareFactory(customString) {
    return (req, res, next) => {
        const __dirname = dirname(fileURLToPath(import.meta.url));

        // 원하는 경로와 이름 설정
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                // 파일이 저장될 경로 지정
                const uploadPath = join(__dirname, '../../uploadedImg/postImg');
                cb(null, uploadPath);
            },
            // 파일 이름 지정 (customString 활용)
            filename: (req, file, cb) => {
                const ext = extname(file.originalname); // 원래 파일 확장자 추출
                cb(null, `${req.params.post_id}${ext}`); // fix 필요: 이래서 이미지 업로드 api가 따로 있었구나. 유효성 검사, 인증, 인가 통과 시에만 이미지를 추가하기 위해.
            }
        });

        // Multer 설정
        const upload = multer({ storage });

        // Multer 미들웨어 호출
        upload.single(customString)(req, res, (err) => {
            if (err) {
                console.error('Error during file upload:', err);
                const error = new Error('file_upload_failed');
                error.status = 400;
                error.message = 'file_upload_failed';
                return next(error); // 에러 전달
            }

            // 업로드 성공 시 다음 미들웨어로 이동
            console.log('File uploaded:', req.file);
            next();
        });
    };
}

// db 연결 미들웨어
// import mysql from "mysql2/promise";
// import dotenv from 'dotenv';

// export async function connectToDB(req,res,next) {
//     try{
//         dotenv.config();
//         const pool = mysql.createPool({
//             host: process.env.HOST,
//             port: process.env.PORT,
//             user: process.env.DB_USER,
//             password: process.env.PASSWORD,
//             database: process.env.DATABASE,
//             waitForConnections: true,
//             connectionLimit: 10, // 최대 연결 수
//             queueLimit: 0        // 대기열 제한
//         });
//         req.db = pool;
//         next();        
//     }catch(err){
//         console.error("MySQL 연결 실패:", err);
//         throw err;
//     }
// }

import {pool} from '../function/db.js';

export async function connectToDB(req,res,next) {
    try {
        req.db = pool; // 전역 풀을 요청에 전달
        
        // 연결 테스트
        await pool.query('SELECT 1');
        next();
    } catch (err) {
        console.error("MySQL 연결 실패:", err);
        res.status(500).json({ message: 'Database connection failed' });
    }
}