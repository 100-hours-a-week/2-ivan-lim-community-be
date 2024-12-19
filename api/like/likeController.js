import {notNativeNum} from '../function/validCheck.js';

async function isLikeExist(db, userId, postId)
{
    const query = `SELECT COUNT(*) FROM likes_mapping WHERE userId = ${userId} AND postId = ${postId}`;
    const [result] = await db.query(query);

    if(result[0]['COUNT(*)'] === 0)
        return false;
    else
        return true;
}

export async function getMylikeState(req, res)
{
    const postId = parseInt(req.params.postId,10);
    const userId = parseInt(req.session.userId,10);

    // postId 양수인지 확인
    if (!notNativeNum(postId)) {
        res.status(400).json({
            message : "invalid_postId",
            data : null
        });
    }

    // 해당 postId를 갖는 post가 존재하는지 확인.
    let query = `SELECT * FROM posts WHERE id = ${postId}`;
    const [posts] = await req.db.query(query);

    if(posts.length === 0) {
        res.status(404).json({
            message : "not_found_post",
            data : null
        });
    }

    // likes_mapping 테이블에 해당 postId와 userId를 컬럼값으로 들고 있는 데이터가 있는 경우 true, 그렇지 않으면 false.
    const likeState = await isLikeExist(req.db, userId, postId);

    res.status(200).json({
        message : "get_like_state_success",
        data : {
            likeState : likeState
        }
    });
}

export async function toggleLike(req, res)
{
    const postId = parseInt(req.params.postId,10);
    const userId = parseInt(req.session.userId,10);

    // postId 양수인지 확인
    if (!notNativeNum(postId)) {
        res.status(400).json({
            message : "invalid_postId",
            data : null
        });
    }

    // 해당 postId를 갖는 post가 존재하는지 확인.
    let query = `SELECT * FROM posts WHERE id = ${postId}`;
    const [posts] = await req.db.query(query);

    if(posts.length === 0) {
        res.status(404).json({
            message : "not_found_post",
            data : null
        });
    }

    // likes_mapping 테이블에 해당 postId와 userId를 컬럼값으로 들고 있는 데이터가 있는 경우 삭제, 그렇지 않으면 등록.
    // -> 상태에 따라 delete or insert로 수정.

    if(await isLikeExist(req.db,userId, postId))
    {
        query = `
        DELETE FROM likes_mapping 
        WHERE userId = ${userId} AND postId = ${postId};

        UPDATE posts
        SET \`like\` = \`like\` - 1
        WHERE id = ${postId}
        `
    }
    else
    {
        query = `
        INSERT INTO likes_mapping (userId, postId)
        SELECT ${userId}, ${postId}
        WHERE NOT EXISTS (
            SELECT 1 FROM likes_mapping WHERE userId = ${userId} AND postId = ${postId}
        );

        UPDATE posts
        SET \`like\` = \`like\` + 1
        WHERE id = ${postId}
        `
    }
    try{
        await req.db.query(query);
        res.status(200).json({
            message : "toggle_like_success",
            data : null
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Internal Server Error",
            data : null
        });
    }

}