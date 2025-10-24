/** @type {import('next').NextConfig} */
const nextConfig = {
  // HTTPS 및 보안 헤더 설정
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

  // cafe24 Node.js 서버 배포 설정
  output: "standalone",

  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 이미지 최적화 설정
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },

  // 트레일링 슬래시 제거
  trailingSlash: false,

  // 압축 설정
  compress: true,

  // 개발 서버 설정
  devIndicators: {
    buildActivity: false,
  },
};

module.exports = nextConfig;

