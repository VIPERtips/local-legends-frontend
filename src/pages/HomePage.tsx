
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { Business } from '../types';
import ModernBusinessCard from '../components/ModernBusinessCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Search, MapPin, TrendingUp, Award } from 'lucide-react';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchFeaturedBusinesses = async () => {
    try {
      const data = await apiService.getTopRatedBusinesses();
      setFeaturedBusinesses(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch (error) {
      console.error('Error fetching featured businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
    fetchFeaturedBusinesses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your Next Favorite
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Local Business
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Find the best local businesses in your area. Read reviews, discover hidden gems, 
              and support your community with Local Legends.
            </p>
            
            {userLocation && (
              <div className="flex items-center justify-center mb-8">
                <MapPin className="h-6 w-6 text-green-300 mr-3" />
                <Badge className="bg-green-500/20 text-green-100 border-green-300 text-lg px-4 py-2">
                  Location Services Enabled
                </Badge>
              </div>
            )}
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/businesses">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Search className="h-6 w-6 mr-3" />
                    Browse Businesses
                  </Button>
                </Link>
                <Link to="/add-business">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Star className="h-6 w-6 mr-3" />
                    Add Your Business
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                    🚀 Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-12">
            Why Choose Local Legends?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🔍 Discover</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Find amazing local businesses with powerful search and filtering options tailored to your location.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">⭐ Review</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Share your experiences and help others make informed decisions with detailed reviews.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🤝 Connect</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Build stronger connections between businesses and their communities for mutual growth.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-800">Featured Businesses</h2>
              </div>
              <Link to="/top-rated">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  View All Top Rated
                </Button>
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading featured businesses...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredBusinesses.map((business) => (
                  <ModernBusinessCard 
                    key={business.id} 
                    business={business} 
                    userLocation={userLocation}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users discovering and supporting local businesses in their community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/businesses">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-lg px-8 py-4 rounded-xl shadow-lg">
                    Start Exploring
                  </Button>
                </Link>
                <Link to="/add-business">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold text-lg px-8 py-4 rounded-xl">
                    List Your Business
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg">
                  Join Local Legends Today
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
