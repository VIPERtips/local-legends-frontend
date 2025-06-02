
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Business } from '../types';
import ModernBusinessCard from '../components/ModernBusinessCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Star, Trophy, MapPin } from 'lucide-react';

const TopRatedPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const categories = [
    'Restaurant', 'Retail', 'Services', 'Entertainment', 
    'Healthcare', 'Automotive', 'Beauty', 'Fitness'
  ];

  const fetchTopRatedBusinesses = async (category?: string) => {
    setLoading(true);
    try {
      const data = await apiService.getTopRatedBusinesses(category);
      console.log("Top rated businesses response:", data.content);
      // Handle the correct response structure - data is already the array
      setBusinesses(Array.isArray(data.content) ? data.content : []);
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

  useEffect(() => {
    fetchTopRatedBusinesses();
    getUserLocation();
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value);
    fetchTopRatedBusinesses(value === "all" ? undefined : value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="h-12 w-12 text-yellow-300 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Top Rated Businesses</h1>
          </div>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Discover the highest-rated businesses in your area, chosen by real customers like you
          </p>
          <div className="flex items-center justify-center mt-6">
            <Star className="h-5 w-5 text-yellow-300 mr-2" />
            <span className="text-lg">Only businesses with 4.0+ ratings</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-xl border-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">Filter by category:</span>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-64 border-2 border-purple-200 focus:border-purple-400 rounded-lg">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {userLocation && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <Badge className="bg-green-100 text-green-800 border-0">
                    Location Enabled
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 text-lg">Finding the best businesses for you...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <p className="text-2xl text-gray-600 font-semibold mb-2">No top-rated businesses found</p>
            <p className="text-gray-500 text-lg">
              {selectedCategory ? 
                `Try selecting a different category` : 
                `Check back later for top-rated businesses`
              }
            </p>
            {selectedCategory && (
              <Button 
                onClick={() => handleCategoryChange('all')} 
                className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                View All Categories
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {businesses.length} Top Rated Business{businesses.length !== 1 ? 'es' : ''}
                </h2>
                {selectedCategory && (
                  <Badge className="bg-purple-100 text-purple-800 border-0 text-sm">
                    {selectedCategory}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businesses.map((business) => (
                <ModernBusinessCard 
                  key={business.id} 
                  business={business} 
                  userLocation={userLocation}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopRatedPage;
