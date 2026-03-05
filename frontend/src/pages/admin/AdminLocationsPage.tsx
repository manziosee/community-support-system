import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, ChevronRight, ChevronDown, Loader2, RefreshCw, Globe, Building2, Landmark, Home, Map } from 'lucide-react';
import { rwandaLocationsApi } from '../../services/api';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

type Level = 'province' | 'district' | 'sector' | 'cell' | 'village';

interface BreadcrumbItem {
  level: Level;
  name: string;
}

const PROVINCE_COLORS: Record<string, string> = {
  'Kigali': 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe] dark:bg-[#1e3a5f] dark:text-[#93c5fd] dark:border-[#1d4ed8]',
  'East':   'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0] dark:bg-[#14352a] dark:text-[#86efac] dark:border-[#15803d]',
  'West':   'bg-[#faf5ff] text-[#7c3aed] border-[#e9d5ff] dark:bg-[#2e1a4a] dark:text-[#c4b5fd] dark:border-[#7c3aed]',
  'South':  'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa] dark:bg-[#431a07] dark:text-[#fdba74] dark:border-[#c2410c]',
  'North':  'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca] dark:bg-[#450a0a] dark:text-[#fca5a5] dark:border-[#b91c1c]',
};

const PROVINCE_BG: Record<string, string> = {
  'Kigali': 'from-[#3b82f6] to-[#2563eb]',
  'East':   'from-[#22c55e] to-[#16a34a]',
  'West':   'from-[#a855f7] to-[#7c3aed]',
  'South':  'from-[#f97316] to-[#ea580c]',
  'North':  'from-[#ef4444] to-[#dc2626]',
};

const LEVEL_ICONS: Record<Level, React.FC<{ className?: string }>> = {
  province: Globe,
  district: Building2,
  sector: Landmark,
  cell: Home,
  village: Map,
};

