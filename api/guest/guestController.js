import bcrypt from 'bcrypt';
import {emailValidChk, nicknameValidChk, passwordValidChk} from '../function/validCheck.js';
import {isExistNickname, isExistEmail} from '../function/bool.js';

//post
export const login = async (req, res) => {
    try {
        const email = req.body.email?.trim();
        const password = req.body.password;

        // 1. 이메일 또는 비밀번호 입력하지 않은 경우
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password cannot be empty",
                data: null
            });
        }

        // 2. 이메일 이용해서 사용자 password 가져오기
        const query = `SELECT * FROM users WHERE email = ?;`;

        const [users] = await req.db.query(query, [email]);

        if (users.length === 0) {
            return res.status(404).json({
                message: "Email does not exist",
                data: null
            });
        }

        // 3. 비밀번호가 일치하지 않는 경우.
        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        console.log('Input Password:', password);
        console.log('Stored Password from DB:', user.password);
        if (!match)
            return res.status(401).json({
            message: "Password is incorrect"
        });

        // 4. 로그인 성공
        // return res.redirect('http://localhost:3000/listInquiry'); // 로그인 성공 시 리다이렉션
        req.session.userId = user.id;// Save user in session. 사용자가 req.session 객체에 데이터를 저장하면, express-session이 이를 자동으로 세션 저장소에 저장하고 관리.
        console.log("req.session.userId: ", req.session);
        res.status(200).json({
            message: "login_success",
            data: {
                userId: user.id,
                email: user.email,
                nickname: user.nickname,
                // created_at: "2024-03-26T09:59:50.000Z",
                // updated_at: "2024-03-26T09:59:50.000Z",
                // deleted_at: null,
                // auth_token: "pGGXsa6vaKs615CYO0GpJjcDpN6WUjQa"
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
}

//post
export const join = async (req, res) => {
    try {
        const email = req.body.email?.trim();
        const password = req.body.password?.trim();
        const nickname = req.body.nickname?.trim();

        // 1. 이메일, 비밀번호, 닉네임 입력하지 않은 경우
        if (!email || !password || !nickname) {
            return res.status(400).json({
                message: "Email, Password, and Nickname cannot be empty",
                data: null
            });
        }

        // 2. 유효하지 않은 이메일, 비밀번호, 닉네임
        if(!emailValidChk(email)) {
            return res.status(400).json({
                message: "invalid_email",
                data: null
            });
        }
        if(!passwordValidChk(password)) {
            return res.status(400).json({
                message: "invalid_password",
                data: null
            });
        }
        if (!nicknameValidChk(nickname)) {
            return res.status(400).json({
                message: "invalid_nickname",
                data: null
            });
        }

        // 3. 이메일, 닉네임 중복 시
        
        // 중복된 레코드가 있는 경우
        if (await isExistNickname(req.db, nickname) || await isExistEmail(req.db, email)) {
            return res.status(409).json({
                message: "Email or Nickname is already in use",
                data: null
            });
        }

        // 4. 회원가입 성공
        // add 필요 : post 요청하여 email,hashPassword 넣은 newUser 추가해주기.
        const saltRounds = 9; // bcrypt 솔트 라운드
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log('Plain Password:', password);
        console.log('Hashed Password before saving:', hashedPassword);
        const query = `
            INSERT INTO users (email, password, nickname)
            VALUES (?, ?, ?);
        `;
        const values = [email, hashedPassword, nickname];
        const [result] = await req.db.query(query, values);

        req.session.userId = result.insertId;

        res.status(201).json({
            message: 'register_success',
            data: {
                userId: result.insertId,
            }
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
}

