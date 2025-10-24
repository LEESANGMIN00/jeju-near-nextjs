import React from "react";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  return (
    <footer className={`bg-gray-800 text-white py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400">
            © 2025 제주니어(JejuNear). 제주도 여행 정보를 제공합니다.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>제주도 관광 정보 사이트</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


