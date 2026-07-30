import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface SearchContextValue {
  isOpen: boolean;
  query: string;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);
  const toggleSearch = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <SearchContext.Provider value={{ isOpen, query, openSearch, closeSearch, toggleSearch, setQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
