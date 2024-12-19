import path from 'path';
import {nicknameValidChk, passwordValidChk} from '../function/validCheck.js';
import {isExistNickname, isExistEmail} from '../function/bool.js';
import bcrypt from 'bcrypt';

// 닉네임 중복체크 API
// GET /api/users/checkNickname?nickname={nickname}
export const checkNickname = async (req, res) => {
    try {
        
        const nickname = req.query.nickname;
        if(!nickname)
        {
            return res.status(400).json({
                message: "nickname cannot be empty",
                data: null
            });
        }

        if (await isExistNickname(req.db, nickname)) {
            return res.status(200).json({
                message : "already_exist_nickname",
                data : {
                    duplication : true
                }
            });
        }
        else {
            res.status(200).json({
                message: "available_nickname",
                data : {
                    duplication : false,
                    nickname: nickname
                }
            });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
};

// 아메알 중복체크 API
// GET /api/users/checkEmail?email={email}
export const checkEmail = async (req, res) => {
    try {
        const email = req.query.email;
        if(!email)
        {
            return res.status(400).json({
                message: "email cannot be empty",
                data: null
            });
        }

        if (await isExistEmail(req.db, email)) {
            res.status(200).json({
                message : "already_exist_email",
                data : {
                    duplication : true
                }
            });
        }
        else {
            res.status(200).json({
                message: "available_email",
                data : {
                    email: email,
                    duplication : false
                }
            });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
};

// public 유저 정보 조회 API
// GET /api/users/{user_id}
export const getPublicUserInfo = async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id, 10);
        console.log(`User ID: ${user_id}`);
        const query = `SELECT * FROM users WHERE id = ${user_id}`;
        const [users] = await req.db.query(query);

        if (users.length === 0) {
            res.status(404).json({
                message: "user_not_found",
                data: null
            });
            return;
        }

        const user = users[0];

        res.status(200).json({
            message: "user_found",
            data:  {
                userId: user.id,
                email: user.email,
                nickname: user.nickname,
                profileImgPath: user.profileImgPath,
                // created_at: "2024-03-26T09:59:50.000Z",
                // updated_at: "2024-03-26T09:59:50.000Z",
                // deleted_at: null
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

// 회원 정보(닉네임, 프로필) 수정 API
// PATCH /api/users/{user_id}
export const memInfoModi = async(req, res) => {
    try {
        const userId = req.session.userId;
        
        //nickname 유효성 검사
        const { newNickname} = req.body;

        if (!nicknameValidChk(newNickname)) {
            return res.status(400).json({
                message: "invalid_nickname",
                data: null
            });
        }

        // nickname 중복 검사
        if(await isExistNickname(req.db, newNickname)) {
            return res.status(409).json({
                message: "already_exist_nickname",
                data: null
            });
        }

        // 2. 데이터베이스 업데이트 로직
        const query = `UPDATE users SET nickname = ? WHERE id = ?`;
        await req.db.query(query, [newNickname, userId]);

        return res.status(200).json({
            message: "user_info_modified",
            data:  {
                userId: userId,
                newNickname: newNickname,
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

// 회원 비밀번호 수정 API
// PATCH /api/users/{user_id}/password

export const passwordModi = async(req, res) => {
    try {
        const user_id = req.session.userId;
        
        const { newPassword } = req.body;

        if (!passwordValidChk(newPassword)) {
            return res.status(400).json({
                message: "invalid_password",
                data: null
            });
        }

        const saltRounds = 9; // bcrypt 솔트 라운드
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const query = `UPDATE users SET password = ? WHERE id = ?`;
        await req.db.query(query, [hashedPassword, user_id]);

        return res.status(200).json({
            message: "password_modified",
            data:  {
                userId: user_id,
                // email: user.email,
                // nickname: user.nickname,
                // profileImage: user.profileImage,
                // created_at: "2024-03-26T09:59:50.000Z",
                // updated_at: "2024-03-26T09:59:50.000Z",
                // deleted_at: null
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

// 회원 탈퇴 API
// DELETE /api/users/{user_id}
export const memInfoDel = async(req, res) => {
    try {
        const user_id = parseInt(req.session.userId,10); // 이거 parseInt 해야하나? req.session.userId에 number로 들어가지 않나?
        
        let query;

        // writerId가 특정 user_id인 모든 comment의 postId를 가져옴
        query = `SELECT postId FROM comments WHERE writerId = ?`;
        const [comments] = await req.db.query(query, [user_id]);

        if (comments.length > 0) {
            const postIds = comments.map(comment => comment.postId);

            // 해당 postId들의 comment 값을 한 번에 감소
            query = `UPDATE posts SET comment = comment - 1 WHERE id IN (?)`;
            await req.db.query(query, [postIds]);
        }

        // 해당 user가 like 남긴 post에서 like 값 감소
        query = `SELECT postId FROM likes_mapping WHERE userId = ?`;
        const [likes] = await req.db.query(query, [user_id]);

        if (likes.length > 0) {
            const postIds = likes.map(like => like.postId);

            query = `UPDATE posts SET \`like\` = \`like\` - 1 WHERE id IN (?)`;
            await req.db.query(query, [postIds]);
        }

        query = `DELETE FROM users WHERE id = ${user_id}`;
        await req.db.query(query);
        

        res.clearCookie('connect.sid');
        req.session.destroy();

        res.status(200).json({
            message: "delete_user_data_success",
            data:  {
                userId: user_id,
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

export function logout(req, res) {
    res.clearCookie('connect.sid');
    req.session.destroy();
    res.status(200).json({
        message: "logout_success",
        data: null
    });
}

// post /api/users/uploadImg/:user_id
export const uploadImg = async (req, res) => {
    // user img에 path 추가
    const query = `UPDATE users SET profileImgPath = ? WHERE id = ?;`;

    // 파일 이름 추출
    const fileName = path.basename(req.file.path);

    const values = [fileName, req.session.userId];
    await req.db.query(query, values);

    res.status(200).json({
        message: "uploadImg_success",
        data: {
            userId: req.params.user_id,
            // profileImg: req.file.path
        }
    });
}