const AdminLocationsPage: React.FC = () => {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Navigation state
  const [currentLevel, setCurrentLevel] = useState<Level>('province');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedCell, setSelectedCell] = useState('');

  // Stats
  const [districtCounts, setDistrictCounts] = useState<Record<string, number>>({});

  // Load provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await rwandaLocationsApi.getProvinces();
        const data = response.data?.data || response.data || [];
        setProvinces(data);
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch provinces:', err);
        setError('Failed to load provinces from Rwanda API');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  // Load district counts for province summary
  useEffect(() => {
    if (provinces.length === 0) return;
    const fetchCounts = async () => {
      const counts: Record<string, number> = {};
      for (const prov of provinces) {
        try {
          const res = await rwandaLocationsApi.getDistricts(prov);
          const data = res.data?.data || res.data || [];
          counts[prov] = data.length;
        } catch {
          counts[prov] = 0;
        }
      }
      setDistrictCounts(counts);
    };
    fetchCounts();
  }, [provinces]);

  const navigateTo = useCallback(async (level: Level, name: string) => {
    setIsLoadingItems(true);
    setError(null);
    setSearchTerm('');

    try {
      let response;
      let newProvince = selectedProvince;
      let newDistrict = selectedDistrict;
      let newSector = selectedSector;
      let newCell = selectedCell;

      switch (level) {
        case 'province':
          // Going back to province list
          setCurrentLevel('province');
          setSelectedProvince('');
          setSelectedDistrict('');
          setSelectedSector('');
          setSelectedCell('');
          setItems(provinces);
          setIsLoadingItems(false);
          return;

        case 'district':
          newProvince = name;
          response = await rwandaLocationsApi.getDistricts(name);
          setSelectedProvince(name);
          setSelectedDistrict('');
          setSelectedSector('');
          setSelectedCell('');
          break;

        case 'sector':
          newDistrict = name;
          response = await rwandaLocationsApi.getSectors(selectedProvince, name);
          setSelectedDistrict(name);
          setSelectedSector('');
          setSelectedCell('');
          break;

        case 'cell':
          newSector = name;
          response = await rwandaLocationsApi.getCells(selectedProvince, selectedDistrict, name);
          setSelectedSector(name);
          setSelectedCell('');
          break;

        case 'village':
          newCell = name;
          response = await rwandaLocationsApi.getVillages(selectedProvince, selectedDistrict, selectedSector, name);
          setSelectedCell(name);
          break;
      }

      const data = response?.data?.data || response?.data || [];
      setItems(data);
      setCurrentLevel(level);
    } catch (err) {
      console.error(`Failed to fetch ${level}:`, err);
      setError(`Failed to load ${level} data`);
    } finally {
      setIsLoadingItems(false);
    }
  }, [provinces, selectedProvince, selectedDistrict, selectedSector, selectedCell]);

  const breadcrumbs: BreadcrumbItem[] = [
    { level: 'province', name: 'Provinces' },
    ...(selectedProvince ? [{ level: 'district' as Level, name: selectedProvince }] : []),
    ...(selectedDistrict ? [{ level: 'sector' as Level, name: selectedDistrict }] : []),
    ...(selectedSector ? [{ level: 'cell' as Level, name: selectedSector }] : []),
    ...(selectedCell ? [{ level: 'village' as Level, name: selectedCell }] : []),
  ];

  const handleBreadcrumbClick = (crumb: BreadcrumbItem, index: number) => {
    if (index === breadcrumbs.length - 1) return; // Already on this level

    if (index === 0) {
      // Go back to provinces
      navigateTo('province', '');
    } else {
      // Navigate to clicked level's children
      const nextLevel: Level = ['province', 'district', 'sector', 'cell', 'village'][index + 1] as Level;
      // We need to re-fetch the data at that level
      switch (index) {
        case 1: navigateTo('district', selectedProvince); break;
        case 2: navigateTo('sector', selectedDistrict); break;
        case 3: navigateTo('cell', selectedSector); break;
      }
    }
  };

  const getNextLevel = (): Level | null => {
    const levels: Level[] = ['province', 'district', 'sector', 'cell', 'village'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const handleItemClick = (name: string) => {
    const nextLevel = getNextLevel();
    if (!nextLevel) return; // At village level, nothing to drill into
    navigateTo(nextLevel, name);
  };

  const filteredItems = searchTerm
    ? items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
    : items;

  const totalDistricts = Object.values(districtCounts).reduce((sum, c) => sum + c, 0);

  const getLevelLabel = (level: Level): string => {
    const labels: Record<Level, string> = {
      province: 'Provinces',
      district: 'Districts',
      sector: 'Sectors',
      cell: 'Cells',
      village: 'Villages',
    };
    return labels[level];
  };

  const getChildLabel = (): string => {
    const nextLevel = getNextLevel();
    return nextLevel ? getLevelLabel(nextLevel) : 'Items';
  };

  if (isLoading) return <LoadingSpinner size="lg" text="Loading locations from Rwanda API..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Location Management</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Manage Rwanda's administrative hierarchy</p>
        </div>
        <button
          onClick={() => navigateTo('province', '')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#eff6ff] rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#2563eb]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Provinces</p>
              <p className="text-2xl font-bold text-gray-900">{provinces.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#16a34a]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Districts</p>
              <p className="text-2xl font-bold text-gray-900">{totalDistricts}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#faf5ff] rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#7c3aed]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Level</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{currentLevel}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#fff7ed] rounded-lg flex items-center justify-center">
              <Landmark className="w-5 h-5 text-[#ea580c]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Showing</p>
              <p className="text-2xl font-bold text-gray-900">{filteredItems.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Breadcrumb Navigation */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center flex-wrap gap-1 flex-1">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const Icon = LEVEL_ICONS[crumb.level];
              return (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  <button
                    onClick={() => handleBreadcrumbClick(crumb, index)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isLast
                        ? 'bg-[#eff6ff] text-[#1d4ed8] cursor-default'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {crumb.name}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${getLevelLabel(currentLevel === 'province' ? 'province' : currentLevel).toLowerCase()}...`}
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button onClick={() => navigateTo('province', '')} className="mt-2 text-sm text-red-600 underline hover:text-red-800">
            Go back to provinces
          </button>
        </div>
      )}

      {/* Loading state for sub-items */}
      {isLoadingItems && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#0d9488] mr-3" />
          <span className="text-gray-600">Loading {getChildLabel().toLowerCase()}...</span>
        </div>
      )}

      {/* Items Grid */}
      {!isLoadingItems && (
        <>
          {/* Province-level: special card layout */}
          {currentLevel === 'province' && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {filteredItems.map((province) => (
                <button
                  key={province}
                  onClick={() => handleItemClick(province)}
                  className="group text-left"
                >
                  <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${PROVINCE_BG[province] || 'from-gray-500 to-gray-600'} p-6 text-white transition-all hover:shadow-lg hover:scale-[1.02]`}>
                    <Globe className="absolute top-3 right-3 w-8 h-8 opacity-20" />
                    <h3 className="text-lg font-bold mb-1">{province}</h3>
                    <p className="text-sm opacity-80">
                      {districtCounts[province] !== undefined ? `${districtCounts[province]} Districts` : 'Loading...'}
                    </p>
                    <div className="mt-4 flex items-center text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>View Districts</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Sub-levels: list layout */}
          {currentLevel !== 'province' && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map((item) => {
                const nextLevel = getNextLevel();
                const Icon = nextLevel ? LEVEL_ICONS[nextLevel] : LEVEL_ICONS[currentLevel];
                const isClickable = nextLevel !== null;

                return (
                  <button
                    key={item}
                    onClick={() => isClickable && handleItemClick(item)}
                    disabled={!isClickable}
                    className={`flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-left transition-all ${
                      isClickable ? 'hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:shadow-sm cursor-pointer group' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                        selectedProvince ? (PROVINCE_COLORS[selectedProvince] || 'bg-gray-100 text-gray-700') : 'bg-gray-100 text-gray-700'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item}</p>
                        {isClickable && (
                          <p className="text-xs text-gray-500">Click to view {nextLevel}s</p>
                        )}
                        {!isClickable && (
                          <p className="text-xs text-gray-500">Village</p>
                        )}
                      </div>
                    </div>
                    {isClickable && (
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!isLoadingItems && filteredItems.length === 0 && !error && (
            <EmptyState
              icon={MapPin}
              title="No locations found"
              description={searchTerm ? 'No locations match your search' : 'No data available at this level'}
            />
          )}
        </>
      )}

      {/* Province Summary - always show at bottom */}
      {provinces.length > 0 && (
        <Card padding="none">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Province Summary</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {provinces.map(province => (
                <button
                  key={province}
                  onClick={() => navigateTo('district', province)}
                  className="text-center p-4 border border-gray-200 dark:border-neutral-700 rounded-lg hover:border-gray-400 dark:hover:border-neutral-500 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all"
                >
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 border ${PROVINCE_COLORS[province] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {province}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {districtCounts[province] !== undefined ? districtCounts[province] : '-'}
                  </p>
                  <p className="text-xs text-gray-500">Districts</p>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminLocationsPage;
