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
      if (query.trim().length > 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const [usersResponse, requestsResponse] = await Promise.all([
        usersApi.searchByName(searchQuery).catch(() => ({ data: [] })),
        requestsApi.searchByTitle(searchQuery).catch(() => ({ data: [] })),
      ]);

      const searchResults: SearchResult[] = [];

      // Add users to results
      if (usersResponse.data) {
        usersResponse.data.forEach((user: UserType) => {
          searchResults.push({
            type: 'user',
            id: user.userId,
            title: user.name,
            subtitle: `${user.role} • ${user.district || user.location?.district}, ${user.province || user.location?.province}`,
            icon: User,
          });
        });
      }

      // Add requests to results
      if (requestsResponse.data) {
        requestsResponse.data.forEach((request: Request) => {
          searchResults.push({
            type: 'request',
            id: request.requestId,
            title: request.title,
            subtitle: `${request.status} • ${request.citizen.name}`,
            icon: FileText,
          });
        });
      }

      setResults(searchResults.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'user':
        navigate(`/users/${result.id}`);
        break;
      case 'request':
        navigate(`/requests/${result.id}`);
        break;
      case 'assignment':
        navigate(`/assignments/${result.id}`);
        break;
    }
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search across the system..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            autoFocus
          />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            Searching...
          </div>
        ) : results.length > 0 ? (
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <result.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {result.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.subtitle}
                  </p>
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {result.type}
                </div>
              </button>
            ))}
          </div>
        ) : query.trim().length > 2 ? (
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p>No results found for "{query}"</p>
            <p className="text-xs mt-1">Try searching for users, requests, or assignments</p>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p>Start typing to search...</p>
            <p className="text-xs mt-1">Search users, requests, assignments, and more</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;