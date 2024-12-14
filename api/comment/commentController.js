import {notNativeNum, commentPermissionCheck} from '../function/validCheck.js';

// 댓글조회 API
// GET /api/comments/:postId
export const getCommentList = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId,10);
        
        if (!notNativeNum(postId)) {
            return res.status(400).json({
                message : "invalid_post_id",
                data : null
            });
        }
        // 데이터베이스에서 postId에 해당하는 댓글 가져오기
        const query = `SELECT * FROM comments WHERE postId = ?;`;
        const [comments] = await req.db.query(query, [postId]);

        res.status(200).json({
            message: "get_comments_success",
            data: {
                comments: comments
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

// 댓글작성 API
// POST /api/comments/:postId
export const createComment = async (req, res) => {
    try {
        const {writerId, content} = req.body;
        const postId = parseInt(req.params.postId,10);
        // add 필요? : id 두개 있는지 확인.. 해야 할까? 어차피 이전 미들웨어에서 확인해주기는 하는데...
        
        if (!notNativeNum(postId)) {
            return res.status(400).json({
                message : "invalid_post_id",
                data : null
            });
        }
        let query = `Select * from posts where id = ?;`;
        const [posts] = await req.db.query(query, [postId]);

        if(posts.length === 0) {
            res.status(404).json({
                message: "not_a_single_post",
                data: null
            });
            return;
        }

        // add 필요: 댓글 생성 기능. + 생성된 댓글의 postId에 해당하는 post의 commentCount를 1 증가시키는 기능.
        query = `INSERT INTO comments (content, postId, writerId, date) VALUES (?, ?, ?, ?);`;
        await req.db.query(query, [content, postId, writerId, new Date()]);
        query = `UPDATE posts SET comment = comment + 1 WHERE id = ?;`;
        await req.db.query(query, [postId]);

        res.status(200).json({
            message: "create_comment_success",
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

// 댓글수정 API
// PATCH /api/comments/:commentId
export async function EditComment(req, res) {
    const commentId = parseInt(req.params.commentId,10);
    const {writerId, newContent} = req.body;
    if(!writerId || !newContent) {
        res.status(400).json({
            message: "writerId and newContent cannot be empty",
            data: null
        });
        return;
    }

    if(!await commentPermissionCheck(req, res, commentId, writerId))
        return;

    const query = `UPDATE comments SET content = ? WHERE id = ?;`;
    await req.db.query(query, [newContent, commentId]);

    res.status(200).json({
        message: "edit_comment_success",
        data: null
    });
    return;
}


// 댓글삭제 API
// DELETE /api/comments/:commentId
export async function deleteComment(req, res) {
    const commentId = parseInt(req.params.commentId,10);
    const {writerId} = req.body;

    if(!await commentPermissionCheck(req, res, commentId, writerId))
        return;

    let query;

    query = `SELECT postId FROM comments WHERE id = ?;`;
    const [comments] = await req.db.query(query, [commentId]);

    if(comments.length === 0) {
        res.status(404).json({
            message: "not_found_comment",
            data: null
        });
        return;
    }

    query = `UPDATE posts SET comment = comment - 1 WHERE id = ?;`;
    await req.db.query(query, [comments[0].postId]);

    query = `DELETE FROM comments WHERE id = ?;`;
    await req.db.query(query, [commentId]);

    res.status(200).json({
        message: "delete_comment_success",
        data: null
    });
}