"use client";
import { useState, useEffect } from "react";
import KakaoMap from "@/components/KakaoMap";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type RegionMode = "jeju" | "other" | "auto";

export default function Map() {
  const [regionMode, setRegionMode] = useState<RegionMode>("auto");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  // 지역 감지 함수
  const detectRegion = async () => {
    try {
      // 1. 현재 위치 가져오기 시도
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });

      // 2. 제주도 범위 체크 (대략적인 좌표 범위)
      const isInJeju =
        latitude >= 33.1 &&
        latitude <= 33.6 &&
        longitude >= 126.1 &&
        longitude <= 127.0;

      setRegionMode(isInJeju ? "jeju" : "other");
    } catch (error) {
      console.log("위치 접근 불가, 제주도 모드로 설정");
      setRegionMode("jeju");
    } finally {
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    detectRegion();
  }, []);

  const handleModeChange = (mode: RegionMode) => {
    setRegionMode(mode);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* 헤더 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-black mb-4">
            제주편의시설 🏝️
          </h1>

          {/* 모드 전환 UI */}
          <div className="mb-6">
            {isDetecting ? (
              <div className="text-lg text-gray-600 mb-4">
                🔍 위치를 확인하고 있습니다...
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <div className="text-lg text-gray-600">
                  {regionMode === "jeju"
                    ? "🏝️ 제주도에서 접속 중"
                    : "🗺️ 제주도 여행 계획 중"}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleModeChange("jeju")}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      regionMode === "jeju"
                        ? "bg-blue-500 text-white shadow-lg transform scale-105"
                        : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏝️</span>
                      <div className="text-left">
                        <div className="font-bold">제주도 모드</div>
                        <div className="text-xs opacity-80">현재 위치 기반</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleModeChange("other")}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                      regionMode === "other"
                        ? "bg-green-500 text-white shadow-lg transform scale-105"
                        : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🗺️</span>
                      <div className="text-left">
                        <div className="font-bold">여행 계획 모드</div>
                        <div className="text-xs opacity-80">지도 클릭 기반</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {regionMode === "jeju"
              ? "제주도 여행 중 필요한 편의시설을 쉽게 찾아보세요."
              : "제주도 여행 계획을 세우거나 제주도 관광 정보를 확인해보세요."}
            <br />
            <span className="text-blue-600 font-medium">
              {regionMode === "jeju"
                ? "현재 위치 기준 1km, 5km, 10km 반경"
                : "제주도 내 클릭한 위치 기준으로 검색"}
            </span>
            의 시설을 확인할 수 있습니다.
          </p>
        </div>

        {/* 지도 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-6 border border-white/20">
          <KakaoMap
            width="100%"
            height="600px"
            className="sm:h-[800px] lg:h-[900px]"
            regionMode={regionMode}
            userLocation={userLocation}
          />
        </div>

        {/* 편의시설 안내 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">마트</h3>
              <p className="text-sm text-gray-600">
                생활용품과 식료품을 구입할 수 있는 마트입니다.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚿</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                화장실
              </h3>
              <p className="text-sm text-gray-600">
                깨끗한 공중화장실 정보를 제공합니다.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⛽</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                주유소
              </h3>
              <p className="text-sm text-gray-600">
                렌터카 이용 시 필요한 주유소 정보입니다.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔌</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                전기차충전소
              </h3>
              <p className="text-sm text-gray-600">
                전기차 충전이 가능한 충전소 정보입니다.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                클린하우스
              </h3>
              <p className="text-sm text-gray-600">
                깨끗하고 편리한 클린하우스 정보입니다.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">은행</h3>
              <p className="text-sm text-gray-600">
                금융 서비스를 이용할 수 있는 은행 정보입니다.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏪</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                편의점
              </h3>
              <p className="text-sm text-gray-600">
                24시간 이용 가능한 편의점 정보입니다.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">시장</h3>
              <p className="text-sm text-gray-600">
                제주 특산품과 신선한 식재료를 구입할 수 있는 시장입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 사용법 안내 */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {regionMode === "jeju"
              ? "사용법 안내 📱"
              : "제주도 여행 계획 사용법 🗺️"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regionMode === "jeju" ? (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    위치 확인
                  </h3>
                  <p className="text-sm text-gray-600">
                    우측 상단 📍 버튼을 눌러 현재 위치를 확인하세요
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    카테고리 & 범위 선택
                  </h3>
                  <p className="text-sm text-gray-600">
                    상단에서 원하는 편의시설과 검색 범위를 선택하세요
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    상세 정보 확인
                  </h3>
                  <p className="text-sm text-gray-600">
                    마커를 클릭하거나 하단 목록에서 상세 정보를 확인하세요
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    관심 지역 클릭
                  </h3>
                  <p className="text-sm text-gray-600">
                    제주도 지도에서 관심 있는 지역을 클릭하세요
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    카테고리 & 범위 선택
                  </h3>
                  <p className="text-sm text-gray-600">
                    상단에서 원하는 편의시설과 검색 범위를 선택하세요
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    여행 계획 세우기
                  </h3>
                  <p className="text-sm text-gray-600">
                    클릭한 위치 주변의 편의시설을 확인하여 여행 계획을 세우세요
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <Footer className="mt-16" />
    </div>
  );
}
