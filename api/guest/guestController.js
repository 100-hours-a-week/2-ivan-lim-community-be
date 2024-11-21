import {emailValidChk, nicknameValidChk, passwordValidChk} from '../function/validCheck.js';

//post
export const login = async (req, res) => {
    try {
        const email = req.body.email?.trim();
        const password = req.body.password;

        // 1. 이메일 또는 비밀번호 입력하지 않은 경우
        if (!email || email === '' || !password) {
            return res.status(400).json({
                message: "Email and Password cannot be empty",
                data: null
            });
        }

        // 2. 이메일이 존재하지 않는 경우
        const response = await fetch('http://localhost:3030/data.json');
        const data = await response.json();

        const user = data.users.find(user => user.email === email);
        if (!user) {
            return res.status(404).json({
                message: "Email does not exist",
                data: null
            });
        }
        
        // 3. 비밀번호가 일치하지 않는 경우.
        if (user.password !== password) {
            return res.status(401).json({
                message: "Password is incorrect"
            });
        }
        // 4. 로그인 성공
        // return res.redirect('http://localhost:3000/listInquiry'); // 로그인 성공 시 리다이렉션
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
        const password = req.body.password;
        const nickname = req.body.nickname;
        const profileImg = req.body.profileImg;

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
        let response = await fetch('http://localhost:3030/data.json');
        const data = await response.json();

        if (data.users.some(user => user.email === email) || data.users.some(user => user.nickname === nickname)) {
            return res.status(409).json({
                message: "Email or Nickname is already in use",
                data: null
            });
        }

        // 4. 회원가입 성공
        // add 필요 : post 요청하여 newUser 추가해주기.

        res.status(201).json({
            message: 'register_success',
            data: {
                userId: 1, // fix 필요
                profile_image_id: 1, // fix 필요
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

