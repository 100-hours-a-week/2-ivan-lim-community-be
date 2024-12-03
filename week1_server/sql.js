import mysql from 'mysql2';
import dotenv from 'dotenv';
import colors from 'colors';
import moment from 'moment';

dotenv.config();

function logSQL(query) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss'); // SQL 실행 시간
    console.log(`[${time}]`.cyan, `SQL Query: ${query}`.blue);
}

const connection = mysql.createConnection({
    host: "localhost", // 데이터베이스 주소
    port: "3306", // 데이터베이스 포트
    user: "root", // 로그인 계정
    password: process.env.PASSWORD, // 비밀번호
    database: "my_db", // 엑세스할 데이터베이스
});

connection.connect();

let query='SELECT * from Users';

connection.query(query, (error, rows, fields) => {
    if (error) 
        throw error;
    logSQL(query);
    console.log(`User info is: ${JSON.stringify(rows, null, 2)}`.green);
});

connection.end();
