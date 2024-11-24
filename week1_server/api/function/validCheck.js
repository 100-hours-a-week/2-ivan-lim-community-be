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
