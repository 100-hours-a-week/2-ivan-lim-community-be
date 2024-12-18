import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.set("port", process.env.PORT || 3030); // 포트 설정
app.set("host", process.env.HOST || "0.0.0.0"); // 아이피 설정

// 보안 미들웨어
import helmet from 'helmet'; // helmet, cors와 같은 설치형 미들웨어는 내부적으로 요청을 완전히 처리하거나 자동으로 next()를 호출하도록 설계
app.use(helmet());
// JSON 파싱 미들웨어
app.use(express.json());
// URL 인코딩 미들웨어
app.use(express.urlencoded({ extended: true }));
// CORS 설정
import cors from 'cors';
app.use(cors({
  origin: 'http://localhost:3000', // 허용할 클라이언트 도메인
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 허용
}));
// multipart/form-data 처리
// import multer from 'multer';
// const upload = multer();
// app.use(upload.any());
// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body); // 요청 메서드, URL, Body 출력
  next(); // 다음 미들웨어로 이동
});

const connection = mysql.createConnection({
  host: "localhost", // 데이터베이스 주소
  port: "3306", // 데이터베이스 포트
  user: "root", // 로그인 계정
  password: process.env.PASSWORD, // 비밀번호
  database: "my_db", // 엑세스할 데이터베이스
});

// 루트 접속시 아이피 출력
app.get("/", function (req, res) {
  res.send("접속된 아이피: " + req.ip);
});

app.post("/", function (req, res) {
    res.send({ ip : req.ip });
  });

// 서버 동작중인 표시
app.listen(app.get("port"), app.get("host"), () =>
  console.log(
    "Server is running on : " + app.get("host") + ":" + app.get("port")
  )
);

import apiRouter from './api/apiRouter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
    express.static(join(__dirname, '')),
);

app.get('/data.json', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'js/data.json',
        ),
    );
});

app.use('/api', apiRouter);

