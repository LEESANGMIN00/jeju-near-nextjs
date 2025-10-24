"use client";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // sea1234 배경 이미지들
  const backgroundImages = [
    "/images/backgrounds/sea1.jpg",
    "/images/backgrounds/sea2.jpg",
    "/images/backgrounds/sea3.jpg",
    "/images/backgrounds/sea4.jpg",
  ];

  // 3초마다 배경 이미지 변경
  useEffect(() => {
    console.log("배경 슬라이드쇼 시작");
    console.log("배경 이미지 목록:", backgroundImages);

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % backgroundImages.length;
        console.log(
          `배경 이미지 변경: ${prevIndex} -> ${nextIndex}, 이미지: ${backgroundImages[nextIndex]}`
        );
        return nextIndex;
      });
    }, 3000);

    return () => {
      console.log("배경 슬라이드쇼 정리");
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 이미지 슬라이드쇼 - 더 강력한 설정 */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => {
          const isActive = index === currentImageIndex;
          console.log(`배경 이미지 ${index}: ${image}, 활성: ${isActive}`);
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-70" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%",
              }}
              onError={() => console.error(`배경 이미지 로드 실패: ${image}`)}
            ></div>
          );
        })}
      </div>

      {/* 그라데이션 오버레이 - 살짝만 진하게 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-cyan-100/60 z-10"></div>
      {/* 헤더 */}
      <div className="relative z-30">
        <Header />
      </div>

      {/* 메인 콘텐츠 */}
      <main className="relative z-30 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 히어로 섹션 */}
        <section className="text-center mb-20">
          <div className="mb-16">
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-6 drop-shadow-lg">
                제주편의시설
              </h1>
              <div className="absolute -top-4 -right-4 text-6xl opacity-20">
                🏝️
              </div>
            </div>
            <p className="text-xl sm:text-2xl text-black/90 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
              제주도 여행 중 필요한 편의시설을 쉽고 빠르게 찾아보세요.
            </p>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              href="/map"
              className="group relative bg-white/20 backdrop-blur-md border border-white/30 text-black px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl hover:shadow-white/30 transform hover:-translate-y-2 transition-all duration-500 flex items-center gap-4 overflow-hidden hover:bg-white/30"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              <span className="text-3xl relative z-10">🗺️</span>
              <span className="relative z-10">지도에서 찾기</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300 relative z-10 text-2xl">
                →
              </span>
            </Link>
          </div>

          {/* 기능 소개 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="font-bold text-black text-lg mb-2 drop-shadow-lg">
                위치 기반
              </h3>
              <p className="text-black/80 text-sm">현재 위치 기준 검색</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🏷️</span>
              </div>
              <h3 className="font-bold text-black text-lg mb-2 drop-shadow-lg">
                카테고리별
              </h3>
              <p className="text-black/80 text-sm">원하는 시설만 선택</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">📏</span>
              </div>
              <h3 className="font-bold text-black text-lg mb-2 drop-shadow-lg">
                범위 설정
              </h3>
              <p className="text-black/80 text-sm">1km, 5km, 10km</p>
            </div>
          </div>
        </section>

        {/* 편의시설 카테고리 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 drop-shadow-lg">
              찾을 수 있는 편의시설
            </h2>
            <p className="text-black/80 text-lg">
              8가지 카테고리의 편의시설을 찾아보세요
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* 마트 */}
            <div className="group bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40 text-center hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-base font-bold text-black">마트</h3>
            </div>

            {/* 화장실 */}
            <div className="group bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40 text-center hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🚿</span>
              </div>
              <h3 className="text-base font-bold text-black">화장실</h3>
            </div>

            {/* 주유소 */}
            <div className="group bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40 text-center hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">⛽</span>
              </div>
              <h3 className="text-base font-bold text-black">주유소</h3>
            </div>

            {/* 충전소 */}
            <div className="group bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40 text-center hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🔌</span>
              </div>
              <h3 className="text-base font-bold text-black">충전소</h3>
            </div>

            {/* 클린하우스 */}
            <div className="group bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40 text-center hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-base font-bold text-black">클린하우스</h3>
            </div>

            {/* 은행 */}
            <div className="group bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40 text-center hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🏦</span>
              </div>
              <h3 className="text-base font-bold text-black">은행</h3>
            </div>

            {/* 편의점 */}
            <div className="group bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40 text-center hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-base font-bold text-black">편의점</h3>
            </div>

            {/* 시장 */}
            <div className="group bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/40 text-center hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-white/40">
              <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                <span className="text-3xl">🏬</span>
              </div>
              <h3 className="text-base font-bold text-black">시장</h3>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <div className="relative z-30">
        <Footer className="mt-16" />
      </div>
    </div>
  );
}
