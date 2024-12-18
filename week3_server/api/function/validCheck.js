export function emailValidChk(email) {
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

    if(pattern.test(email) === false) 
        return false; 
    else 
        return true;
}

export function nicknameValidChk(nickname) {
    if (nickname.length > 10 || nickname.includes(' ')) {
        return false;
    }
    else {
        return true;
    }
}

export function passwordValidChk(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(password);
}

export function notNativeNum(variable){
    if (typeof variable !== "number" || isNaN(variable)) {
        return false; // 숫자가 아니면 false
    }

    // 음수가 아닌지 확인
    return variable >= 0;
}

// add 필요: 이미지 유효성 검사
// export function imageValidChk(image) {
// }

export async function postPermissionCheck(req, res, post_id, user_id)
{
    // post_id 양수인지 확인
    if (!notNativeNum(post_id)) {
        return res.status(400).json({
            message : "invalid_post_id",
            data : null
        });
    }

    // '세션의 user_id' 와 'post_id의 writerId'가 일치하는지 확인
    const query = `SELECT * FROM posts WHERE id = ${post_id}`;
    const [posts] = await req.db.query(query);
    if(posts.length === 0) {
        return res.status(404).json({
            message : "not_found_post",
            data : null
        });
    }
    const post = posts[0];

    if(post.writerId !== user_id) {
        return res.status(403).json({
            message : "required_permission",
            data : null
        });
    }
}