import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchMovies } from "../lib/tmdb-api";
import { useLocation } from "wouter";
import { debounce } from "lodash-es";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [, setLocation] = useLocation();

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim().length > 2) {
        setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 2) {
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={handleInputChange}
          className="bg-card-grey text-white px-4 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-netflix-red transition-all duration-200 border-none"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-grey" size={16} />
      </div>
    </form>
  );
}
