import React, { useState, useEffect } from 'react';
import { Search, User, FileText } from 'lucide-react';
import { usersApi, requestsApi } from '../../services/api';
import type { User as UserType, Request } from '../../types';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  type: 'user' | 'request' | 'assignment';
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
}

interface GlobalSearchProps {
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length > 2) performSearch(query.trim());
      else setResults([]);
    }, 300);
    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const [usersResponse, requestsResponse] = await Promise.all([
        usersApi.searchByName(searchQuery).catch(() => ({ data: [] })),
        requestsApi.search({ title: searchQuery }).catch(() => ({ data: [] })),
      ]);

      const searchResults: SearchResult[] = [];
      if (usersResponse.data) {
        usersResponse.data.forEach((user: UserType) => {
          searchResults.push({
            type: 'user', id: user.userId, title: user.name,
            subtitle: `${user.role} • ${user.district || user.location?.district}, ${user.province || user.location?.province}`,
            icon: User,
          });
        });
      }
      if (requestsResponse.data) {
        (Array.isArray(requestsResponse.data) ? requestsResponse.data : requestsResponse.data.content || [])
          .forEach((request: Request) => {
            searchResults.push({
              type: 'request', id: request.requestId, title: request.title,
              subtitle: `${request.status} • ${request.citizen.name}`, icon: FileText,
            });
          });
      }
      setResults(searchResults.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'user': navigate(`/users/${result.id}`); break;
      case 'request': navigate(`/requests/${result.id}`); break;
      case 'assignment': navigate(`/assignments/${result.id}`); break;
    }
    onClose();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft-lg dark:shadow-slate-900/60 border border-gray-200 dark:border-slate-700 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search across the system..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            autoFocus
          />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 dark:text-slate-400">
            <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-2" />
            Searching...
          </div>
        ) : results.length > 0 ? (
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:bg-slate-700 flex items-center space-x-3 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <result.icon className="w-4 h-4 text-gray-600 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{result.title}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{result.subtitle}</p>
                </div>
                <div className="text-xs text-gray-400 dark:text-slate-500 capitalize flex-shrink-0">{result.type}</div>
              </button>
            ))}
          </div>
        ) : query.trim().length > 2 ? (
          <div className="p-4 text-center text-gray-500 dark:text-slate-400">
            <Search className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
            <p>No results found for "{query}"</p>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-slate-400">
            <Search className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
            <p>Start typing to search…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
