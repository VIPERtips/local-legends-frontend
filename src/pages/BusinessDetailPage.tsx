
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { Business, Review } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import BusinessClaimForm from '../components/BusinessClaimForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  Clock,
  Stethoscope,
  Coffee,
  ShoppingBag,
  Wrench,
  Film,
  Truck,
  Lollipop,
  Dumbbell,
} from 'lucide-react'

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      fetchBusinessDetails();
    }
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const [businessResponse, reviewsResponse]: any = await Promise.all([
        apiService.getBusiness(Number(id)),
        apiService.getBusinessReviews(Number(id)),
      ]);
      
      console.log('Business response:', businessResponse.data);
      console.log('Reviews response:', reviewsResponse.data.content);
      
      setBusiness(businessResponse.data);
      setReviews(Array.isArray(reviewsResponse.data.content) ? reviewsResponse.data.content : []);
    } catch (error) {
      console.error('Error fetching business details:', error);
      toast({
        title: "Error",
        description: "Failed to load business details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReview(true);
    try {
      await apiService.addReview(Number(id), newReview);
      toast({
        title: "Success! 🎉",
        description: "Review submitted successfully!",
      });
      setNewReview({ rating: 5, comment: '' });
      fetchBusinessDetails();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryTheme = (category: string) => {
    const themes: Record<
      string,
      { gradient: string; icon: React.ReactNode }
    > = {
      Healthcare: {
        gradient: 'from-blue-500 to-cyan-400',
        icon: <Stethoscope className="h-8 w-8 text-blue-600" />,
      },
      Restaurant: {
        gradient: 'from-orange-500 to-red-400',
        icon: <Coffee className="h-8 w-8 text-orange-600" />,
      },
      Retail: {
        gradient: 'from-green-500 to-emerald-400',
        icon: <ShoppingBag className="h-8 w-8 text-green-600" />,
      },
      Services: {
        gradient: 'from-purple-500 to-indigo-400',
        icon: <Wrench className="h-8 w-8 text-purple-600" />,
      },
      Entertainment: {
        gradient: 'from-pink-500 to-rose-400',
        icon: <Film className="h-8 w-8 text-pink-600" />,
      },
      Automotive: {
        gradient: 'from-gray-500 to-slate-400',
        icon: <Truck className="h-8 w-8 text-gray-600" />,
      },
      Beauty: {
        gradient: 'from-rose-500 to-pink-400',
        icon: <Lollipop className="h-8 w-8 text-rose-600" />,
      },
      Fitness: {
        gradient: 'from-teal-500 to-green-400',
        icon: <Dumbbell className="h-8 w-8 text-teal-600" />,
      },
    }
    return themes[category] || themes['Services']
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 text-lg">Loading business details...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <Card className="text-center p-8 shadow-xl border-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Business not found</h2>
          <p className="text-gray-600">The business you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  const theme = getCategoryTheme(business.category);
  const isHighlyRated = business.averageRating >= 4.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Business Header */}
        <Card className="mb-8 shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur">
          <div className={`h-3 bg-gradient-to-r ${theme.gradient}`} />
          <CardHeader className="relative">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{theme.icon}</span>
                  <Badge className="bg-purple-100 text-purple-800 border-0 text-lg px-4 py-1">
                    {business.category}
                  </Badge>
                  {isHighlyRated && (
                    <Badge className="bg-yellow-500 text-white border-0 text-sm px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Top Rated
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  {business.name}
                </CardTitle>
                <div className="flex items-center space-x-4 text-lg">
                  <StarRating rating={business.averageRating} size="lg" />
                  <span className="font-bold text-2xl text-gray-800">{business.averageRating}</span>
                  <span className="text-gray-600">({business.reviewCount} reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-500" />
                <Badge className="bg-green-100 text-green-800 border-0">Open Now</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">{business.description}</p>
            
            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">
                    {business.address}, {business.city}, {business.state} {business.zipCode}
                  </span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">{business.phone}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">{business.email}</span>
                </div>
                {business.website && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Claim Business Button */}
            {isAuthenticated && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() => setShowClaimForm(!showClaimForm)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  🏢 Claim This Business
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Claim Form */}
        {showClaimForm && isAuthenticated && (
          <div className="mb-8">
            <BusinessClaimForm
              businessId={business.id}
              businessName={business.name}
              onClaimSubmitted={() => setShowClaimForm(false)}
            />
          </div>
        )}

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Review */}
          {isAuthenticated && (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-400 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Write a Review</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label className="text-gray-700 font-semibold">Rating</Label>
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  />
                </div>
                <div>
                  <Label htmlFor="comment" className="text-gray-700 font-semibold">Comment</Label>
                  <Textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your experience..."
                    rows={4}
                    className="border-2 border-green-200 focus:border-green-400 rounded-lg resize-none"
                  />
                </div>
                <Button 
                  onClick={handleSubmitReview} 
                  disabled={submittingReview}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white py-3 rounded-lg font-semibold shadow-lg"
                >
                  {submittingReview ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Star className="h-5 w-5 mr-2" />
                      Submit Review
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Reviews ({reviews.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 max-h-96 overflow-y-auto">
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-400">Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800 text-lg">
                            {review.user?.name || 'Anonymous User'}
                          </p>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
