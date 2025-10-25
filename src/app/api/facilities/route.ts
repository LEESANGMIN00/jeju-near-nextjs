import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// Neon 연결 설정
const sql = neon(process.env.DATABASE_URL!);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "33.4996");
    const lng = parseFloat(searchParams.get("lng") || "126.5312");
    const radius = parseFloat(searchParams.get("radius") || "5"); // 5km
    const category = searchParams.get("category") || "";

    console.log("Neon DB 연결 시도 중...", {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    });

    console.log("환경변수 확인:", {
      DATABASE_URL: process.env.DATABASE_URL ? "***설정됨***" : "undefined",
    });

    // PostgreSQL 위치 기반 필터링 쿼리 (Haversine 공식 사용)
    let rows;

    if (category && category !== "all") {
      rows = await sql`
        SELECT *, 
        (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))) AS distance
        FROM facilities 
        WHERE (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))) <= ${radius}
        AND category = ${category}
        ORDER BY distance LIMIT 100
      `;
    } else {
      rows = await sql`
        SELECT *, 
        (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))) AS distance
        FROM facilities 
        WHERE (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(lng) - radians(${lng})) + sin(radians(${lat})) * sin(radians(lat)))) <= ${radius}
        ORDER BY distance LIMIT 100
      `;
    }

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
    console.error("Neon DB 연결 또는 쿼리 오류:", error);

    return NextResponse.json(
      {
        success: false,
        error: "데이터베이스에서 데이터를 가져올 수 없습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
