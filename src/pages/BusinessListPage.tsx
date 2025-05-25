import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Business, PaginatedResponse } from '../types';
import BusinessCard from '../components/BusinessCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const BusinessListPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  const categories = [
    'Restaurant', 'Retail', 'Services', 'Entertainment', 
    'Healthcare', 'Automotive', 'Beauty', 'Fitness'
  ];

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
      
      // Handle direct response structure
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

  return (
    <div className="min-h-screen bg-appBg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-appText mb-6">Browse Businesses</h1>
          
          {/* Search and Filter Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
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
              
              <Input
                placeholder="Location (city, state)"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              
              <div className="flex space-x-2">
                <Button onClick={handleSearch} className="flex-1">
                  Search
                </Button>
                <Button onClick={clearFilters} variant="outline">
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No businesses found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            {/* Business Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  variant="outline"
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
                    >
                      {pageNum + 1}
                    </Button>
                  );
                })}
                
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  variant="outline"
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
