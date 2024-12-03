import express from 'express';
import session from 'express-session';

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

import cors from 'cors';
app.use(cors({
  origin: ['http://127.0.0.1:5501', 'http://localhost:5501'], // 허용할 클라이언트 도메인
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 허용
}));

// Preflight 요청 허용
// app.options('*', cors()); // OPTIONS 요청에 대한 CORS 설정

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Body:`, req.body); // 요청 메서드, URL, Body 출력
  console.log('Cookies:', req.headers.cookie); // 요청 헤더의 쿠키 출력
  next(); // 다음 미들웨어로 이동
});

// Session setup
app.use(
  session({
    secret: 'yourSecretKey',
    saveUninitialized: false, // 초기화되지 않은 세션 저장 안 함
    resave: false, // 변경되지 않은 세션을 다시 저장하지 않음
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1일
      httpOnly: true,
      httpOnly: false,
      secure: false, // HTTPS가 아니므로 false
      // sameSite: 'none', // 빼니까 된다. => secure: false로 설정한 상태에서 sameSite: 'none'을 설정하면, 브라우저가 이를 비정상적으로 간주하고 쿠키를 차단
      // domain: '127.0.0.1', // 쿠키의 도메인 명시적으로 설정. 근데 이거 설정하면 해당 domain으로 접속했는데도 쿠키가 안생김...
      domain: 'localhost', // 이게 default. 이건 명시적으로 써도 쿠키가 생김.
    },
  })
);


// Mock user database
const users = { admin: 'password' };

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    req.session.user = username; // Save user in session. 사용자가 req.session 객체에 데이터를 저장하면, express-session이 이를 자동으로 세션 저장소에 저장하고 관리합니다.
    console.log("req.session.user: ", req.session.user);
    console.log('Session ID:', req.sessionID); // 세션 ID 출력.
    // express-session 미들웨어는 쿠키에서 connect.sid만 읽어서 세션 ID로 사용
  return res.status(200).json({ message: 'Login successful' });
  }
  res.status(400).json({ message: 'Invalid username or password' });
});

// Protected resource route
app.get('/protected', (req, res) => {
  console.log("req.session.user: ", req.session.user);
  if (req.session.user) {
    return res.status(200).json({ message: 'Protected resource accessed' });
  }
  res.status(400).json({ message: 'Not authenticated' });
});

// Serve HTML file
app.use(express.static('.'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
