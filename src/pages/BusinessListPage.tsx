
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Business, PaginatedResponse } from '../types';
import ModernBusinessCard from '../components/ModernBusinessCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, MapPin, Filter, X } from 'lucide-react';

const BusinessListPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const categories = [
    'Restaurant', 'Retail', 'Services', 'Entertainment', 
    'Healthcare', 'Automotive', 'Beauty', 'Fitness'
  ];

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  };

  const fetchBusinesses = async (page = 0) => {
    setLoading(true);
    try {
      let response: PaginatedResponse<Business>;
      
      if (searchTerm || selectedCategory || selectedLocation) {
        response = await apiService.searchBusinesses({
          name: searchTerm || undefined,
          category: selectedCategory || undefined,
          location: selectedLocation || undefined,
          page,
          size: 12,
        });
      } else {
        response = await apiService.getBusinesses(page, 12);
      }
      
      console.log("API response:", response);
      
      const businessData = response.content || [];
      const totalPagesCount = response.totalPages || 0;
      
      setBusinesses(Array.isArray(businessData) ? businessData : []);
      setTotalPages(totalPagesCount);
      setCurrentPage(page);
      
      console.log("Businesses set:", businessData);
      console.log("Total pages:", totalPagesCount);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      toast({
        title: "Error",
        description: "Failed to load businesses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    getUserLocation();
  }, []);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchBusinesses(0);
  };

  const handlePageChange = (page: number) => {
    fetchBusinesses(page);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setCurrentPage(0);
    fetchBusinesses(0);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedLocation;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Businesses</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Discover amazing local businesses in your area
          </p>
          {userLocation && (
            <div className="flex items-center justify-center mt-4">
              <MapPin className="h-5 w-5 text-green-300 mr-2" />
              <span className="text-lg">Location services enabled</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-xl border-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400 rounded-lg">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Location (city, state)"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 border-2 border-purple-200 focus:border-purple-400 rounded-lg"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSearch} 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline" className="border-2 border-purple-200 hover:border-purple-400">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                {searchTerm && (
                  <Badge className="bg-purple-100 text-purple-800 border-0">
                    Search: {searchTerm}
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge className="bg-blue-100 text-blue-800 border-0">
                    Category: {selectedCategory}
                  </Badge>
                )}
                {selectedLocation && (
                  <Badge className="bg-green-100 text-green-800 border-0">
                    Location: {selectedLocation}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 text-lg">Finding amazing businesses for you...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <p className="text-2xl text-gray-600 font-semibold mb-2">No businesses found</p>
            <p className="text-gray-500 text-lg mb-4">Try adjusting your search criteria</p>
            {hasActiveFilters && (
              <Button 
                onClick={clearFilters} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {businesses.length} Business{businesses.length !== 1 ? 'es' : ''} Found
              </h2>
              {userLocation && (
                <Badge className="bg-green-100 text-green-800 border-0">
                  <MapPin className="h-3 w-3 mr-1" />
                  Sorted by distance
                </Badge>
              )}
            </div>

            {/* Business Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {businesses.map((business) => (
                <ModernBusinessCard 
                  key={business.id} 
                  business={business} 
                  userLocation={userLocation}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  variant="outline"
                  className="border-2 border-purple-200 hover:border-purple-400"
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage < 3 ? i : currentPage - 2 + i;
                  if (pageNum >= totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      className={currentPage === pageNum ? 
                        "bg-gradient-to-r from-purple-600 to-blue-600 text-white" : 
                        "border-2 border-purple-200 hover:border-purple-400"
                      }
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
                
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  variant="outline"
                  className="border-2 border-purple-200 hover:border-purple-400"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessListPage;
