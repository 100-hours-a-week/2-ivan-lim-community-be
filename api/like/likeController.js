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
        return false
    }

    // 해당 postId를 갖는 post가 존재하는지 확인.
    let query = `SELECT * FROM posts WHERE id = ${postId}`;
    const [posts] = await req.db.query(query);

    if(posts.length === 0) {
        res.status(404).json({
            message : "not_found_post",
            data : null
        });
        return false;
    }

    // likes_mapping 테이블에 해당 postId와 userId를 컬럼값으로 들고 있는 데이터가 있는 경우 삭제, 그렇지 않으면 등록.
    query = `
    START TRANSACTION;

    DELETE FROM likes_mapping 
    WHERE userId = ${userId} AND postId = ${postId};

    UPDATE posts
    SET likes_count = likes_count - 1
    WHERE id = ${postId}
    AND EXISTS (
        SELECT 1 FROM likes_mapping WHERE userId = ${userId} AND postId = ${postId}
    );

    INSERT INTO likes_mapping (userId, postId)
    SELECT ${userId}, ${postId}
    WHERE NOT EXISTS (
        SELECT 1 FROM likes_mapping WHERE userId = ${userId} AND postId = ${postId}
    );

    UPDATE posts
    SET likes_count = likes_count + 1
    WHERE id = ${postId}
    AND NOT EXISTS (
        SELECT 1 FROM likes_mapping WHERE userId = ${userId} AND postId = ${postId}
    );

    COMMIT;`

    await req.db.query(query);
}