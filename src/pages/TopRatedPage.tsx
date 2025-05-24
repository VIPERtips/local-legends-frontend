
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Business } from '../types';
import BusinessCard from '../components/BusinessCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const TopRatedPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { toast } = useToast();

  const categories = [
    'Restaurant', 'Retail', 'Services', 'Entertainment', 
    'Healthcare', 'Automotive', 'Beauty', 'Fitness'
  ];

  const fetchTopRatedBusinesses = async (category?: string) => {
    setLoading(true);
    try {
      const data = await apiService.getTopRatedBusinesses(category);
      setBusinesses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load top-rated businesses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopRatedBusinesses();
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    fetchTopRatedBusinesses(value || undefined);
  };

  return (
    <div className="min-h-screen bg-appBg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-appText mb-6">Top Rated Businesses</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-appText">Filter by category:</label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No top-rated businesses found</p>
            <p className="text-gray-500 mt-2">
              {selectedCategory ? 
                `Try selecting a different category` : 
                `Check back later for top-rated businesses`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRatedPage;
