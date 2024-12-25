import {notNativeNum} from '../function/validCheck.js';
import { dirname} from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// 댓글조회 API
// GET /api/comments/:postId
export const getCommentList = async (req, res) => {
        const postId = parseInt(req.params.postId,10);
        const __dirname = dirname(fileURLToPath(import.meta.url));
        fs.readFile(__dirname + '/../../data.json', 'utf8', (err, data) => {
            if(err) {
                console.error(err);
                res.status(500).json({
                    message: "Internal Server Error",
                    data : null
                });
                return;
            }
            const jsonData = JSON.parse(data);
            const comments = jsonData.comments.filter(comment => comment.postId === postId);
            res.status(200).json({
                message: "get_comments_success",
                data: comments
            });
        }
        );
    }

// 댓글작성 API
// POST /api/comments/:postId
export const createComment = async (req, res) => {
        const postId = parseInt(req.params.postId,10);

        if (!notNativeNum(postId)) {
            return res.status(400).json({
                message : "invalid_post_id",
                data : null
            });
        }
        const __dirname = dirname(fileURLToPath(import.meta.url));
        fs.readFile(__dirname + '/../../data.json', 'utf8', (err, data) => {
            if(err) {
                console.error(err);
                res.status(500).json({
                    message: "Internal Server Error",
                    data : null
                });
                return;
            }
            const jsonData = JSON.parse(data);
            const post = jsonData.posts.find(post => post.id === postId);
            if(!post) {
                res.status(404).json({
                    message: "not_a_single_post",
                    data: null
                });
                return;
            }
            res.status(200).json({
                message: "create_comment_success",
                data: null
            });
        });
}

// 댓글수정 API
// PATCH /api/comments/:commentId
export async function EditComment(req, res) {
    const commentId = parseInt(req.params.commentId,10);
    const { content } = req.body;
    const __dirname = dirname(fileURLToPath(import.meta.url));
    fs.readFile(__dirname + '/../../data.json', 'utf8', (err, data) => {
        if(err) {
            console.error(err);
            res.status(500).json({
                message: "Internal Server Error",
                data : null
            });
            return;
        }
        const jsonData = JSON.parse(data);
        const comment = jsonData.comments.find(comment => comment.id === commentId);
        if(!comment) {
            res.status(404).json({
                message: "comment_not_found",
                data: null
            });
            return;
        }

        if(!req.session.userId === comment.writerId) // 댓글 주인 맞는지 확인
        {
            res.status(403).json({
                message: "required_permission",
                data: null
            });
            return;
        }
        // add 필요: 댓글 수정 기능.
        res.status(200).json({
            message: "edit_comment_success",
            data: null
        });
        return;
    });
}


// 댓글삭제 API
// DELETE /api/comments/:commentId
export async function deleteComment(req, res) {
    const commentId = parseInt(req.params.commentId,10);
    const __dirname = dirname(fileURLToPath(import.meta.url));
    fs.readFile(__dirname + '/../../data.json', 'utf8', (err, data) => {
        if(err) {
            console.error(err);
            res.status(500).json({
                message: "Internal Server Error",
                data : null
            });
            return;
        }
        const jsonData = JSON.parse(data);
        const comment = jsonData.comments.find(comment => comment.id === commentId);

        if(!comment) {
            res.status(404).json({
                message: "comment_not_found",
                data: null
            });
        }

        if(!req.session.userId === comment.writerId) // 댓글 주인 맞는지 확인
        {
            res.status(403).json({
                message: "required_permission",
                data: null
            });
            return;
        }

        // add 필요: 댓글 삭제 기능. + 삭제된 댓글의 postId에 해당하는 post의 commentCount를 1 감소시키는 기능.

        res.status(200).json({
            message: "delete_comment_success",
            data: null
        });
        return;
    });
}