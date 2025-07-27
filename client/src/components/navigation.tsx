import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Play } from "lucide-react";
import SearchBar from "./search-bar";

export default function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-deep-black"
          : "bg-gradient-to-b from-deep-black via-deep-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-netflix-red text-2xl font-bold flex items-center">
              <Play className="mr-2" size={24} />
              SunnyMovies
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`hover:text-light-grey transition-colors duration-200 ${
                  location === "/" ? "text-white" : "text-light-grey"
                }`}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`hover:text-light-grey transition-colors duration-200 ${
                  location.startsWith("/movies") ? "text-white" : "text-light-grey"
                }`}
              >
                Movies
              </Link>
              <Link
                href="/trending"
                className={`hover:text-light-grey transition-colors duration-200 ${
                  location === "/trending" ? "text-white" : "text-light-grey"
                }`}
              >
                Trending
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-card-grey">
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                href="/"
                className="text-light-grey hover:text-white transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="text-light-grey hover:text-white transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                href="/trending"
                className="text-light-grey hover:text-white transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <div className="pt-2">
                <SearchBar />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
