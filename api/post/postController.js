// 게시글 목록조회 API
// GET /api/posts?offset=0&limit=10
import {notNativeNum} from '../function/validCheck.js';

export const listInquiry = async (req, res) => {
    try {
        const offset = req.query.offset;
        const limit = req.query.limit;

        // offset과 limit 유효성 검사
        if (!notNativeNum(offset) || !notNativeNum(limit)) {
            return res.status(400).json({
                message : "invalid_offset_or_limit",
                data : null
            });
        }
        
        // fix 필요: offset과 limit를 이용하여 posts를 조회하여 일부만 가져오도록. 일단은 다 가져오기.
        const response = await fetch('http://localhost:3030/data.json');
        if(!response.ok)
            throw(response);
        const data = await response.json();
        const posts = data.posts;

        
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
        const { title, content, image } = req.body;

        // 1. 제목, 내용입력하지 않은 경우 (이미지는 필수가 아님)
        if (!title || !content) {
            return res.status(400).json({
                message: "Title, Content cannot be empty",
                data: null
            });
        }

        // 2. 이미지 형식이 아닌 경우 
        // if (!imageValidChk(image)) {
        //     return res.status(400).json({
        //         message: "invalid_image",
        //         data: null
        //     });
        // }

        // 3. 게시글 추가 성공
        // add 필요 : post 요청하여 newPost 추가해주기.

        res.status(201).json({
            message: 'add_post_success',
            data: null // fix 필요 : post_id를 반환해주어야 함.
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
        const post_id = req.params.post_id;

        // fix 필요? : post_id 양수인지 확인
        // if (!notNativeNum(post_id)) {
        //     return res.status(400).json({
        //         message : "invalid_post_id",
        //         data : null
        //     });
        // }
        
        const response = await fetch('http://localhost:3030/data.json');
        if(!response.ok)
            throw(response);
        const data = await response.json();
        const post = data.posts.find(post => post.id === post_id);

        // 디버거 질문용 예시 코드
        // let like = 0;
        
        // // console.log(data.likes_mapping);
        // data.likes_mapping.forEach(like => {
        //     if(like.postId === post_id) {
        //         like++;
        //   // console.log(like)
        //     }
        // });
        // post.like = like;

        // like 수 조회하여 post.like에 저장
        let likeCount = 0;

        data.likes_mapping.forEach(like => {
            if(like.postId === post_id) {
                likeCount++;
            }
        });
        post.like = likeCount;

        if (!post) {
            return res.status(404).json({
                message : "not_found_post",
                data : null
            });
        }

        res.status(200).json({
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
        const post_id = req.params.post_id;
        const { newTitle, newContent, newImage } = req.body;
        

        // fix 필요? : post_id 양수인지 확인
        // if (!notNativeNum(post_id)) {
        //     return res.status(400).json({
        //         message : "invalid_post_id",
        //         data : null
        //     });
        // }

        // add 필요: post_id를 이용하여 posts를 조회하여 post_id에 해당하는 게시글을 수정하기.
        res.status(200).json({
            message: "edit_post_success",
            data: post_id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Internal Server Error",
            data : null
        });
    }
}

// 게시글 삭제 API
// DELETE /api/posts/:post_id
export function deletePost(req, res) {
    try {
        const post_id = req.params.post_id;

        // fix 필요? : post_id 양수인지 확인
        // if (!notNativeNum(post_id)) {
        //     return res.status(400).json({
        //         message : "invalid_post_id",
        //         data : null
        //     });
        // }

        // add 필요: post_id를 이용하여 posts를 조회하여 post_id에 해당하는 게시글을 삭제하기.
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