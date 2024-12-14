import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // 최대 연결 수
  queueLimit: 0        // 대기열 제한
});

// export async function getPasswordById(db, userId) {
//     try {
//       // SQL 쿼리 실행
//       const [rows] = await db.query(
//         'SELECT password FROM Users WHERE id = ?',
//         [userId] // 조건에 사용할 값 (id)
//       );
    
//       // 결과 반환
//       if (rows.length > 0) {
//         console.log("rows", rows);
//         console.log("rows[0]", rows[0]);
//         return rows[0].password; // 첫 번째 행의 password 값 반환
//       } else {
//         return null; // 해당 ID가 없을 경우 null 반환
//       }
//     } catch (error) {
//       console.error('쿼리 실행 중 오류 발생:', error);
//       throw error;
//     } finally {
//       // 연결 해제 (MySQL Connection Pool 사용 시 생략 가능)
//       await db.end();
//     }
//   }
