
import React from 'react';
import { Link } from 'react-router-dom';
import { Business } from '../types';
import StarRating from './StarRating';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Star, Award } from 'lucide-react';

interface ModernBusinessCardProps {
  business: Business;
  distance?: number;
  userLocation?: { lat: number; lng: number };
}

const getCategoryTheme = (category: string) => {
  const themes = {
    'Healthcare': {
      gradient: 'from-blue-500 to-cyan-400',
      bgGradient: 'from-blue-50 to-cyan-50',
      icon: '🏥',
      color: 'text-blue-600'
    },
    'Restaurant': {
      gradient: 'from-orange-500 to-red-400',
      bgGradient: 'from-orange-50 to-red-50',
      icon: '🍕',
      color: 'text-orange-600'
    },
    'Retail': {
      gradient: 'from-green-500 to-emerald-400',
      bgGradient: 'from-green-50 to-emerald-50',
      icon: '🛍️',
      color: 'text-green-600'
    },
    'Services': {
      gradient: 'from-purple-500 to-indigo-400',
      bgGradient: 'from-purple-50 to-indigo-50',
      icon: '🔧',
      color: 'text-purple-600'
    },
    'Entertainment': {
      gradient: 'from-pink-500 to-rose-400',
      bgGradient: 'from-pink-50 to-rose-50',
      icon: '🎪',
      color: 'text-pink-600'
    },
    'Automotive': {
      gradient: 'from-gray-500 to-slate-400',
      bgGradient: 'from-gray-50 to-slate-50',
      icon: '🚗',
      color: 'text-gray-600'
    },
    'Beauty': {
      gradient: 'from-rose-500 to-pink-400',
      bgGradient: 'from-rose-50 to-pink-50',
      icon: '💄',
      color: 'text-rose-600'
    },
    'Fitness': {
      gradient: 'from-teal-500 to-green-400',
      bgGradient: 'from-teal-50 to-green-50',
      icon: '💪',
      color: 'text-teal-600'
    }
  };
  
  return themes[category as keyof typeof themes] || themes['Services'];
};

const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const ModernBusinessCard: React.FC<ModernBusinessCardProps> = ({ 
  business, 
  userLocation 
}) => {
  const theme = getCategoryTheme(business.category);
  
  const distance = userLocation ? 
    calculateDistance(
      userLocation.lat, 
      userLocation.lng, 
      business.latitude || 0, 
      business.longitude || 0
    ) : null;

  const isHighlyRated = business.averageRating >= 4.5;
  const isPopular = business.reviewCount >= 50;

  return (
    <Card className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br ${theme.bgGradient}`}>
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${theme.gradient}`} />
      
      {/* Status Badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {isHighlyRated && (
          <Badge className="bg-yellow-500 text-white border-0 shadow-md">
            <Star className="h-3 w-3 mr-1" />
            Top Rated
          </Badge>
        )}
        {isPopular && (
          <Badge className="bg-purple-500 text-white border-0 shadow-md">
            <Award className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        {/* Business Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{theme.icon}</span>
              <Badge variant="secondary" className={`${theme.color} bg-white/70 border-0`}>
                {business.category}
              </Badge>
            </div>
            
            <Link 
              to={`/businesses/${business.id}`} 
              className="group-hover:text-primary transition-colors duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                {business.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {business.description}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <StarRating rating={business.averageRating} readonly size="sm" />
            <span className="text-sm font-semibold text-gray-800">
              {business.averageRating}
            </span>
            <span className="text-sm text-gray-500">
              ({business.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Location & Distance */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="flex-1">
            {business.city}, {business.state}
          </span>
          {distance && (
            <span className="font-medium text-purple-600">
              {distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            className={`flex-1 bg-gradient-to-r ${theme.gradient} hover:opacity-90 text-white border-0 shadow-md`}
            asChild
          >
            <Link to={`/businesses/${business.id}`}>
              View Details
            </Link>
          </Button>
          
          {business.phone && (
            <Button 
              size="sm" 
              variant="outline" 
              className="border-2 hover:bg-white/50"
              onClick={() => window.open(`tel:${business.phone}`)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Business Hours Indicator */}
        <div className="flex items-center mt-3 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          <span className="text-green-600 font-medium">Open Now</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernBusinessCard;
