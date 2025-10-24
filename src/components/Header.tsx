"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const pathname = usePathname();

  return (
    <header
      className={`bg-white/10 backdrop-blur-md shadow-sm border-b border-white/20 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 sm:py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-black">
                JejuNear
              </h1>
              <span className="ml-2 text-xs sm:text-sm text-gray-500 hidden sm:inline"></span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            <Link
              href="/"
              className={`transition-colors text-sm lg:text-base ${
                pathname === "/"
                  ? "text-black font-semibold"
                  : "text-black/70 hover:text-black"
              }`}
            >
              홈
            </Link>

            <Link
              href="/map"
              className={`transition-colors text-sm lg:text-base ${
                pathname === "/map"
                  ? "text-black font-semibold"
                  : "text-black/70 hover:text-black"
              }`}
            >
              지도
            </Link>
          </nav>

          <div className="md:hidden">
            <button className="text-black/70 hover:text-black p-1">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
