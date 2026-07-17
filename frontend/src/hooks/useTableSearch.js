import { useState, useEffect, useCallback } from "react";
export default function useTableSearch(delay = 300) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);
  return { searchTerm, debouncedSearch, handleSearch };
}
