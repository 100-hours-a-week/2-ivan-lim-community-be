export async function isExistNickname(db, nickname)
{
    const query = `SELECT * FROM users WHERE nickname = '${nickname}'`;
        const [nicknameRows] = await db.query(query);

        if (nicknameRows.length > 0)
            return true;
        
        else 
            return false;
}

export async function isExistEmail(db, email)
{
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const [emailRows] = await db.query(query);

    if (emailRows.length > 0)
        return true;
    
    else 
        return false;
}