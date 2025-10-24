"use client";
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  width?: string;
  height?: string;
  className?: string;
  regionMode?: "jeju" | "other" | "auto";
  userLocation?: { lat: number; lng: number } | null;
}

interface Facility {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  phone: string;
  operating_hours: string;
  is_open_all_year: string;
  distance?: number;
}

const KAKAO_SRC = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
  process.env.NEXT_PUBLIC_KAKAO_API_KEY ||
  "15bb41100fd43f80b4123f5ea31586d7"
}&autoload=false`;

// 편의시설 아이콘 생성 함수 (이모지 사용)
const getMarkerIcon = (category: string): string => {
  switch (category) {
    case "마트":
      return "🛒";
    case "화장실":
      return "🚿";
    case "주유소":
      return "⛽";
    case "전기차충전소":
      return "🔌";
    case "클린하우스":
      return "🏠";
    case "은행":
      return "🏦";
    case "편의점":
      return "🏪";
    case "시장":
      return "🥬";
    default:
      return "📍";
  }
};

const KakaoMap: React.FC<KakaoMapProps> = ({
  width = "100%",
  height = "500px",
  className = "",
  regionMode = "auto",
  userLocation = null,
}) => {
  // ✅ ref 기반 오버레이 관리 (state 사용하지 않음)
  const facilityMarkersRef = useRef<any[]>([]);
  const clickMarkerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const infoWindowsRef = useRef<any[]>([]);
  const clickHandlerRef = useRef<((e: any) => void) | null>(null);
  const clickedLocationRef = useRef<{ lat: number; lng: number } | null>(null);
  const currentLocationMarkerRef = useRef<any>(null);

  // 상태 관리 (UI용만)
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [userLocationState, setUserLocationState] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRadius, setSelectedRadius] = useState<number>(5);

  // ref로도 관리하여 클로저 문제 해결
  const selectedCategoryRef = useRef<string>("all");
  const selectedRadiusRef = useRef<number>(5);

  // refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const isProcessingRef = useRef<boolean>(false);

  // ✅ 시설 마커 + 인포윈도우 제거
  const clearFacilityMarkers = () => {
    console.log("🧹 시설 마커 정리 시작");
    facilityMarkersRef.current.forEach((m) => {
      if (m?.setMap) {
        m.setMap(null);
      }
    });
    facilityMarkersRef.current = [];

    infoWindowsRef.current.forEach((iw) => {
      if (iw?.close) {
        iw.close();
      }
    });
    infoWindowsRef.current = [];
    console.log("🧹 시설 마커 정리 완료");
  };

  // ✅ 클릭 마커 + 반경원 제거
  const clearClickMarkerAndCircle = () => {
    console.log("🧹 클릭 마커와 반경원 정리 시작");
    if (clickMarkerRef.current) {
      clickMarkerRef.current.setMap(null);
      clickMarkerRef.current = null;
    }
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
    console.log("🧹 클릭 마커와 반경원 정리 완료");
  };

  // ✅ 현재 위치 마커 생성
  const createCurrentLocationMarker = (
    lat: number,
    lng: number,
    mapInstance: any
  ) => {
    console.log(`📍 현재 위치 마커 생성: ${lat}, ${lng}`);

    // 기존 현재 위치 마커 제거
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
    }

    // 현재 위치 마커 생성
    const currentLocationMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(lat, lng),
      map: mapInstance,
      title: "현재 위치",
    });

    // 현재 위치 마커 스타일 설정 (완전 안전한 방식)
    const currentLocationSVG = `
      <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="12" fill="#3b82f6" stroke="white" stroke-width="3"/>
        <text x="15" y="20" text-anchor="middle" font-size="12" fill="white" font-weight="bold">📍</text>
      </svg>
    `;

    // UTF-8 안전한 base64 인코딩
    const base64String = btoa(unescape(encodeURIComponent(currentLocationSVG)));

    const markerImage = new window.kakao.maps.MarkerImage(
      `data:image/svg+xml;base64,${base64String}`,
      new window.kakao.maps.Size(30, 30),
      { offset: new window.kakao.maps.Point(15, 15) }
    );

    currentLocationMarker.setImage(markerImage);
    currentLocationMarkerRef.current = currentLocationMarker;

    console.log("📍 현재 위치 마커 생성 완료");
  };

  // ✅ 반경원은 항상 같은 ref를 재사용
  const drawRadiusCircle = (
    lat: number,
    lng: number,
    radiusKm: number,
    mapInstance: any
  ) => {
    console.log(`🎯 반경원 그리기: ${lat}, ${lng}, ${radiusKm}km`);

    // 기존 원 제거
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    // 새 원 생성
    const circle = new window.kakao.maps.Circle({
      center: new window.kakao.maps.LatLng(lat, lng),
      radius: radiusKm * 1000,
      strokeWeight: 2,
      strokeColor: "#3b82f6",
      strokeOpacity: 0.8,
      fillColor: "#3b82f6",
      fillOpacity: 0.1,
    });
    circle.setMap(mapInstance);
    circleRef.current = circle;
    console.log("🎯 반경원 생성 완료");
  };

  // ✅ 시설 마커 생성 (state 쓰지 말고 ref에만 push)
  const createFacilityMarkers = (facilities: Facility[], mapInstance: any) => {
    console.log(`🏗️ 시설 마커 생성 시작: ${facilities.length}개`);
    clearFacilityMarkers(); // ← 항상 먼저 싹 지우기

    facilities.forEach((fac, index) => {
      console.log(`🏗️ 마커 생성 중: ${fac.name} (${fac.category})`);
      const pos = new window.kakao.maps.LatLng(fac.lat, fac.lng);

      // API에서 이미 카테고리 필터링이 완료되었으므로 클라이언트 측 필터링 제거
      console.log(`✅ 마커 생성: ${fac.name} (${fac.category})`);

      // 카테고리별 색상 설정
      let markerColor = "#3b82f6";

      switch (fac.category) {
        case "마트":
          markerColor = "#10b981";
          break;
        case "화장실":
          markerColor = "#8b5cf6";
          break;
        case "주유소":
          markerColor = "#f59e0b";
          break;
        case "전기차충전소":
          markerColor = "#ef4444";
          break;
        case "클린하우스":
          markerColor = "#06b6d4";
          break;
        case "은행":
          markerColor = "#84cc16";
          break;
        case "편의점":
          markerColor = "#f97316";
          break;
        case "시장":
          markerColor = "#ec4899";
          break;
      }

      // 편의시설 아이콘 생성
      const markerIcon = getMarkerIcon(fac.category);

      // 이모지를 포함한 SVG 생성
      const svgString = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${markerColor}" stroke="white" stroke-width="3"/>
          <text x="20" y="26" text-anchor="middle" font-size="16" fill="white" font-family="Arial, sans-serif" font-weight="bold">${markerIcon}</text>
           </svg>
         `;

      // UTF-8 안전한 base64 인코딩
      const base64String = btoa(unescape(encodeURIComponent(svgString)));

      const markerImage = new window.kakao.maps.MarkerImage(
        `data:image/svg+xml;base64,${base64String}`,
        new window.kakao.maps.Size(40, 40),
        { offset: new window.kakao.maps.Point(20, 20) }
      );

      const marker = new window.kakao.maps.Marker({
        position: pos,
        map: mapInstance,
        image: markerImage,
        title: fac.name,
      });

      // 상세 정보 인포윈도우 생성 (더 명확하고 보기 좋게)
      const infoContent = `
        <div style="padding: 16px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 250px; max-width: 350px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 20px; margin-right: 8px;">${getMarkerIcon(
              fac.category
            )}</span>
            <div style="font-size: 18px; font-weight: 700; color: #1f2937;">
              ${fac.name}
            </div>
          </div>
          <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px; padding: 8px 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #3b82f6;">
            📍 ${fac.address}
          </div>
          ${
            fac.phone
              ? `
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px; padding: 8px 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #10b981;">
              📞 ${fac.phone}
            </div>
          `
              : ""
          }
          ${
            fac.operating_hours
              ? `
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px; padding: 8px 12px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #f59e0b;">
              🕒 ${fac.operating_hours}
            </div>
          `
              : ""
          }
          <div style="font-size: 12px; color: #9ca3af; margin-top: 12px; text-align: center; padding: 6px 12px; background: #f1f5f9; border-radius: 6px;">
            ${fac.category} ${
        fac.distance ? `• ${fac.distance.toFixed(1)}km` : ""
      }
          </div>
        </div>
      `;

      const iw = new window.kakao.maps.InfoWindow({
        content: infoContent,
        removable: true,
        zIndex: 1000,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        console.log(`🖱️ 마커 클릭: ${fac.name}`);

        // 기존에 열린 모든 인포윈도우 닫기
        infoWindowsRef.current.forEach((infoWindow) => {
          if (infoWindow && infoWindow.close) {
            infoWindow.close();
          }
        });

        // 마커 위치에 직접 인포윈도우 표시
        const markerPosition = marker.getPosition();

        // 새 인포윈도우 열기 (마커 위치에 직접)
        iw.open(mapInstance, marker);
        console.log(`📋 인포윈도우 열기: ${fac.name}`);

        // 인포윈도우가 확실히 보이도록 지도 중심을 마커로 이동
        mapInstance.panTo(markerPosition);
      });

      facilityMarkersRef.current.push(marker);
      infoWindowsRef.current.push(iw);
    });

    console.log(
      `🏗️ 시설 마커 생성 완료: ${facilityMarkersRef.current.length}개`
    );
  };

  // ✅ 클릭 리스너 등록
  const attachClickHandler = (mapInstance: any) => {
    console.log("🎯 클릭 핸들러 등록");

    // 기존 핸들러가 있으면 제거
    if (clickHandlerRef.current) {
      window.kakao.maps.event.removeListener(
        mapInstance,
        "click",
        clickHandlerRef.current
      );
      clickHandlerRef.current = null;
    }

    // 새 핸들러 생성 (레퍼런스를 ref에 저장!)
    clickHandlerRef.current = async (mouseEvent: any) => {
      const latlng = mouseEvent.latLng;
      const lat = latlng.getLat();
      const lng = latlng.getLng();

      console.log(`🖱️ 지도 클릭: ${lat}, ${lng}`);

      // 제주 범위 체크
      if (!(lat >= 33.1 && lat <= 33.6 && lng >= 126.1 && lng <= 127.0)) {
        alert("제주도 내에서 클릭해주세요!");
        return;
      }

      console.log(`🖱️ 클릭된 모드: ${regionMode}`);

      // 중복 처리 방지
      if (isProcessingRef.current) {
        return;
      }
      isProcessingRef.current = true;

      try {
        // ✅ 새 요청 전에 기존 클릭 마커/원/시설마커 싹 정리
        clearClickMarkerAndCircle();
        clearFacilityMarkers();

        // 클릭 마커 1개만 유지
        clickMarkerRef.current = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(lat, lng),
          map: mapInstance,
          title: "선택한 위치",
        });

        // 반경원 그리기 (선택된 반경으로)
        console.log(
          `🎯 클릭 위치: ${lat}, ${lng}, 선택된 반경: ${selectedRadiusRef.current}km`
        );
        drawRadiusCircle(lat, lng, selectedRadiusRef.current, mapInstance);

        // 클릭한 위치 저장
        clickedLocationRef.current = { lat, lng };

        // 시설 로드 후 마커 생성
        console.log(
          `🔍 시설 검색: 반경 ${selectedRadiusRef.current}km, 카테고리: ${selectedCategoryRef.current}`
        );
        const list = await loadFacilities(
          lat,
          lng,
          selectedCategoryRef.current,
          selectedRadiusRef.current
        );
        console.log(`📊 검색 결과: ${list.length}개 시설 발견`);

        // 카테고리별 분포 로그
        const categoryDistribution = list.reduce((acc: any, facility: any) => {
          acc[facility.category] = (acc[facility.category] || 0) + 1;
          return acc;
        }, {});
        console.log("받은 데이터 카테고리 분포:", categoryDistribution);

        createFacilityMarkers(list, mapInstance);
        setFacilities(list);

        // 제주도 모드에서는 현재 위치 마커도 유지
        if (regionMode === "jeju" && userLocation) {
          createCurrentLocationMarker(
            userLocation.lat,
            userLocation.lng,
            mapInstance
          );
        }
      } finally {
        isProcessingRef.current = false;
      }
    };

    window.kakao.maps.event.addListener(
      mapInstance,
      "click",
      clickHandlerRef.current
    );
  };

  // ✅ 필요할 때 리스너 해제
  const detachClickHandler = (mapInstance: any) => {
    console.log("🎯 클릭 핸들러 해제");
    if (clickHandlerRef.current) {
      window.kakao.maps.event.removeListener(
        mapInstance,
        "click",
        clickHandlerRef.current
      );
      clickHandlerRef.current = null;
    }
  };

  // 시설 데이터 로드
  const loadFacilities = async (
    lat: number,
    lng: number,
    category: string,
    radius: number
  ): Promise<Facility[]> => {
    try {
      const url = `/api/facilities?lat=${lat}&lng=${lng}&radius=${radius}&category=${category}`;
      console.log("API 호출 파라미터:", { lat, lng, radius, category, url });

      const response = await fetch(url);
      console.log("API 응답 상태:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API 응답 데이터:", data);

      if (data.success && data.data) {
        console.log(`${data.data.length}개의 시설 데이터를 가져왔습니다.`);
        return data.data;
      } else {
        console.log("API 응답에서 데이터를 찾을 수 없습니다.");
        return [];
      }
    } catch (error) {
      console.error("시설 데이터 로드 중 오류:", error);
      return [];
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  };

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = () => {
      if (mapInstanceRef.current) return;

      // Kakao Maps SDK가 완전히 로드되었는지 확인
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng) {
        console.log("Kakao Maps SDK 로딩 대기 중...");
        setTimeout(initializeMap, 300);
        return;
      }

      const container = mapRef.current;
      if (!container) {
        console.error("지도 컨테이너를 찾을 수 없습니다");
        return;
      }

      try {
        const options = {
          center: new window.kakao.maps.LatLng(33.4996, 126.5312), // 제주도 중심
          level: 8,
          draggable: true, // 드래그 가능
          scrollwheel: true, // 마우스 휠 줌 가능
          disableDoubleClick: false, // 더블클릭 줌 가능
          disableDoubleClickZoom: false, // 더블클릭 줌 비활성화 해제
        };

        const mapInstance = new window.kakao.maps.Map(container, options);
        mapInstanceRef.current = mapInstance;
        console.log("지도 초기화 완료");
      } catch (error) {
        console.error("지도 초기화 실패:", error);
        // 실패 시 다시 시도
        setTimeout(initializeMap, 1000);
      }
    };

    // SDK 로딩 완료 후 초기화 시도
    setTimeout(initializeMap, 500);
  }, []);

  // 모드 전환 시 정리
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    console.log(`🔄 모드 전환: ${regionMode}`);

    if (regionMode === "other") {
      attachClickHandler(mapInstanceRef.current);
      // 화면 초기화
      clearClickMarkerAndCircle();
      clearFacilityMarkers();
    } else if (regionMode === "jeju") {
      // 제주도 모드에서도 클릭 가능하게 설정
      attachClickHandler(mapInstanceRef.current);
      // 현재 위치 마커는 유지하고 클릭한 위치 마커만 제거
      if (clickMarkerRef.current) {
        clickMarkerRef.current.setMap(null);
        clickMarkerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    } else {
      detachClickHandler(mapInstanceRef.current);
      clearClickMarkerAndCircle();
      clearFacilityMarkers();
    }
  }, [regionMode]);

  // 반경/카테고리 변경 시 동작
  useEffect(() => {
    // ref 업데이트
    selectedCategoryRef.current = selectedCategory;
    selectedRadiusRef.current = selectedRadius;

    if (
      !mapInstanceRef.current ||
      regionMode !== "other" ||
      !clickedLocationRef.current
    )
      return;

    const { lat, lng } = clickedLocationRef.current;
    console.log(
      `🔄 범위/카테고리 변경: ${lat}, ${lng}, 카테고리: ${selectedCategory}, 반경: ${selectedRadius}km`
    );

    // 반경원 갱신(이전 원 제거는 drawRadiusCircle 내부에서 함)
    drawRadiusCircle(lat, lng, selectedRadius, mapInstanceRef.current);

    // 시설 마커만 교체
    (async () => {
      clearFacilityMarkers();
      const list = await loadFacilities(
        lat,
        lng,
        selectedCategory,
        selectedRadius
      );
      createFacilityMarkers(list, mapInstanceRef.current);
      setFacilities(list);
    })();
  }, [selectedRadius, selectedCategory, regionMode]);

  // 제주도 모드에서 현재 위치 기반 시설 검색
  useEffect(() => {
    if (!mapInstanceRef.current || regionMode !== "jeju" || !userLocation)
      return;

    const { lat, lng } = userLocation;
    console.log(`🏠 제주도 모드 - 현재 위치: ${lat}, ${lng}`);

    // 기존 모든 요소 정리
    clearClickMarkerAndCircle();
    clearFacilityMarkers();

    // 현재 위치 마커 표시
    createCurrentLocationMarker(lat, lng, mapInstanceRef.current);

    // 현재 위치 기반 시설 검색
    (async () => {
      const list = await loadFacilities(
        lat,
        lng,
        selectedCategory,
        selectedRadius
      );
      createFacilityMarkers(list, mapInstanceRef.current);
      setFacilities(list);
    })();
  }, [userLocation, selectedCategory, selectedRadius, regionMode]);

  // Kakao Maps SDK 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadKakaoMaps = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng) {
        console.log("Kakao Maps SDK 이미 완전히 로드됨");
        return;
      }

      // 이미 스크립트가 로드 중인지 확인
      const existingScript = document.querySelector(
        `script[src="${KAKAO_SRC}"]`
      );
      if (existingScript) {
        console.log("Kakao Maps SDK 스크립트 이미 로딩 중");
        return;
      }

      const script = document.createElement("script");
      script.src = KAKAO_SRC;
      script.async = true;
      script.onload = () => {
        console.log("Kakao Maps SDK 스크립트 로드 완료");
        window.kakao.maps.load(() => {
          console.log("Kakao Maps SDK 로드 완료");
          // SDK 로딩 완료 후 지도 초기화 시도
          setTimeout(() => {
            if (mapRef.current && !mapInstanceRef.current) {
              console.log("SDK 로딩 완료 후 지도 초기화 시도");
            }
          }, 100);
        });
      };
      script.onerror = () => {
        console.error("Kakao Maps SDK 로드 실패");
      };
      document.head.appendChild(script);
    };

    loadKakaoMaps();
  }, []);

  return (
    <div className="relative">
      {/* 지도 컨테이너 */}
      <div
        ref={mapRef}
        style={{ width, height }}
        className={`${className} touch-pan-x touch-pan-y`}
      />

      {/* 범위 선택 버튼 */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-10">
        <div className="flex gap-2">
          {[1, 5, 10].map((radius) => (
            <button
              key={radius}
              onClick={() => setSelectedRadius(radius)}
              className={`px-3 py-1 text-sm rounded ${
                selectedRadius === radius
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {radius}km
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 선택 버튼 - 좌측 상단 한 줄 */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-10">
        <div className="flex flex-wrap gap-1">
          {[
            { value: "all", label: "전체", icon: "📍" },
            { value: "마트", label: "마트", icon: "🛒" },
            { value: "화장실", label: "화장실", icon: "🚿" },
            { value: "주유소", label: "주유소", icon: "⛽" },
            { value: "전기차충전소", label: "충전소", icon: "🔌" },
            { value: "클린하우스", label: "클린하우스", icon: "🏠" },
            { value: "은행", label: "은행", icon: "🏦" },
            { value: "편의점", label: "편의점", icon: "🏪" },
            { value: "시장", label: "시장", icon: "🥬" },
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-2 py-1 text-xs rounded transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category.value
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1 font-bold">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* 시설 목록 - 지도 아래 */}
      {facilities.length > 0 && (
        <div className="mt-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>📍</span>
              주변 편의시설 ({facilities.length}개)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {facilities.map((facility, index) => (
                <div
                  key={facility.id}
                  className="bg-white/80 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    // 마커 클릭과 동일한 효과
                    const marker = facilityMarkersRef.current[index];
                    if (marker) {
                      const infoWindow = infoWindowsRef.current[index];
                      if (infoWindow) {
                        // 기존 인포윈도우 닫기
                        infoWindowsRef.current.forEach((iw) => {
                          if (iw && iw.close) {
                            iw.close();
                          }
                        });
                        // 새 인포윈도우 열기
                        infoWindow.open(mapInstanceRef.current, marker);
                        mapInstanceRef.current.panTo(marker.getPosition());
                      }
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {getMarkerIcon(facility.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm truncate">
                        {facility.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {facility.address}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {facility.category}
                        </span>
                        {facility.distance && (
                          <span className="text-xs text-gray-500">
                            {facility.distance.toFixed(1)}km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
