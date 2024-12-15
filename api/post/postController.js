import path from 'path';

// 게시글 목록조회 API
// GET /api/posts?offset=0&limit=10
import {notNativeNum, postPermissionCheck} from '../function/validCheck.js';

export const listInquiry = async (req, res) => {
    try {
        let offset = req.query.offset;
        let limit = req.query.limit;
        if(!offset || !limit) {
            return res.status(400).json({
                message: "offset, limit cannot be empty",
                data: null
            });
        }

        // offset, limit 정수형으로 변환
        offset = parseInt(offset,10);
        limit = parseInt(limit,10);

        // offset과 limit 유효성 검사
        if (!notNativeNum(offset) || !notNativeNum(limit)) {
            return res.status(400).json({
                message : "invalid_offset_or_limit",
                data : null
            });
        }
        
        // SELECT * FROM posts ORDER BY date DESC LIMIT ? OFFSET ?; //원래 이거 써야하는데
        const query = `SELECT * FROM posts ORDER BY id DESC LIMIT ? OFFSET ?;`; // 일단 이거 쓰자.
        const [posts] = await req.db.query(query, [limit, offset]);

        res.status(200).json({
            message: "get_posts_success",
            data: posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
}

// 게시글 추가 API
// POST /api/posts

export async function addPost(req, res){
    try {
        const title = req.body.title?.trim();
        const content = req.body.content?.trim();

        // 제목, 내용입력하지 않은 경우
        if (!title || !content) {
            return res.status(400).json({
                message: "Title, Content cannot be empty",
                data: null
            });
        }

        // 게시글 추가
        const query = `
            INSERT INTO posts (title, content, writerId, date)
            VALUES (?, ?, ?, ?);
        `;
        const [result] = await req.db.query(query, [title, content, req.session.userId, new Date()]);

        res.status(201).json({
            message: 'add_post_success',
            data: {
                postId: result.insertId
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


// 게시글 상세조회 API
// GET /api/posts/:post_id
export const detail = async (req, res) => {
    try {
        const post_id = parseInt(req.params.post_id, 10);

        if (!notNativeNum(post_id)) {
            return res.status(400).json({
                message : "invalid_post_id",
                data : null
            });
        }
        
        const query = `SELECT * FROM posts WHERE id = ?;`;
        const [posts] = await req.db.query(query, [post_id]);

        if(posts.length === 0) {
            return res.status(404).json({
                message : "not_found_post",
                data : null
            });
        }
        
        const post = posts[0];
        
        return res.status(200).json({
            message: "get_post_success",
            data: post
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
}

// 게시글 수정 API
// PATCH /api/posts/:post_id
export const editPost = async (req, res) => {
    try {
        const post_id = parseInt(req.params.post_id,10);
        const user_id = parseInt(req.session.userId,10);
        const newTitle = req.body.title?.trim();
        const newContent = req.body.content?.trim();

        if(!newTitle || !newContent) {
            return res.status(400).json({
                message: "Title, Content cannot be empty",
                data: null
            });
        }
        
        if(!await postPermissionCheck(req, res, post_id, user_id))
            return;

        const query = `UPDATE posts SET title = ?, content = ? WHERE id = ?;`;
        await req.db.query(query, [newTitle, newContent, post_id]);

        res.status(200).json({
            message: "edit_post_success",
            data: {
                postId : post_id
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
}

// 게시글 삭제 API
// DELETE /api/posts/:post_id
export async function deletePost(req, res) {
    try {
        const post_id = parseInt(req.params.post_id,10);
        const user_id = parseInt(req.session.userId,10);
        
        if(!await postPermissionCheck(req, res, post_id, user_id))
            return;

        const query = `DELETE FROM posts WHERE id = ?;`;
        req.db.query(query, [post_id]);

        res.status(200).json({
            message: "delete_post_success",
            data: null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
}

// post /api/uploadImg/:post_id
export const uploadImg = async (req, res) => {
    // post img에 path 추가... path가 아니라 name이라고 해야겠다.
    const query = `UPDATE posts SET imagePath = ? WHERE id = ?;`;

    // 파일 이름 추출
    const fileName = path.basename(req.file.path);

    const values = [fileName, req.params.post_id];
    await req.db.query(query, values);

    res.status(200).json({
        message: "uploadImg_success",
        data: {
            postId: req.params.post_id,
            // profileImg: req.file.path
        }
    });
}

// 웹페이지를 위한 권한 확인 API
export async function authorizeAction(req, res) {
    try{
        if (!req.session || !req.session.userId)
        {
            return res.status(401).json({
                message : "required_authorization",
                data : null
            });
        }
        const post_id = parseInt(req.params.post_id,10);
        const user_id = parseInt(req.session.userId,10);
        
        if(!await postPermissionCheck(req, res, post_id, user_id))
            return;

        res.status(200).json({
            message: "authorized",
            data: null
        });
    }catch{
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }


}