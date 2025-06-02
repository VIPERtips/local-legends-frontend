
import React from 'react';
import { Link } from 'react-router-dom';
import { Business } from '../types';
import StarRating from './StarRating';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Star, Award, Stethoscope, Coffee, Dumbbell, Film, Lollipop, ShoppingBag, Truck, Wrench } from 'lucide-react';

interface ModernBusinessCardProps {
  business: Business;
  distance?: number;
  userLocation?: { lat: number; lng: number };
}

const getCategoryTheme = (category: string) => {
  const themes: Record<
    string,
    { bgGradient: string; color: string; icon: React.ReactNode; borderColor: string }
  > = {
    Healthcare: {
      bgGradient: 'from-blue-500 to-cyan-400',
      color: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: <Stethoscope className="h-6 w-6 text-blue-600" />,
    },
    Restaurant: {
      bgGradient: 'from-orange-500 to-red-400',
      color: 'text-orange-700',
      borderColor: 'border-orange-200',
      icon: <Coffee className="h-6 w-6 text-orange-600" />,
    },
    Retail: {
      bgGradient: 'from-green-500 to-emerald-400',
      color: 'text-green-700',
      borderColor: 'border-green-200',
      icon: <ShoppingBag className="h-6 w-6 text-green-600" />,
    },
    Services: {
      bgGradient: 'from-purple-500 to-indigo-400',
      color: 'text-purple-700',
      borderColor: 'border-purple-200',
      icon: <Wrench className="h-6 w-6 text-purple-600" />,
    },
    Entertainment: {
      bgGradient: 'from-pink-500 to-rose-400',
      color: 'text-pink-700',
      borderColor: 'border-pink-200',
      icon: <Film className="h-6 w-6 text-pink-600" />,
    },
    Automotive: {
      bgGradient: 'from-gray-500 to-slate-400',
      color: 'text-gray-700',
      borderColor: 'border-gray-200',
      icon: <Truck className="h-6 w-6 text-gray-600" />,
    },
    Beauty: {
      bgGradient: 'from-rose-500 to-pink-400',
      color: 'text-rose-700',
      borderColor: 'border-rose-200',
      icon: <Lollipop className="h-6 w-6 text-rose-600" />,
    },
    Fitness: {
      bgGradient: 'from-teal-500 to-green-400',
      color: 'text-teal-700',
      borderColor: 'border-teal-200',
      icon: <Dumbbell className="h-6 w-6 text-teal-600" />,
    },
  };
  return themes[category] || themes['Services'];
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
    <Card className={`group relative overflow-hidden border-2 ${theme.borderColor} shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white`}>
      {/* Gradient Header */}
      <div className={`h-3 bg-gradient-to-r ${theme.bgGradient}`} />
      
      {/* Status Badges */}
      <div className="absolute top-5 right-4 flex flex-col gap-2 z-10">
        {isHighlyRated && (
          <Badge className="bg-yellow-500 text-white border-0 shadow-lg">
            <Star className="h-3 w-3 mr-1" />
            Top Rated
          </Badge>
        )}
        {isPopular && (
          <Badge className="bg-purple-500 text-white border-0 shadow-lg">
            <Award className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        {/* Business Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 bg-gradient-to-r ${theme.bgGradient} rounded-lg shadow-md`}>
                {theme.icon}
              </div>
              <Badge variant="outline" className={`${theme.color} border-2 ${theme.borderColor} bg-white font-semibold`}>
                {business.category}
              </Badge>
            </div>
            
            <Link 
              to={`/businesses/${business.id}`} 
              className="group-hover:text-primary transition-colors duration-300"
            >
              <h3 className={`text-xl font-bold ${theme.color} line-clamp-1 group-hover:text-purple-600 transition-colors mb-2`}>
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
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <StarRating rating={business.averageRating} readonly size="sm" />
            <span className="text-sm font-bold text-gray-800">
              {business.averageRating}
            </span>
            <span className="text-sm text-gray-500">
              ({business.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Location & Distance */}
        <div className="flex items-center text-gray-600 text-sm mb-4 p-2 bg-gray-50 rounded-lg">
          <MapPin className="h-4 w-4 mr-2 text-purple-600" />
          <span className="flex-1">
            {business.city}, {business.state}
          </span>
          {distance && (
            <span className="font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full text-xs">
              {distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            className={`flex-1 bg-gradient-to-r ${theme.bgGradient} hover:opacity-90 text-white border-0 shadow-lg font-semibold`}
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
              className={`border-2 ${theme.borderColor} ${theme.color} hover:bg-gray-50`}
              onClick={() => window.open(`tel:${business.phone}`)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Business Hours Indicator */}
        <div className="flex items-center mt-3 text-xs bg-green-50 p-2 rounded-lg">
          <Clock className="h-3 w-3 mr-1 text-green-600" />
          <span className="text-green-700 font-semibold">Open Now</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernBusinessCard;
