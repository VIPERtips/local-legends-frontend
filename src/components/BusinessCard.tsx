
import React from 'react';
import { Link } from 'react-router-dom';
import { Business } from '../types';
import StarRating from './StarRating';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link to={`/businesses/${business.id}`} className="text-primary hover:text-primary/80">
            {business.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">{business.description}</p>
          <p className="text-sm font-medium text-secondary">{business.category}</p>
          <p className="text-sm text-gray-500">
            {business.city}, {business.state}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StarRating rating={business.averageRating} readonly size="sm" />
              <span className="text-sm text-gray-600">
                ({business.reviewCount} reviews)
              </span>
            </div>
            <span className="text-sm font-semibold text-primary">
              {business.averageRating}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessCard;
