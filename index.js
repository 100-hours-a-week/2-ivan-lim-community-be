import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.set("port", process.env.PORT || 3030); // 포트 설정
app.set("host", process.env.HOST || "0.0.0.0"); // 아이피 설정

// 보안 미들웨어
import helmet from 'helmet';
app.use(helmet());
// JSON 파싱 미들웨어
app.use(express.json());
// URL 인코딩 미들웨어
app.use(express.urlencoded({ extended: true }));
// CORS 설정
import cors from 'cors';
app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://43.203.97.60:3000'], // 허용할 클라이언트 도메인
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 허용
}));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body); // 요청 메서드, URL, Body 출력
  console.log('Cookies:', req.headers.cookie); // 요청 헤더의 쿠키 출력
  console.log('Session ID:', res.sessionID); // 세션 ID 출력
  next(); // 다음 미들웨어로 이동
});

// 응답 로깅 미들웨어
app.use((req, res, next) => {
  const startTime = Date.now();

  // 응답이 완료된 후 실행
  res.on('finish', () => {
    const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString(); // UTC + 9시간
    const duration = Date.now() - startTime;
    console.log(`[${nowKST}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
});

import session from 'express-session';
// Session setup
app.use(
  session({
    secret: 'yourSecretKey',
    saveUninitialized: false, // 초기화되지 않은 세션 저장 안 함
    resave: false, // 변경되지 않은 세션을 다시 저장하지 않음
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1일
      httpOnly: true,
      //rolling: true, // 매 요청마다 쿠키 유지
      secure: false, // 개발 중이라 HTTPS가 아니므로 false
      // sameSite: 'none', // 빼니까 된다. => secure: false로 설정한 상태에서 sameSite: 'none'을 설정하면, 브라우저가 이를 비정상적으로 간주하고 쿠키를 차단
      // domain: '127.0.0.1', // 쿠키의 도메인 명시적으로 설정. 근데 이거 설정하면 해당 domain으로 접속했는데도 쿠키가 안생김...
      domain: process.env.SS_DOMAIN, // 이게 default. 이건 명시적으로 써도 쿠키가 생김.
    },
  })
);
 
// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
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

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
  '/userProfileImg',
  helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }), // 이게 뭔데 이거하면 되는거지?
  express.static(join(__dirname, 'uploadedImg/userProfileImg'))
);
app.use(
  '/postImg',
  helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }),
  express.static(join(__dirname, 'uploadedImg/postImg'))
);

import {connectToDB} from './api/function/middleWare.js';
app.use(connectToDB);

import apiRouter from './api/apiRouter.js';
app.use('/api', apiRouter);

