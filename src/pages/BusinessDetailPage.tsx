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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
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
      const [businessResponse, reviewsResponse] = await Promise.all([
        apiService.getBusiness(Number(id)),
        apiService.getBusinessReviews(Number(id)),
      ]);
      
      console.log('Business response:', businessResponse);
      console.log('Reviews response:', reviewsResponse);
      
      // Handle direct response structure
      setBusiness(businessResponse);
      setReviews(Array.isArray(reviewsResponse) ? reviewsResponse : []);
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
        title: "Success",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-appBg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-appBg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-appText mb-2">Business not found</h2>
          <p className="text-gray-600">The business you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-appBg py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Business Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl text-appText mb-2">
                  {business.name}
                </CardTitle>
                <Badge variant="secondary" className="mb-4">
                  {business.category}
                </Badge>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <StarRating rating={business.averageRating} />
                  <span>({business.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{business.description}</p>
            
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {business.address}, {business.city}, {business.state} {business.zipCode}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{business.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{business.email}</span>
              </div>
              {business.website && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Review */}
          {isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rating</Label>
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                    interactive
                  />
                </div>
                <div>
                  <Label htmlFor="comment">Comment</Label>
                  <Textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your experience..."
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleSubmitReview} 
                  disabled={submittingReview}
                  className="w-full"
                >
                  {submittingReview ? <LoadingSpinner size="sm" /> : 'Submit Review'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">
                            {review.userFirstName} {review.userLastName}
                          </p>
                          <StarRating rating={review.rating} />
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700 mt-2">{review.comment}</p>
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
