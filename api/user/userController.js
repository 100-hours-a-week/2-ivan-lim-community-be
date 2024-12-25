import {nicknameValidChk, passwordValidChk} from '../function/validCheck.js';
import path from 'path';
// 닉네임 중복체크 API
// GET /api/users/checkNickname
export const checkNickname = async (req, res) => {
    try {
        const response = await fetch('http://localhost:3030/data.json');
        const data = await response.json();
        
        // Add 필요:
        // 401, "required_authorization",
        // 403, "required_permission"

        const nickname = req.query.nickname;

        if (data.users.some(user => user.nickname === nickname)) {
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
// GET /api/users/checkEmail
export const checkEmail = async (req, res) => {
    try {
        const response = await fetch('http://localhost:3030/data.json');
        const data = await response.json();

        // Add 필요: 
        // 401, "required_authorization",
        // 403, "required_permission"

        const email = req.query.email;

        if (data.users.some(user => user.email === email)) {
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

// 유저 정보 조회 API
// GET /api/users/{user_id}
export const getPublicUserInfo = async (req, res) => {
    try {
        const user_id = parseInt(req.params.user_id, 10);
        console.log(`User ID: ${user_id}`);
        const response = await fetch('http://localhost:3030/data.json');
        const data = await response.json();
        const user = data.users.find(user => user.id === user_id);

        if (!user) {
            res.status(404).json({
                message: "user_not_found",
                data: null
            });
            return;
        }
        
        res.status(200).json({
            message: "user_found",
            data:  {
                userId: user.id,
                // email: user.email,
                nickname: user.nickname,
                profileImage: user.profileImage,
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
        let response = await fetch('http://localhost:3030/data.json');
        const data = await response.json();
        const userId = req.session.userId;
        const user = data.users.find(user => user.id === userId);

        if (!user) {
            return res.status(404).json({
                message: "user_not_found",
                data: null
            });
        }

        //nickname 중복, 유효성 검사
        const { newNickname, newProfileImage } = req.body;

        if (!nicknameValidChk(newNickname)) {
            return res.status(400).json({
                message: "invalid_nickname",
                data: null
            });
        }

        // fix 필요: 닉네임 중복 검사 API 호출을 함수로 빼서 사용해야함.
        // response = await checkNickname(newNickname);
        // if (response.data.duplication) {
        //     return res.status(409).json({
        //         message: "already_exist_nickname",
        //         data: null
        //     });
        // }

        // 프로필 이미지 유효성 검사는 어케 하징?
    
        // 정상 응답
        const file = req.file; // 업로드된 파일 정보
        const body = req.body; // 요청 본문 데이터

        console.log(`File Info:`, file);
        console.log(`Request Body:`, body);

        // 1. 파일 경로 처리 (필요한 경우 데이터베이스에 저장)
        let profileImgPath = null;
        if (file) {
            profileImgPath = path.join(file.destination, file.filename); // 파일 경로
            console.log(`File Path: ${profileImgPath}`);
            // add 필요: 여기서 파일 경로를 데이터베이스에 저장하거나 다른 작업 수행
        }

        // 2. 데이터베이스 업데이트 로직 (예제)
        // database.updateUser(userId, { nickname: updatedNickname, profileImg: filePath });

        if(req.session.id !== userId) {
            //fix 필요: 진짜 user data 수정해주기.
            user.nickname = newNickname;
            user.profileImgPath = profileImgPath;
            
    
            res.status(200).json({
                message: "user_info_modified",
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
        }
        else {
            res.status(401).json({
                message: "required_authorization",
                data: null
            });
        }
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
        let response = await fetch('http://localhost:3030/data.json');
        const data = await response.json();
        const user_id = req.session.userId;
        const user = data.users.find(user => user.id === user_id);

        if (!user) {
            return res.status(404).json({
                message: "user_not_found",
                data: null
            });
        }

        const { newPassword } = req.body;

        if (!passwordValidChk(newPassword)) {
            return res.status(400).json({
                message: "invalid_password",
                data: null
            });
        }

        user.password = newPassword;

        res.status(200).json({
            message: "password_modified",
            data:  {
                userId: user.id,
                email: user.email,
                nickname: user.nickname,
                profileImage: user.profileImage,
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
        let response = await fetch('http://localhost:3030/data.json');
        const data = await response.json();
        const user_id = parseInt(req.params.user_id,10);
        const user = data.users.find(user => user.id === user_id);

        if (!user) {
            return res.status(404).json({
                message: "user_not_found",
                data: null
            });
        }

        //fix 필요: 진짜 user data 삭제해주기.

        res.status(200).json({
            message: "delete_user_data_success",
            data:  {
                userId: user.id,
                email: user.email,
                nickname: user.nickname,
                profileImage: user.profileImage,
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