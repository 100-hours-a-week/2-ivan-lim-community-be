import mysql from "mysql2/promise";
import dotenv from 'dotenv';

export async function connectToDB() {
    try{
        dotenv.config();
    
        const db = mysql.createConnection({
            host: "localhost", // 데이터베이스 주소
            port: "3306", // 데이터베이스 포트
            user: "root", // 로그인 계정
            password: process.env.PASSWORD, // 비밀번호
            database: "my_db", // 엑세스할 데이터베이스
        });
        console.log("MySQL 연결 성공!");
        return db;
    }catch(err){
        console.error("MySQL 연결 실패:", err);
        throw err;
    }
}

export async function getPasswordById(db, userId) {
    try {
      // SQL 쿼리 실행
      const [rows] = await db.query(
        'SELECT password FROM Users WHERE id = ?',
        [userId] // 조건에 사용할 값 (id)
      );
  
      // 결과 반환
      if (rows.length > 0) {
        console.log("rows", rows);
        console.log("rows[0]", rows[0]);
        return rows[0].password; // 첫 번째 행의 password 값 반환
      } else {
        return null; // 해당 ID가 없을 경우 null 반환
      }
    } catch (error) {
      console.error('쿼리 실행 중 오류 발생:', error);
      throw error;
    } finally {
      // 연결 해제 (MySQL Connection Pool 사용 시 생략 가능)
      await db.end();
    }
  }