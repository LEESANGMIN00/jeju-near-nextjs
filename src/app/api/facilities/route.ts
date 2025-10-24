import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// MySQL 연결 설정
const dbConfig = {
  host: process.env.DB_HOST || "jejunear.cafe24app.com",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "your_username",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "jejunear",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export async function GET(request: Request) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "33.4996");
    const lng = parseFloat(searchParams.get("lng") || "126.5312");
    const radius = parseFloat(searchParams.get("radius") || "5"); // 5km
    const category = searchParams.get("category") || "";

    console.log("DB 연결 시도 중...", {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user ? "***" : "undefined",
    });
    
    console.log("환경변수 확인:", {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER ? "***" : "undefined",
      DB_PASSWORD: process.env.DB_PASSWORD ? "***" : "undefined",
      DB_NAME: process.env.DB_NAME,
    });

    // DB 연결
    connection = await mysql.createConnection(dbConfig);
    console.log("DB 연결 성공!");

    // 위치 기반 필터링 쿼리 (Haversine 공식 사용)
    let query = `
      SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance
      FROM facilities 
      WHERE (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) <= ?
    `;

    let params: any[] = [lat, lng, lat, lat, lng, lat, radius];

    // 카테고리 필터링 추가
    if (category && category !== "all") {
      query += ` AND category = ?`;
      params.push(category);
    }

    query += ` ORDER BY distance LIMIT 100`;

    const [rows] = (await connection.execute(query, params)) as [any[], any];

    console.log(
      `${lat}, ${lng} 기준 ${radius}km 반경에서 ${rows.length}개의 시설 데이터를 가져왔습니다.`
    );

    // 카테고리별 시설 수 로그
    if (category && category !== "all") {
      const categoryCount = rows.filter(
        (row: any) => row.category === category
      ).length;
      console.log(`카테고리 "${category}" 필터링 결과: ${categoryCount}개`);
    }

    // 모든 카테고리 분포 로그
    const categoryDistribution = rows.reduce((acc: any, row: any) => {
      acc[row.category] = (acc[row.category] || 0) + 1;
      return acc;
    }, {});
    console.log("카테고리 분포:", categoryDistribution);

    return NextResponse.json({
      success: true,
      data: rows,
      total: rows.length,
      center: { lat, lng },
      radius,
      category,
    });
  } catch (error) {
    console.error("DB 연결 또는 쿼리 오류:", error);

    return NextResponse.json(
      {
        success: false,
        error: "데이터베이스에서 데이터를 가져올 수 없습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  } finally {
    // 연결 종료
    if (connection) {
      await connection.end();
    }
  }
}
