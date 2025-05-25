
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { Business, Review } from '../types';
import { useAuth } from '../contexts/AuthContext';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [claimEvidence, setClaimEvidence] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchBusinessDetails();
    }
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      const [businessData, reviewsData] = await Promise.all([
        apiService.getBusiness(Number(id)),
        apiService.getBusinessReviews(Number(id)),
      ]);
      console.log(businessData)
      setBusiness(businessData);
      setReviews(reviewsData);
    } catch (error) {
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
    if (!reviewComment.trim()) {
      toast({
        title: "Error",
        description: "Please add a comment to your review",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReview(true);
    try {
      await apiService.addReview(Number(id), {
        rating: reviewRating,
        comment: reviewComment,
      });
      
      toast({
        title: "Success",
        description: "Review submitted successfully!",
      });
      
      setReviewComment('');
      setReviewRating(5);
      setShowReviewDialog(false);
      fetchBusinessDetails(); // Refresh to show new review
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

  const handleSubmitClaim = async () => {
    if (!claimEvidence.trim()) {
      toast({
        title: "Error",
        description: "Please provide evidence for your claim",
        variant: "destructive",
      });
      return;
    }

    setSubmittingClaim(true);
    try {
      await apiService.submitClaim(Number(id), claimEvidence);
      
      toast({
        title: "Success",
        description: "Claim submitted successfully! We'll review it soon.",
      });
      
      setClaimEvidence('');
      setShowClaimDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit claim",
        variant: "destructive",
      });
    } finally {
      setSubmittingClaim(false);
    }
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
          <h1 className="text-2xl font-bold text-appText">Business not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-appBg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Business Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl text-primary">{business.name}</CardTitle>
                    <p className="text-lg text-secondary mt-2">{business.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <StarRating rating={business.averageRating} readonly />
                      <span className="text-2xl font-bold text-primary">
                        {business.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {business.reviewCount} reviews
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{business.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-appText mb-3">Contact Info</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span> {business.phone}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {business.email}
                      </p>
                      {business.website && (
                        <p className="text-gray-600">
                          <span className="font-medium">Website:</span>{' '}
                          <a 
                            href={business.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {business.website}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-appText mb-3">Location</h3>
                    <div className="text-gray-600">
                      <p>{business.address}</p>
                      <p>{business.city}, {business.state} {business.zipCode}</p>
                    </div>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="flex space-x-4 mt-6 pt-6 border-t">
                    <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                          Write a Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Write a Review for {business.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <StarRating 
                              rating={reviewRating} 
                              onRatingChange={setReviewRating}
                              size="lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Comment</label>
                            <Textarea
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
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
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          Claim This Business
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Claim {business.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-600">
                            Please provide evidence that you own or manage this business.
                          </p>
                          <Textarea
                            value={claimEvidence}
                            onChange={(e) => setClaimEvidence(e.target.value)}
                            placeholder="Describe your ownership/management role and provide any relevant details..."
                            rows={4}
                          />
                          <Button 
                            onClick={handleSubmitClaim}
                            disabled={submittingClaim}
                            className="w-full"
                          >
                            {submittingClaim ? <LoadingSpinner size="sm" /> : 'Submit Claim'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-appText">
                            {review.userFirstName} {review.userLastName}
                          </span>
                          <StarRating rating={review.rating} readonly size="sm" />
                        </div>
                        {review.comment && (
                          <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
