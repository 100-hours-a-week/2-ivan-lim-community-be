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
    if (!variable || variable < 0 || !Number.isInteger(Number(variable))) {
        return false;
    }
    else 
        return true;
}

// add 필요: 이미지 유효성 검사
// export function imageValidChk(image) {
// }

export async function postPermissionCheck(res, post_id, user_id)
{
    // post_id 양수인지 확인
    if (!notNativeNum(post_id)) {
        return res.status(400).json({
            message : "invalid_post_id",
            data : null
        });
    }

    const response = await fetch('http://localhost:3030/data.json');
        if(!response.ok)
            throw(response);
        const jsonRes = await response.json();
        const posts = jsonRes.posts;
        const post = posts.find(post => post.id === post_id);
        if(!post) {
            return res.status(404).json({
                message : "not_found_post",
                data : null
            });
        }
        if(post.writerId !== user_id) {
            return res.status(403).json({
                message : "required_permission",
                data : null
            });
        }
}